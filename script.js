import "./api.js";
import { requestAPI } from "./api.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById('microphone');
const panelsData = document.getElementById('panels-data');

// Prendiamo il div della risposta
const chatBox = document.getElementById('chatbox');

let testo = [];

// Inizializzazione
const recognition = new SpeechRecognition(); // crea l'oggetto

function onStartListening() {
    recognition.start();
    panelsData.classList.add('listening');
}

function onResult(e) {
    testo.push(e.results[0][0].transcript);

    async function recuperaRisposta() {
        const risposta = await requestAPI(testo);
        console.log(risposta);
        chatBox.innerHTML = risposta;
    }

    console.log(e.results);
    console.log(testo);
    recuperaRisposta();

    panelsData.classList.remove('listening');

}

function onError(e) {
    console.error(e.error);
}

micBtn.addEventListener('click', onStartListening);
recognition.addEventListener('result', onResult);
recognition.addEventListener('error', onError);
