import "./api.js";
import { requestAPI } from "./api.js";

// Mostra le voci disponibili
let voices = [];
speechSynthesis.addEventListener('voiceschanged', function () {
    voices = speechSynthesis.getVoices();
    // in console stampiamo l'elenco delle voci possibili da utilizzare
    console.log(voices);
})

// INIZIO VARIABILI CODICE

// variabili ID e selettori
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById('microphone');
const chatButton = document.getElementById('send');
const panelsData = document.getElementById('panels-data');
const container = document.querySelector('.container');
const clearHistory = document.querySelector('#clear-history');
const separatore = document.querySelector('.separatore');

// textArea della chat
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-text');

// da qui iniziano funzioni del "chatbot"
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

        // Preparo una frase per il Sintetizzatore vocale
        const utterance = new SpeechSynthesisUtterance(risposta);

        // specifichiamo altri dettagli della frase
        utterance.volume = 1;
        utterance.rate = 1;

        const femaleVoice = voices.find(function (voice) {
            if (voice.name.includes('Elsa')) {
                return true;
            }
        });

        if (femaleVoice) { // dà la voce se trova un match
            utterance.voice = femaleVoice;
        }

        // facciamo parlare la paperella
        speechSynthesis.speak(utterance);
    }


    console.log(testo); //da togliere in produzione
    recuperaRisposta();
    chatInput.classList.remove('hidden');
}

chatButton.addEventListener('click', (event) => {
    let text = event.target.previousElementSibling.value;
    console.log(text);


    sendMessage(text);
    event.target.previousElementSibling.value = '';

    // Controllare problema di logica e vedere perchè non riappare
    // chatInput.classList.add('hidden');
    // console.log(chatInput);
});

// Inizializzazione
const recognition = new SpeechRecognition(); // crea l'oggetto
recognition.interimResults = true; // attiva l'interim result

function onStartListening() {
    recognition.start();
    chatInput.classList.add('hidden');
}

// tramite evento onResult facciamo catturare il testo parlato
function onResult(e) {
    let interim_transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
            sendMessage(e.results[i][0].transcript);
        } else {
            interim_transcript += e.results[i][0].transcript;
            chatBox.value = interim_transcript;
        }
    }
}

function onError(e) {
    console.error(e.error);
}

micBtn.addEventListener('click', onStartListening);
recognition.addEventListener('result', onResult);
recognition.addEventListener('error', onError);

// tasto pulisci cronologia
clearHistory.addEventListener('click', () => {
    testo = [];
    container.innerHTML = "";
    separatore.innerHTML = 'Congratulazioni, cronologia pulita correttamente.';

    setTimeout(() => {
        separatore.innerHTML = '';
    }, 3000);
});
