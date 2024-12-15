const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
const cartePerPagina = 10; // Numero di carte per pagina
let paginaCorrente = 1;
let tutteLeCarte = [];
let datiGrafico = [];
let carteFiltrate = []; // Array per le carte filtrate


async function recuperaCarte() {
    try {
        const risposta = await fetch(apiUrl);
        if (!risposta.ok) throw new Error(`Errore API: ${risposta.status}`);
        const dati = await risposta.json();
        tutteLeCarte = dati.data; // Dati delle carte
        mostraCarte();
        
    } catch (errore) {
        console.error("Errore nel recupero delle carte:", errore);
        alert("Impossibile caricare le carte. Riprova più tardi.");
    }
}

function rimuoviVirgolette(nome) {
    return nome.replace(/"/g, ''); // Rimuove tutte le virgolette
}

// Mostra le carte nella pagina
function mostraCarte() {
    const contenitore = document.getElementById("contenitoreCarte");
    contenitore.innerHTML = ""; // Pulizia del contenitore

    const indiceInizio = (paginaCorrente - 1) * cartePerPagina;
    const carteMostrate = tutteLeCarte.slice(indiceInizio, indiceInizio + cartePerPagina);
    console.log(tutteLeCarte);
    carteMostrate.forEach(carta => {
        const cartaElemento = document.createElement("div");
        cartaElemento.classList.add("carta");
        const nomeSicuro = rimuoviVirgolette(carta.name);
        cartaElemento.innerHTML = `
            <h3>${carta.name}</h3>
            <img src="${carta.card_images[0].image_url}" alt="${carta.name}" onclick="mostraDettagliCarta('${carta.id}')">
            <p>Prezzo: €${(carta.card_prices[0].ebay_price || "0.00")}</p>
            <button onclick="aggiungiAlCarrello('${carta.id}', '${nomeSicuro}', ${carta.card_prices[0].ebay_price || "out of stock"})">
                Aggiungi al carrello
            </button>
        `;
        contenitore.appendChild(cartaElemento);
    }); 
    aggiornaControlliPaginazione();

}
 

function aggiornaControlliPaginazione() {
    const controlli = document.getElementById("controlliPaginazione");
    controlli.innerHTML = ""; // Pulizia dei controlli

    const totalePagine = Math.ceil(tutteLeCarte.length / cartePerPagina);
    const range = 2; // Numero di pagine da mostrare prima e dopo la pagina corrente

    // Pulsante "Inizio"
    const bottoneInizio = document.createElement("button");
    bottoneInizio.textContent = "« Inizio";
    bottoneInizio.disabled = paginaCorrente === 1;
    bottoneInizio.addEventListener("click", () => {
        paginaCorrente = 1;
        mostraCarte();
    });
    controlli.appendChild(bottoneInizio);

    // Pulsante "Precedente"
    const bottonePrecedente = document.createElement("button");
    bottonePrecedente.textContent = "‹ Precedente";
    bottonePrecedente.disabled = paginaCorrente === 1;
    bottonePrecedente.addEventListener("click", () => {
        if (paginaCorrente > 1) {
            paginaCorrente--;
            mostraCarte();
        }
    });
    controlli.appendChild(bottonePrecedente);

    // Numeri di pagina
    for (let i = Math.max(1, paginaCorrente - range); i <= Math.min(totalePagine, paginaCorrente + range); i++) {
        const bottone = document.createElement("button");
        bottone.textContent = i;
        bottone.classList.toggle("attivo", i === paginaCorrente);
        bottone.addEventListener("click", () => {
            paginaCorrente = i;
            mostraCarte();
        });
        controlli.appendChild(bottone);
    }

    // Pulsante "Successivo"
    const bottoneSuccessivo = document.createElement("button");
    bottoneSuccessivo.textContent = "Successivo ›";
    bottoneSuccessivo.disabled = paginaCorrente === totalePagine;
    bottoneSuccessivo.addEventListener("click", () => {
        if (paginaCorrente < totalePagine) {
            paginaCorrente++;
            mostraCarte();
        }
    });
    controlli.appendChild(bottoneSuccessivo);

    // Pulsante "Fine"
    const bottoneFine = document.createElement("button");
    bottoneFine.textContent = "Fine »";
    bottoneFine.disabled = paginaCorrente === totalePagine;
    bottoneFine.addEventListener("click", () => {
        paginaCorrente = totalePagine;
        mostraCarte();
    });
    controlli.appendChild(bottoneFine);
}

function controllaDisponibilita(campo, valorePredefinito = "N/A") {
    return campo !== undefined && campo !== null ? campo : valorePredefinito;
}

function mostraDettagliCarta(id) {
    chiudiDettagli();
    console.log("ID cercato:", id); // Aggiunto per il debug
    const carta = tutteLeCarte.find(carta => carta.id === Number(id));
    console.log("Carta trovata:", carta); // Aggiunto per il debug
    if (!carta) {
        alert("Carta non trovata!");
        return;
    }

    // Creazione del contenuto del modal
    const dettagli = `
        <h2 style="color:#a88734">${controllaDisponibilita(carta.name)}</h2>
        <img src="${controllaDisponibilita(carta.card_images[0].image_url)}" alt="${controllaDisponibilita(carta.name)}">
        <p style="color:#ffffff"><strong><span style="color:#a88734">Descrizione:</span></strong> ${controllaDisponibilita(carta.desc)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Prezzo:</span></strong> €${controllaDisponibilita(carta.card_prices[0].ebay_price)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Tipo di Carta:</span></strong> ${controllaDisponibilita(carta.type)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Tipo di effetto Carta:</span></strong> ${controllaDisponibilita(carta.humanReadableCardType)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Archetipo:</span></strong> ${controllaDisponibilita(carta.archetype)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Attributo:</span></strong> ${controllaDisponibilita(carta.attribute)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Razza:</span></strong> ${controllaDisponibilita(carta.race)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Livello:</span></strong> ${controllaDisponibilita(carta.level)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Attacco:</span></strong> ${controllaDisponibilita(carta.atk)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Difesa:</span></strong> ${controllaDisponibilita(carta.def)}</p>
        <p style="color:#ffffff"><strong><span style="color:#a88734">Rarità:</span></strong> ${controllaDisponibilita(carta.card_sets[0].set_rarity)}</p>
        <button onclick="chiudiDettagli()">Chiudi</button>
    `;

    // Creazione del modal
    const modal = document.createElement("div");
    modal.id = "modalDettagli";
    modal.class = "modalBordo";
    modal.innerHTML = dettagli;
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "#121212";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = 1000;

    document.body.appendChild(modal);
    console.log(modal);
}
function chiudiDettagli() {
    const modal = document.getElementById("modalDettagli");
    if (modal) {
        document.body.removeChild(modal);
    }
}


function cercaCarte() {
    const input = document.getElementById("ricercaCarte").value.toLowerCase();
    carteFiltrate = tutteLeCarte.filter(carta => 
        carta.name.toLowerCase().includes(input)
    );
    paginaCorrente = 1; // Resetta alla prima pagina
    ricercaCarte();
}

// Modifica la funzione mostraCarte per usare carteFiltrate
function ricercaCarte() {
    const contenitore = document.getElementById("contenitoreCarte");
    contenitore.innerHTML = ""; // Pulizia del contenitore

    const indiceInizio = (paginaCorrente - 1) * cartePerPagina;
    const carteMostrate = carteFiltrate.slice(indiceInizio, indiceInizio + cartePerPagina);
    
    carteMostrate.forEach(carta => {
        const cartaElemento = document.createElement("div");
        cartaElemento.classList.add("carta");
        const nomeSicuro = rimuoviVirgolette(carta.name);
        cartaElemento.innerHTML = `
            <h3>${carta.name}</h3>
            <img src="${carta.card_images[0].image_url}" alt="${carta.name}" onclick="mostraDettagliCarta('${carta.id}')">
            <p>Prezzo: €${(carta.card_prices[0].ebay_price || "0.00")}</p>
            <button onclick="aggiungiAlCarrello('${carta.id}', '${nomeSicuro}', ${carta.card_prices[0].ebay_price || 0})">
                Aggiungi al carrello
            </button>
        `;
        contenitore.appendChild(cartaElemento);
    }); 
    aggiornaControlliPaginazione();
}




// Inizializza l'applicazione
recuperaCarte();