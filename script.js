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
const container = document.querySelector('.container');
const clearHistory = document.querySelector('#clear-history');
const muteButton = document.getElementById('shush');
const separatore = document.querySelector('.separatore');

// variabili modale
const modalShut = document.getElementById('close-modal');
const modalStart = document.getElementById('intro-modal');

// textArea della chat
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-text');

// da qui iniziano funzioni del "chatbot"

// l'array della chat con l'API
let testo = [];

// variabile per gestire i controlli
let isRequestInProgress = false;

function sendMessage(text) {

    if (isRequestInProgress) {
        return; //sendMessage non viene invocata se c'è già una richiesta in corso
    }

    isRequestInProgress = true; //switcha il valore a true quando c'è una richiesta

    // cambia la classe visiva così l'utente è portato a pensare che non vanno
    micBtn.classList.add('disabled');
    chatButton.classList.add('disabled');
    muteButton.classList.add('disabled');
    clearHistory.classList.add('disabled');
    chatBox.disabled = true;

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

        //facciamo parlare la nostra AI
        speechSynthesis.speak(utterance);

        //switcha il valore a false quando la richiesta è eseguita
        isRequestInProgress = false;

        micBtn.classList.remove('disabled');
        chatButton.classList.remove('disabled');
        muteButton.classList.remove('disabled');
        clearHistory.classList.remove('disabled');
        chatBox.disabled = false;
    }


    console.log(testo); //da togliere in produzione
    recuperaRisposta();
}

chatButton.addEventListener('click', (event) => {
    let text = chatBox.value;
    console.log(text);


    sendMessage(text);
    chatBox.value = '';

    // Controllare problema di logica e vedere perchè non riappare
    // chatInput.classList.add('hidden');
    // console.log(chatInput);
});

// Inizializzazione
const recognition = new SpeechRecognition(); // crea l'oggetto
recognition.interimResults = true; // attiva l'interim result

function onStartListening() {
    recognition.start();
}

// tramite evento onResult facciamo catturare il testo parlato
function onResult(e) {
    let interim_transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
            sendMessage(e.results[i][0].transcript);
            // pulisce il chatBox dopo 3 secondi
            setTimeout(() => {
                chatBox.value = '';
            }, 3000);
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

muteButton.addEventListener('click', () => {
    speechSynthesis.cancel();
});

// event listener che chiude modale
modalShut.addEventListener('click', function () {
    modalStart.classList.remove('modal-show');
});


// tasto pulisci cronologia
clearHistory.addEventListener('click', () => {
    testo = [];
    container.innerHTML = "";
    separatore.innerHTML = 'Congratulazioni, cronologia pulita correttamente.';

    setTimeout(() => {
        separatore.innerHTML = '';
    }, 3000);
});
