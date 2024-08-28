from flask import Flask, render_template, request
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_audio():
    # if 'audio' not in request.files:
    #     return 'No audio file uploaded', 400

    # audio_file = request.files['audio']
    # if audio_file.filename == '':
    #     return 'No audio file selected', 400

    # if audio_file:
    #     filename = audio_file.filename
    #     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    #     audio_file.save(file_path)
    #     return f'Audio chunk {filename} uploaded successfully'

    return f'Error uploading audio chunk'

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
