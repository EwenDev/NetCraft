function pingICMP() {
    const ip = document.getElementById('ip_icmp').value;

    if (!ip) {
        alert("Veuillez entrer une adresse IP.");
        return;
    }

    const ipParts = ip.split(".");
    if (ipParts.length !== 4 || !ipParts.every(part => part >= 0 && part <= 255)) {
        alert("Adresse IP invalide.");
        return;
    }

    // Envoi de la requête
    fetch('/api/appel_python/ping', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ip })
    })
        .then(response => response.json())  // Parse la réponse en JSON
        .then(data => {
            if (data && data.response) {  // Vérifie si 'response' existe dans la réponse
                displayResult(data.response);  // Affiche la réponse dans le résultat
            } else {
                displayResult('Réponse inattendue ou erreur dans le format de la réponse.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            displayResult('Erreur lors de l\'envoi de la requête ICMP.');
        });
}


function pingTCP() {
    const ip = document.getElementById('ip_tcp').value;
    const port = parseInt(document.getElementById('target_port').value);
    
    const ipParts = ip.split(".");
    if (ipParts.length !== 4 || !ipParts.every(part => part >= 0 && part <= 255)) {
        alert("Adresse IP invalide.");
        return;
    }

    if (!ip || !port) {
        alert("Veuillez entrer une adresse IP et un port.");
        return;
    }

    fetch('/api/appel_python/TCP', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: ip, port: port })
    })
        .then(response => response.json())  // Parse la réponse en JSON
        .then(data => {
            if (data && data.response) {  // Vérifie si 'response' existe dans la réponse
                displayResult(data.response);  // Affiche la réponse dans le résultat
            } else {
                displayResult('Réponse inattendue ou erreur dans le format de la réponse.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            displayResult('Erreur lors de l\'envoi de la requête ICMP.');
        });
}

function displayResult(result) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<pre>${result}</pre>`;  // Affiche le résultat
}
