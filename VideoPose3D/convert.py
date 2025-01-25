import numpy as np

# Load your 2D keypoints from the provided file
input_file = "landmarks_2d.npy"  # Update the path if needed
output_file = "data/data_2d_custom_dataset.npz"

# Load the 2D landmarks
landmarks_2d = np.load(input_file, allow_pickle=True)

# Structure the data as required by VideoPose3D
# The format is a dictionary with your dataset name as the key
data = {
    "custom": {  # Replace "custom" with a meaningful dataset name if desired
        "keypoints": landmarks_2d
    }
}

# Save the structured data to the output .npz file
np.savez(output_file, **data)

print(f"2D keypoints saved to {output_file} in the required format.")
