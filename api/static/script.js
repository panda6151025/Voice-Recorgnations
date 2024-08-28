let mediaRecorder;
let audioChunks = [];
let chunkIndex = 0;
const micContainer = document.getElementsByClassName('mic-container')[0];
const submitContainer = document.getElementsByClassName('mic-container')[1];

micContainer.addEventListener('click', (e) => {
    const circleElement = document.querySelector('.circle');

    if (mediaRecorder && mediaRecorder.state === 'recording') {

        circleElement.classList.remove('active');
        stopRecording();
    } else {
        circleElement.classList.add('active');
        startRecording();
    }
});

submitContainer.addEventListener('click', (e) => {
    console.log(audioChunks.length)
})

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                saveChunk(audioBlob);
            };

            setInterval(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 5000);
        })
        .catch(error => console.error("Error accessing microphone: ", error));
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
}

function saveChunk(audioBlob) {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = document.createElement('audio');
    const li = document.createElement('li');
    const deleteButton = document.createElement('div');

    audio.setAttribute('controls', '');
    audio.src = audioUrl;

    deleteButton.classList.add('button-icon', 'delete-button');
    deleteButton.id = 'deleteButton';
    deleteButton.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(audio);
    li.appendChild(deleteButton);

    document.getElementById("recordingsList").appendChild(li);
}

function sendChunkToBackend(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, `chunk${chunkIndex}.webm`);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(`Chunk #${chunkIndex} uploaded successfully`);
        })
        .catch(error => console.error('Error uploading audio chunk:', error));
}
