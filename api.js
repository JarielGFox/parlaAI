// import { APIKEY as API_KEY } from "./source.js";

//VARIABILI API
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";

// parametri AI
const temperature = 1.0;
const frequency_penalty = 2.0;

export const requestAPI = async (
    testo
) => {
    console.log(testo);
    try {
        //Chiamare le Api di Open AI

        const API_KEY = sessionStorage.getItem('API_KEY');

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        'role': `system`,
                        'content': `${testo}`,
                    }
                ],
                frequency_penalty: frequency_penalty,
                temperature: temperature
            })
        })
        // attendiamo la risposta da open AI
        const data = await response.json();
        // otteniamo il contenuto di "message"
        // https://platform.openai.com/docs/api-reference/making-requests
        const message = data.choices[0].message.content;
        return message;

    } catch (error) {
        console.log('Controlla il credito dell\'API o il suo server status.', error);
        separatore.classList.remove('hidden');
        separatore.innerHTML = 'Assicurati di aver inserito correttamente l\'API KEY o di avere credito sufficiente.';

        setTimeout(() => {
            separatore.innerHTML = '';
            separatore.classList.add('hidden');
        }, 15000);

        return;
    }

}