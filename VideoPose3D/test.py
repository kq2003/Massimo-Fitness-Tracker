import numpy as np

file_path = "D:/DDDownloads/VideoPose3D/output_directory/Kai_is_cool8.mp4.npz"
data = np.load(file_path, allow_pickle=True)

# Inspect all keys
print("Top-level keys in the file:", list(data.keys()))

# Check 'positions_2d' content
if "positions_2d" in data:
    positions_2d = data["positions_2d"].item()
    print("Keys in 'positions_2d':", list(positions_2d.keys()))
else:
    print("'positions_2d' key is missing.")