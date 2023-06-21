const sendMessage = () => {
    textBox.value.toLowerCase();
    testo.push(textBox.value.toLowerCase());
}

const appendMessage = (position, text, element) => {
    let divRichiesta = document.createElement('div');

    if (position == 'r') {
        divRichiesta.classList.add('box-utente');
    } else {
        divRichiesta.classList.add('box-system');
    }

    divRichiesta.innerHTML = `<div class='box-header padd-${position}' >
        ${position == 'r' ? 'Tu' : 'Parl-Ai'}
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