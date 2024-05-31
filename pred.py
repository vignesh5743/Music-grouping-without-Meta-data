from tensorflow.keras.models import load_model
import numpy as np
from tensorflow.keras.preprocessing import image
from os import listdir
from os.path import isfile, join

def predict_genre(spectrogram_path, class_labels, loaded_model):
    img = image.load_img(spectrogram_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    predictions = loaded_model.predict(img_array)

    max_index = np.argmax(predictions[0])
    predicted_label = class_labels[max_index]
    probability = predictions[0][max_index]

    result = {
        'predicted_class': predicted_label,
        'probability': float(probability)
    }
    print(result)
    return result

def predict_all_images_in_directory(directory, class_labels, model_path):
    loaded_model = load_model(model_path)
    predictions = []

    files = [f for f in listdir(directory) if isfile(join(directory, f))]

    for file in files:
        image_path = join(directory, file)
        print(f"Predicting for image: {image_path}")
        prediction_result = predict_genre(image_path, class_labels, loaded_model)
        predictions.append(prediction_result)
    print(predictions)
    return predictions

