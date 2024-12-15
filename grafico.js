const apiUrl2 = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

async function recuperaDatiCarte() {
    try {
        const risposta = await fetch(apiUrl2);
        if (!risposta.ok) throw new Error(`Errore API: ${risposta.status}`);
        const dati = await risposta.json();
        const carte = dati.data;

        // Conta il numero di carte per tipo
        const conteggioTipi = {};
        carte.forEach(carta => {
            const tipo = carta.type || "Sconosciuto";
            conteggioTipi[tipo] = (conteggioTipi[tipo] || 0) + 1;
        });

        // Crea i dati per il grafico
        const etichette = Object.keys(conteggioTipi);
        const valori = Object.values(conteggioTipi);

        // Crea il grafico
        const ctx = document.getElementById('graficoCarte').getContext('2d');
        const graficoCarte = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etichette,
                datasets: [{
                    label: 'Numero',
                    data: valori,
                    backgroundColor: '#a88734',
                    borderColor: '#a88734',
                    borderWidth: 1
                    
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (errore) {
        console.error("Errore nel recupero delle carte:", errore);
        alert("Impossibile caricare i dati per il grafico. Riprova più tardi.");
    }
}

// Inizializza il grafico
recuperaDatiCarte();