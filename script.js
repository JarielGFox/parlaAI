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

// API KEY
const apiKeyButton = document.getElementById('api-key-button');
const apiKeyForm = document.getElementById('api-key-form');
const apiKeyInput = document.getElementById('api-key-input');
const submitApiKeyButton = document.getElementById('submit-api-key');

// variabili e selettori
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const separatore = document.querySelector('.separatore');
const container = document.querySelector('.container');

// variabili bottoni
const micBtn = document.getElementById('microphone');
const chatButton = document.getElementById('send');
const clearHistory = document.querySelector('#clear-history');
const muteButton = document.getElementById('shush');
const modalShow = document.getElementById('info-button');
const submitVoiceButton = document.getElementById('submit-voice');

// variabili modale
const modalShut = document.getElementById('close-modal');
const modalStart = document.getElementById('intro-modal');

// variabili selezione voce
const voiceSelect = document.getElementById('voice-select');
const pickVoiceButton = document.getElementById('pick-voice');
const selectionForm = document.getElementById('selection-form');

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
        const risposta = await requestAPI(text);
        console.log(risposta); //da togliere in produzione

        testo.push(risposta); // pusha la risposta del bot nella cronologia chat

        let loader = document.querySelector('.loader');
        loader.parentElement.parentElement.remove();

        appendMessage('l', risposta, container);

        // Preparo una frase per il Sintetizzatore vocale
        const utterance = new SpeechSynthesisUtterance(risposta);

        // specifichiamo altri dettagli della frase
        utterance.volume = 1;
        utterance.rate = 1;

        // imposta la voce su quella selezionata
        utterance.voice = voices[selectedVoiceIndex];

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

// indice selezione voci
let selectedVoiceIndex = 0;

// FUNZIONE SELEZIONE VOCE
function populateVoiceSelect() {
    const voiceSelect = document.getElementById('voice-select');
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.text = voice.name;
        voiceSelect.appendChild(option);
    });
}

// evento selezione voce
speechSynthesis.addEventListener('voiceschanged', function () {
    voices = speechSynthesis.getVoices();
    populateVoiceSelect();
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

// EVENTI BOTTONI

micBtn.addEventListener('click', onStartListening);
recognition.addEventListener('result', onResult);
recognition.addEventListener('error', onError);

muteButton.addEventListener('click', () => {
    speechSynthesis.cancel();
});

// bottone che mostra modale
modalShow.addEventListener('click', function () {
    modalStart.classList.add('modal-show');
});

// event listener che chiude modale
modalShut.addEventListener('click', function () {
    modalStart.classList.remove('modal-show');
});

// event listener che nasconde option value di selezione
submitVoiceButton.addEventListener('click', function () {
    selectionForm.classList.add('hidden');
});

// EVENTI SELEZIONE VOCE

// mostra le voci da scegliere al click del bottone preposto
pickVoiceButton.addEventListener('click', function () {
    selectionForm.classList.remove('hidden');
})

// stora l'indice della voce selezionata
voiceSelect.addEventListener('change', function () {
    selectedVoiceIndex = this.value;  // Store the selected voice index
    console.log(this.value);  // Log the selected voice index
});

//EVENTI API KEY

apiKeyButton.addEventListener('click', () => {
    apiKeyForm.classList.remove('hidden');
});

submitApiKeyButton.addEventListener('click', () => {
    sessionStorage.setItem('API_KEY', apiKeyInput.value);
    apiKeyForm.classList.add('hidden');
    apiKeyInput.value = '';
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
