const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const micBtn = document.getElementById('microphone');
const screen = document.getElementById('screen');
const panelsData = document.getElementById('panels-data');

const commands = ['mangia', 'balla', 'dormi'];

// Inizializzazione
const recognition = new SpeechRecognition();

function onStartListening() {
    recognition.start();    
    panelsData.classList.add('listening');
}

function onResult(e) {    
    const testo = e.results[0][0].transcript;

    const action = commands.find(function(command) {
        return testo.toLowerCase().includes(command);
    });

    const actionClassname = 'codigotchi-screen_' + action;

    screen.classList.add(actionClassname);
    panelsData.classList.remove('listening');
    
    // Mostro l'animazione della gif per 2 secondi
    setTimeout(function() {
        screen.classList.remove(actionClassname);
    }, 2000);
}

function onError(e) {
    console.error(e.error);
}

micBtn.addEventListener('click', onStartListening);
recognition.addEventListener('result', onResult);
recognition.addEventListener('error', onError);
