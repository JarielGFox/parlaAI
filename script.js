import "./api.js";
import { requestAPI } from "./api.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById('microphone');
const chatButton = document.getElementById('send');
const panelsData = document.getElementById('panels-data');
const container = document.querySelector('.container');

// Prendiamo il div della risposta
const chatBox = document.getElementById('chatbox');

let testo = [];

function sendMessage(text) {
    testo.push(text);

    appendMessage('r', text, container);

    setTimeout(function () {
        appendMessage('l', '<img class="loader" src="./images/miniloading.gif">', container);
    }, 1000)


    async function recuperaRisposta() {

        const risposta = await requestAPI(testo);
        console.log(risposta); //da togliere in produzione

        let loader = document.querySelector('.loader');
        loader.parentElement.parentElement.remove();

        appendMessage('l', risposta, container);
    }

    console.log(testo); //da togliere in produzione
    recuperaRisposta();
}

chatButton.addEventListener('click', (event) => {
    let text = event.target.previousElementSibling.value;
    console.log(text);
    sendMessage(text);
    event.target.previousElementSibling.value = '';
});

// Inizializzazione
const recognition = new SpeechRecognition(); // crea l'oggetto

function onStartListening() {
    recognition.start();
}



function onResult(e) {
    sendMessage(e.results[0][0].transcript);
}




function onError(e) {
    console.error(e.error);
}

micBtn.addEventListener('click', onStartListening);
recognition.addEventListener('result', onResult);
recognition.addEventListener('error', onError);
