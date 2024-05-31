from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory,send_file
from flask_cors import CORS
import os
from os import listdir, remove
from os.path import isfile, join
from pred import predict_all_images_in_directory
from werkzeug.utils import secure_filename
import tensorflow 
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np
import subprocess
from glob import glob
import cl2
import matplotlib
matplotlib.use('Agg')
import shutil

from zipfile import ZipFile

app = Flask(__name__)

CORS(app)

UPLOAD_FOLDER = '11/uploads'
SPECTROGRAM_FOLDER = '11/client_test'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SPECTROGRAM_FOLDER'] = SPECTROGRAM_FOLDER

model_path = '11/new_classify1.h5'
class_labels = ['Anirudh', 'AR-Rahuman', 'GV', 'Hiphop-Tamizha', 'Vijay-Antony', 'Yuvan']
loaded_model = load_model(model_path)

def predict_song(spectrogram_path, file_name):
    processed_files = {}
    if file_name in processed_files:
        return processed_files[file_name]
    img = image.load_img(spectrogram_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    predictions = loaded_model.predict(img_array)

    max_index = np.argmax(predictions[0])
    predicted_label = class_labels[max_index]
    probability = predictions[0][max_index]

    pooled_features = max_pooling(img_array)

    result = {
        'file_name': file_name,
        'predicted_class': predicted_label,
        'probability': float(probability),
        'pooled_features': pooled_features
    }
    processed_files[file_name] = result
    return result


def max_pooling(features):
    return np.max(features, axis=(1, 2))

def predict_all_images_in_directory(directory):
    predictions = []

    files = [f for f in listdir(directory) if isfile(join(directory, f))]

    for file in files:
        image_path = join(directory, file)
        print(f"Predicting for image: {image_path}")
        prediction_result = predict_song(image_path, file)
        predictions.append(prediction_result)
    print(predictions)
    return predictions

def generate_spectrogram(audio_path, output_folder):
    print(f"Generating spectrogram for {audio_path} and saving to {output_folder}")

def get_spectrogram_files():
    spectrogram_files = listdir(app.config['SPECTROGRAM_FOLDER'])
    return spectrogram_files

def get_uploaded_songs():
    uploaded_files = listdir(app.config['UPLOAD_FOLDER'])
    return uploaded_files

@app.route('/')
def index():
    uploaded_songs = get_uploaded_songs()
    return jsonify({'uploaded_songs': uploaded_songs})

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return jsonify({'uploaded_songs': get_uploaded_songs()}), 200

    if request.method == 'POST':
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400

        files = request.files.getlist('files')

        if len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400
        filenames = [file.filename for file in files]
        print("Received files:", filenames) 
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400

            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            os.system(f'python 11/specgen.py {os.path.join(app.config["UPLOAD_FOLDER"], filename)} {app.config["SPECTROGRAM_FOLDER"]}')
            generate_spectrogram(filename, app.config['SPECTROGRAM_FOLDER'])

        return jsonify({'message': 'Files uploaded successfully'}), 200

    return jsonify({'error': 'Invalid request method'}), 405


UPLOAD_FOLDER2='11/uploads2'
app.config['UPLOAD_FOLDER2'] = UPLOAD_FOLDER2

def get_uploaded2_songs():
    uploaded_files = listdir(app.config['UPLOAD_FOLDER2'])
    return uploaded_files

@app.route('/upload2', methods=['GET', 'POST'])
def upload2():
    if request.method == 'GET':
        return jsonify({'uploaded_songs': get_uploaded2_songs()}), 200

    if request.method == 'POST':
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400

        files = request.files.getlist('files')

        if len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400
        filenames = [file.filename for file in files]
        print("Received files:", filenames) 
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400

            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER2'], filename))
        return jsonify({'message': 'Files uploaded successfully'}), 200
    return jsonify({'error': 'Invalid request method'}), 405

import shutil

@app.route('/clear-all', methods=['POST'])
def clear_all():
    uploads2_folder_path = '11/uploads2'
    spectrogram_images_folder_path = '11/spectrogram_images'
    output_zip_file_path = '11/output.zip'
    output_path='11/output'
    try:
        shutil.rmtree(uploads2_folder_path)
        os.makedirs(uploads2_folder_path, exist_ok=True)
        
        shutil.rmtree(spectrogram_images_folder_path)
        os.makedirs(spectrogram_images_folder_path, exist_ok=True)

        shutil.rmtree(output_path)
        os.makedirs(output_path, exist_ok=True)


        if os.path.exists(output_zip_file_path):
            os.remove(output_zip_file_path)

        return jsonify({'message': 'All items in uploads2 folder, spectrogram_images folder, and output.zip file have been deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

 
@app.route('/predict_all')
def predict_all():
    directory = '11/client_test'  
    prediction_results = predict_all_images_in_directory(directory)
    return render_template('new_result.html', predictions=prediction_results)

@app.route('/predict_all_songs')
def predict_all_songs():
    directory = '11/client_test'  
    prediction_results = predict_all_images_in_directory(directory)
    return jsonify(predictions=prediction_results)

@app.route('/classify_more', methods=['POST'])
def classify_more():
    uploaded_songs = get_uploaded_songs()
    for file in uploaded_songs:
        file_path = join(app.config['UPLOAD_FOLDER'], file)
        if isfile(file_path):
            os.remove(file_path)

    spectrogram_files = get_spectrogram_files()
    for file in spectrogram_files:
        file_path = join(app.config['SPECTROGRAM_FOLDER'], file)
        if isfile(file_path):
            os.remove(file_path)
    return redirect(url_for('index'))


@app.route('/cluster')
def cluster_route():
    main_folder = '11/uploads2'
    output_directory = "11/spectrogram_images"
    os.makedirs(output_directory, exist_ok=True)

    for root, dirs, files in os.walk(main_folder):
        for file in files:
            if file.endswith(('.mp3', '.wav')): 
                audio_path = os.path.join(root, file)
                cl2.create_spectrogram(audio_path, output_folder=output_directory, main_folder=main_folder)

    spectrogram_dir = output_directory
    image_paths = glob(os.path.join(spectrogram_dir, "*.png"))

    num_clusters = 5
    methods = ["kmeans", "spectral", "hierarchical"]
    cluster_results = cl2.cluster_spectrograms(image_paths, num_clusters, methods)

    best_method = max(cluster_results.items(), key=lambda x: x[1]["silhouette_score"])[0]

    json_cluster_mappings = cl2.print_image_cluster_mapping(image_paths, cluster_results[best_method]['cluster_labels'])
    output_dir = "11/output"
    cl2.store_output_files(main_folder, cluster_results[best_method]['cluster_labels'], output_dir)

    #return render_template('cluster_result.html', json_cluster_mappings=json_cluster_mappings)
    return json_cluster_mappings


# @app.route('/download-zip')
# def download_zip():
#     # Folder to be zipped
#     folder_path = 'output'
    
#     # Name for the zip file
#     zip_filename = 'output.zip'

#     # Create a zip file
#     with ZipFile(zip_filename, 'w') as zipf:
#         # Add all files in the folder to the zip file
#         for root, dirs, files in os.walk(folder_path):
#             for file in files:
#                 file_path = os.path.join(root, file)
#                 zipf.write(file_path, os.path.relpath(file_path, folder_path))

#     # Send the zip file as a response
#     return send_file(zip_filename, as_attachment=True)



@app.route('/download-zip')
def download_zip():
    folder_path = '11/output'
    
    zip_filename = 'output.zip'
    
    zip_location = ''

    with ZipFile(os.path.join(zip_location, zip_filename), 'w') as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, folder_path))

    return send_file(os.path.join(zip_location, zip_filename), as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)

