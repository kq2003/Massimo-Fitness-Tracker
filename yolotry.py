import cv2

from ultralytics import solutions

cap = cv2.VideoCapture("/Users/tonyqin/Desktop/tricep.mp4")
print(cap)
assert cap.isOpened(), "Error reading video file"


w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

video_writer = cv2.VideoWriter("workouts.avi", cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))

gym = solutions.AIGym(
    line_width=2,
    show=True,
    kpts=[8, 6, 12]
)

while cap.isOpened():
    success, im0 = cap.read()
    if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break
    im0 = gym.monitor(im0)
    print(im0)
    video_writer.write(im0)

cv2.destroyAllWindows()
video_writer.release()

