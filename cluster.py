import os
import librosa
import numpy as np
from sklearn.cluster import KMeans, SpectralClustering, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from shutil import copyfile
from PIL import Image
import matplotlib.pyplot as plt
import librosa.display

main_folder = '11/uploads2'
def create_spectrogram(audio_path, output_folder):
    y, sr = librosa.load(audio_path)
    D = librosa.amplitude_to_db(librosa.stft(y), ref=np.max)
    
    plt.figure(figsize=(10, 6))
    librosa.display.specshow(D, sr=sr, x_axis=None, y_axis=None)  
    plt.axis('off')  
    
    relative_path = os.path.relpath(audio_path, main_folder)
    subfolder = os.path.dirname(relative_path)
    
    output_path = os.path.join(output_folder, subfolder)
    os.makedirs(output_path, exist_ok=True)
    
    output_file = os.path.join(output_path, '{}.png'.format(os.path.splitext(os.path.basename(audio_path))[0]))
    plt.savefig(output_file, bbox_inches='tight', pad_inches=0)
    plt.close()

audio_dir = "11/uploads2"
output_directory = "spectrogram_images"
os.makedirs(output_directory, exist_ok=True)

for root, dirs, files in os.walk(main_folder):
    for file in files:
        if file.endswith(('.mp3', '.wav')): 
            audio_path = os.path.join(root, file)
            create_spectrogram(audio_path, output_folder=output_directory)

from glob import glob
def load_spectrogram(filename, grayscale=True):
    image = Image.open(filename)
    if grayscale:
        image = image.convert("L")  # Convert to grayscale if needed
    image_array = np.array(image)
    image_vector = image_array.flatten()  # Reshape based on your image representation
    return image_vector


def cluster_spectrograms(image_paths, num_clusters, methods=["kmeans"]):
    features = []
    for image_path in image_paths:
        features.append(load_spectrogram(image_path))
    features_np = np.vstack(features)

    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features_np)


    cluster_results = {}
    for method in methods:
        if method == "kmeans":
            clustering = KMeans(n_clusters=num_clusters)
        elif method == "spectral":
            clustering = SpectralClustering(n_clusters=num_clusters, eigen_solver="arpack")
        elif method == "hierarchical":
            clustering = AgglomerativeClustering(n_clusters=num_clusters, linkage="ward")
        else:
            raise ValueError(f"Invalid clustering method: {method}")

        clustering.fit(features_scaled)
        cluster_labels = clustering.labels_

        silhouette = silhouette_score(features_scaled, cluster_labels)

        cluster_results[method] = {"cluster_labels": cluster_labels, "silhouette_score": silhouette}

    return cluster_results


def print_image_cluster_mapping(image_paths, cluster_labels):

  if len(image_paths) != len(cluster_labels):
    raise ValueError("Length of image paths and cluster labels must be equal.")

  cluster_mappings = {}  # Dictionary to store image names for each cluster
  for i, image_path in enumerate(image_paths):
    cluster = cluster_labels[i]
    image_name = os.path.basename(image_path)
    if cluster not in cluster_mappings:
      cluster_mappings[cluster] = []
    cluster_mappings[cluster].append(image_name)

  # Print image names for each cluster
  for cluster, image_names in cluster_mappings.items():
    print(f"\nCluster {cluster}:")
    for name in image_names:
      print(f"  - {name}")



# Replace with your directory containing spectrogram images
spectrogram_dir = output_directory
image_paths = glob(os.path.join(spectrogram_dir, "*.png"))  # Assuming PNG format


# Choose desired number of clusters and methods to evaluate
num_clusters = 5
methods = ["kmeans", "spectral", "hierarchical"]  # Experiment with different combinations

# Perform clustering with evaluation
cluster_results = cluster_spectrograms(image_paths, num_clusters, methods)

# Print clustering results and silhouette scores
for method, result in cluster_results.items():
    print(f"Clustering Method: {method}")
    print(f"  Silhouette Score: {result['silhouette_score']}")

best_method = max(cluster_results.items(), key=lambda x: x[1]["silhouette_score"])[0]
print(cluster_results[best_method])

def print_image_cluster_mapping(image_paths, cluster_labels):

  if len(image_paths) != len(cluster_labels):
    raise ValueError("Length of image paths and cluster labels must be equal.")

  cluster_mappings = {}  # Dictionary to store image names for each cluster
  for i, image_path in enumerate(image_paths):
    cluster = cluster_labels[i]
    image_name = os.path.basename(image_path)
    if cluster not in cluster_mappings:
      cluster_mappings[cluster] = []
    cluster_mappings[cluster].append(image_name)

  # Print image names for each cluster
  for cluster, image_names in cluster_mappings.items():
    print(f"\nCluster {cluster}:")
    for name in image_names:
      print(f"  - {name}")
audio_files = [os.path.join(audio_dir, file) for file in os.listdir(audio_dir) if file.endswith(".mp3") or file.endswith(".wav")]
output_dir="output"
for audio_file, cluster_label in zip(audio_files, cluster_results[best_method]['cluster_labels']):
    destination_folder = os.path.join(output_dir, f"cluster_{cluster_label}")
    os.makedirs(destination_folder, exist_ok=True)
    filename = os.path.basename(audio_file)
    print(f"Copying {audio_file} to {destination_folder}")
    copyfile(audio_file, os.path.join(destination_folder, filename))

print_image_cluster_mapping(image_paths, cluster_results[best_method]['cluster_labels'])