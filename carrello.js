

let carrello = [];


// Aggiungi una carta al carrello
function aggiungiAlCarrello(id, nome, prezzo) {
    const cartaEsistente = carrello.find(item => item.id === id);
    if (cartaEsistente) {
        cartaEsistente.quantita++;
    } else {
        carrello.push({ id, nome, prezzo, quantita: 1 });
    }
    salvaCarrello();
    mostraCarrello();
}

// Mostra il carrello
function mostraCarrello() {
    const contenitoreCarrello = document.getElementById("contenitoreCarrello");
    if (!contenitoreCarrello) return; // Se non siamo nella pagina del carrello, esci

    contenitoreCarrello.innerHTML = ""; // Pulizia del carrello
    let totale = 0;

    carrello.forEach(item => {
        const elementoCarrello = document.createElement("div");
        elementoCarrello.classList.add("item-carrello");
        elementoCarrello.innerHTML = `
            <span>${item.nome}</span>
            <span>Prezzo: €${item.prezzo}</span>
            <span>Quantità: ${item.quantita}</span>
            <button class="bottonerimuovicarrello" onclick="rimuoviDalCarrello('${item.id}')">Rimuovi</button>
            <br><br>
        `;
        contenitoreCarrello.appendChild(elementoCarrello);
        totale += item.prezzo * item.quantita;
    });

    const prezzoTotale = document.getElementById("prezzoTotale");
    if (prezzoTotale) {
        prezzoTotale.textContent = `Totale: €${totale.toFixed(2)}`;
    }
}

// Rimuovi una carta dal carrello
function rimuoviDalCarrello(id) {
    carrello = carrello.filter(item => item.id !== id);
    salvaCarrello();
    mostraCarrello();
}

// Salva il carrello nel localStorage
function salvaCarrello() {
    localStorage.setItem("carrelloYuGiOh", JSON.stringify(carrello));
}

// Carica il carrello dal localStorage
function caricaCarrello() {
    const carrelloSalvato = localStorage.getItem("carrelloYuGiOh");
    if (carrelloSalvato) {
        carrello = JSON.parse(carrelloSalvato);
        mostraCarrello();
    }
}

function scaricaCarrelloJSON() {
    if (carrello.length === 0) { // Cambia da cart a carrello
        alert("Il carrello è vuoto!");
        return;
    }

    // Creazione dell'oggetto JSON con i dettagli del carrello
    const riepilogo = {
        data: new Date().toLocaleString(),
        totale: carrello.reduce((acc, item) => acc + item.prezzo * item.quantita, 0).toFixed(2), // Cambia da cart a carrello
        carte: carrello.map(item => ({
            nome: item.nome, // Cambia da cart a carrello
            prezzo: item.prezzo,
            quantità: item.quantita, // Cambia da cart a carrello
            totale: (item.prezzo * item.quantita).toFixed(2)
        }))
    };

    // Conversione in stringa JSON
    const jsonString = JSON.stringify(riepilogo, null, 2);

    // Creazione di un blob per il file JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Creazione di un elemento <a> per il download
    const link = document.createElement("a");
    link.href = url;
    link.download = "riepilogo_carrello.json";

    // Simulazione del clic per scaricare il file
    link.click();

    // Rilascio dell'oggetto URL
    URL.revokeObjectURL(url);
}

// Inizializza il carrello
caricaCarrello();