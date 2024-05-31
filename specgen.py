import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

main_folder = '11/uploads'

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

output_directory = '11/client_test'
os.makedirs(output_directory, exist_ok=True)

for root, dirs, files in os.walk(main_folder):
    for file in files:
        if file.endswith(('.mp3', '.wav')): 
            audio_path = os.path.join(root, file)
            create_spectrogram(audio_path, output_folder=output_directory)

# create_spectrogram(r'8\uploads',r'8\test')