// Caricamento modale
window.onload = function () {
    document.getElementById('intro-modal').classList.add('modal-show');
}

//funzione per mandare messaggio, pusha il testo nell'array
const sendMessage = () => {
    textBox.value.toLowerCase();
    testo.push(textBox.value.toLowerCase());
}

// funzione che crea i box di domanda e risposta 
const appendMessage = (position, text, element) => {
    let divRichiesta = document.createElement('div');

    if (position == 'r') {
        divRichiesta.classList.add('box-utente');
    } else {
        divRichiesta.classList.add('box-system');
    }

    divRichiesta.innerHTML = `<div class='box-header padd-${position}' >
        ${position == 'r' ? 'Tu' : 'Parlam-(A)i'}
    </div>
    <p>
        ${text}
    </p>`
        ;
    element.appendChild(divRichiesta);

    const windowTo = window.innerHeight + 20;
    window.scrollTo(0, windowTo); //a capo automatico per il messaggio
}
// e.results[0][0].transcript