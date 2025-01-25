# Copyright (c) 2018-present, Facebook, Inc.
# All rights reserved.
#
# This source code is licensed under the license found in the
# LICENSE file in the root directory of this source tree.
#

import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, writers
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.collections import LineCollection

import numpy as np
import subprocess as sp

def get_resolution(filename):
    command = ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
               '-show_entries', 'stream=width,height', '-of', 'csv=p=0', filename]
    with sp.Popen(command, stdout=sp.PIPE, bufsize=-1) as pipe:
        for line in pipe.stdout:
            w, h = line.decode().strip().split(',')
            return int(w), int(h)
            
def get_fps(filename):
    command = ['ffprobe', '-v', 'error', '-select_streams', 'v:0',
               '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', filename]
    with sp.Popen(command, stdout=sp.PIPE, bufsize=-1) as pipe:
        for line in pipe.stdout:
            a, b = line.decode().strip().split('/')
            return int(a) / int(b)

def read_video(filename, skip=0, limit=-1):
    w, h = get_resolution(filename)
    
    command = ['ffmpeg',
            '-i', filename,
            '-f', 'image2pipe',
            '-pix_fmt', 'rgb24',
            '-vsync', '0',
            '-vcodec', 'rawvideo', '-']
    
    i = 0
    with sp.Popen(command, stdout = sp.PIPE, bufsize=-1) as pipe:
        while True:
            data = pipe.stdout.read(w*h*3)
            if not data:
                break
            i += 1
            if i > limit and limit != -1:
                continue
            if i > skip:
                yield np.frombuffer(data, dtype='uint8').reshape((h, w, 3))
            
                
#############################
def calculate_angle(joint_a, joint_b, joint_c, twod=False):
    """
    Calculate the angle at joint_b formed by joint_a -> joint_b -> joint_c.
    :param joint_a: Coordinates of the first joint (e.g., hip).
    :param joint_b: Coordinates of the middle joint (e.g., knee).
    :param joint_c: Coordinates of the last joint (e.g., ankle).
    :return: Angle in degrees.
    """
    vec1 = joint_b - joint_a
    vec2 = joint_b - joint_c
    vec1_norm = vec1 / np.linalg.norm(vec1)
    vec2_norm = vec2 / np.linalg.norm(vec2)
    dot_product = np.dot(vec1_norm, vec2_norm)
    angle = np.arccos(np.clip(dot_product, -1.0, 1.0))  # Clip to avoid numerical issues
    return vec1_norm, vec2_norm, dot_product, np.degrees(angle)  # Convert to degrees
#############################
    
def downsample_tensor(X, factor):
    length = X.shape[0]//factor * factor
    return np.mean(X[:length].reshape(-1, factor, *X.shape[1:]), axis=1)

def render_animation(keypoints, keypoints_metadata, poses, skeleton, fps, bitrate, azim, output, viewport,
                     limit=-1, downsample=1, size=6, input_video_path=None, input_video_skip=0):
    """
    TODO
    Render an animation. The supported output modes are:
     -- 'interactive': display an interactive figure
                       (also works on notebooks if associated with %matplotlib inline)
     -- 'html': render the animation as HTML5 video. Can be displayed in a notebook using HTML(...).
     -- 'filename.mp4': render and export the animation as an h264 video (requires ffmpeg).
     -- 'filename.gif': render and export the animation a gif file (requires imagemagick).
    """
    plt.ioff()
    fig = plt.figure(figsize=(size*(1 + len(poses)), size))
    ax_in = fig.add_subplot(1, 1 + len(poses), 1)
    ax_in.get_xaxis().set_visible(False)
    ax_in.get_yaxis().set_visible(False)
    ax_in.set_axis_off()
    ax_in.set_title('Input')

    ax_3d = []
    lines_3d = []
    trajectories = []
    radius = 1.7
    for index, (title, data) in enumerate(poses.items()):
        ax = fig.add_subplot(1, 1 + len(poses), index+2, projection='3d')
        ax.view_init(elev=15., azim=azim)
        ax.set_xlim3d([-radius/2, radius/2])
        ax.set_zlim3d([0, radius])
        ax.set_ylim3d([-radius/2, radius/2])
        try:
            ax.set_aspect('equal')
        except NotImplementedError:
            ax.set_aspect('auto')
        ax.set_xticklabels([])
        ax.set_yticklabels([])
        ax.set_zticklabels([])
        ax.dist = 7.5
        ax.set_title(title) #, pad=35
        ax_3d.append(ax)
        lines_3d.append([])
        trajectories.append(data[:, 0, [0, 1]])
    poses = list(poses.values())

    # Decode video
    if input_video_path is None:
        # Black background
        all_frames = np.zeros((keypoints.shape[0], viewport[1], viewport[0]), dtype='uint8')
    else:
        # Load video using ffmpeg
        all_frames = []
        for f in read_video(input_video_path, skip=input_video_skip, limit=limit):
            all_frames.append(f)
        effective_length = min(keypoints.shape[0], len(all_frames))
        all_frames = all_frames[:effective_length]
        
        keypoints = keypoints[input_video_skip:] # todo remove
        for idx in range(len(poses)):
            poses[idx] = poses[idx][input_video_skip:]
        
        if fps is None:
            fps = get_fps(input_video_path)
    
    if downsample > 1:
        keypoints = downsample_tensor(keypoints, downsample)
        all_frames = downsample_tensor(np.array(all_frames), downsample).astype('uint8')
        for idx in range(len(poses)):
            poses[idx] = downsample_tensor(poses[idx], downsample)
            trajectories[idx] = downsample_tensor(trajectories[idx], downsample)
        fps /= downsample

    initialized = False
    image = None
    lines = []
    points = None
    line_segments = [] 
    
    if limit < 1:
        limit = len(all_frames)
    else:
        limit = min(limit, len(all_frames))

    parents = skeleton.parents()




    def update_video(i):
        nonlocal initialized, image, lines, points, line_segments

        for n, ax in enumerate(ax_3d):
            # Update the 3D plot limits dynamically based on the trajectory
            ax.set_xlim3d([-radius / 2 + trajectories[n][i, 0], radius / 2 + trajectories[n][i, 0]])
            ax.set_ylim3d([-radius / 2 + trajectories[n][i, 1], radius / 2 + trajectories[n][i, 1]])
            ax.set_zlim3d([0, radius])

            ###############################
            # Get joint positions for the current frame
            pos = poses[n][i]

            joint_shoulder_idx = 14
            joint_elbow_idx = 15
            joint_wrist_idx = 16

            joint_shoulder = pos[joint_shoulder_idx]
            joint_elbow = pos[joint_elbow_idx]
            joint_wrist = pos[joint_wrist_idx]


            #2d
            # joint_shoulder = pos[joint_shoulder_idx][:2]  # Take only the first two dimensions (x, y)
            # joint_elbow = pos[joint_elbow_idx][:2]
            # joint_wrist = pos[joint_wrist_idx][:2]

            vec1, vec2, product, angle = calculate_angle(joint_shoulder, joint_elbow, joint_wrist)
            points_shaded = [joint_shoulder, joint_elbow, joint_wrist]
            face = Poly3DCollection([points_shaded], alpha=0.3, color='blue')

            for coll in ax.collections:
                coll.remove()
            ax.add_collection3d(face)

        # Update 2D poses
        joints_right_2d = keypoints_metadata['keypoints_symmetry'][1]
        colors_2d = np.full(keypoints.shape[1], 'black')
        colors_2d[joints_right_2d] = 'green'

        if not initialized:
            image = ax_in.imshow(all_frames[i], aspect='equal')

            print(len(parents))
            for j, j_parent in enumerate(parents):
                if j_parent == -1:
                    continue
                
                if j == 6:
                    start = keypoints[i, j, :2]  # [x, y] of the current joint
                    end = keypoints[i, 8, :2]
                    line_segments.append([start, end])

                if j == 10:
                    start = keypoints[i, j, :2]  # [x, y] of the current joint
                    end = keypoints[i, 8, :2]
                    line_segments.append([start, end])
                    
            
                if len(parents) == keypoints.shape[1] and keypoints_metadata['layout_name'] != 'coco':
                    # Draw skeleton only if keypoints match (otherwise we don't have the parents definition)
                    lines.append(ax_in.plot([keypoints[i, j, 0], keypoints[i, j_parent, 0]],
                                            [keypoints[i, j, 1], keypoints[i, j_parent, 1]], color='pink'))


                #right simulation
                col = 'red' if j in skeleton.joints_right() else 'black'
                for n, ax in enumerate(ax_3d):
                    pos = poses[n][i]
                    lines_3d[n].append(ax.plot([pos[j, 0], pos[j_parent, 0]],
                                               [pos[j, 1], pos[j_parent, 1]],
                                               [pos[j, 2], pos[j_parent, 2]], zdir='z', c=col))
            
            # Create a LineCollection for all skeleton lines
            lc = LineCollection(line_segments, colors='pink', linewidths=2, zorder=5)
            lines = ax_in.add_collection(lc)  # Add the LineCollection to the plot

            points = ax_in.scatter(*keypoints[i].T, 10, color=colors_2d, edgecolors='white', zorder=10)

            ax_in.text(10, 20, f"Upper arm to forearm Angle: {angle:.2f}°", fontsize=10, color='white', bbox=dict(facecolor='black', alpha=0.5))
            initialized = True
        else:
            image.set_data(all_frames[i])

            for j, j_parent in enumerate(parents):
                if j_parent == -1:
                    continue
                
                if j == 6:
                    start = keypoints[i, j, :2]  # [x, y] of the current joint
                    end = keypoints[i, 8, :2]
                    line_segments.append([start, end])

                if j == 10:
                    start = keypoints[i, j, :2]  # [x, y] of the current joint
                    end = keypoints[i, 8, :2]
                    line_segments.append([start, end])

                        
                if len(parents) == keypoints.shape[1] and keypoints_metadata['layout_name'] != 'coco':
                    lines[j-1][0].set_data([keypoints[i, j, 0], keypoints[i, j_parent, 0]],
                                           [keypoints[i, j, 1], keypoints[i, j_parent, 1]])

                for n, ax in enumerate(ax_3d):
                    pos = poses[n][i]
                    lines_3d[n][j-1][0].set_xdata(np.array([pos[j, 0], pos[j_parent, 0]]))
                    lines_3d[n][j-1][0].set_ydata(np.array([pos[j, 1], pos[j_parent, 1]]))
                    lines_3d[n][j-1][0].set_3d_properties(np.array([pos[j, 2], pos[j_parent, 2]]), zdir='z')


            lines.set_segments(line_segments)
            line_segments = []
            points.set_offsets(keypoints[i])
            # Update angle text
            for text in ax_in.texts:
                text.remove()  # Remove the text object from the axis
            ax_in.text(10, 20, f"upper arm to forearm Angle: {angle:.2f}°", fontsize=10, color='white', bbox=dict(facecolor='black', alpha=0.5))

        
        print('{}/{}      '.format(i, limit), end='\r')
        

    fig.tight_layout()
    
    anim = FuncAnimation(fig, update_video, frames=np.arange(0, limit), interval=1000/fps, repeat=False)
    if output.endswith('.mp4'):
        Writer = writers['ffmpeg']
        writer = Writer(fps=fps, metadata={}, bitrate=bitrate)
        anim.save(output, writer=writer)
    elif output.endswith('.gif'):
        anim.save(output, dpi=80, writer='imagemagick')
    else:
        raise ValueError('Unsupported output format (only .mp4 and .gif are supported)')
    plt.close()