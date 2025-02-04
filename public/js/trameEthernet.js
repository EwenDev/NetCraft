function isValidMACAddress(mac) {
    // Expression régulière pour correspondre au format des adresses MAC
    const macRegex = /^(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;

    // Test de la chaîne avec l'expression régulière
    return macRegex.test(mac);
}

function generateHexView(hexString) {

    const hexPairs = hexString.match(/.{1,2}/g);

    const prefixedHex = hexPairs.map(pair => `0x${pair}`);

    const lines = [];
    for (let i = 0; i < prefixedHex.length; i += 6) {
        lines.push(prefixedHex.slice(i, i + 6));
    }

    return lines;
}

function displayHexView(hexString) {
    const resultDiv = document.getElementById("result");

    const hexLines = generateHexView(hexString);

    let content = "";
    hexLines.forEach((line, index) => {
        content += `
            <pre data-prefix="${index + 1}"><code class="text-white/90 text-lg font-bold">${line.join(" ")}</code></pre>
        `;
    });

    resultDiv.innerHTML = content;
}

function constructionTrame() {
    const srcMac = document.getElementById('src_mac').value;
    const dstMac = document.getElementById('dst_mac').value;
    const ethType = document.getElementById('eth_type').value;
    const content = document.getElementById('content').value;

    if (!srcMac || !dstMac || !ethType || !content) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    if(!isValidMACAddress(srcMac) || !isValidMACAddress(dstMac)) {
        alert('Adresse MAC invalide.');
        return;
    }

    let type;
    try {
        type = parseInt(ethType, 16); // Conversion en entier hexadécimal
        if (isNaN(type)) {
            throw new Error('Type Ethernet invalide.');
        }
    } catch (error) {
        alert('Le type Ethernet doit être une valeur hexadécimale valide.');
        return;
    }

    const adr_src = srcMac;
    const adr_dst = dstMac;
    const data = content

    fetch('/api/appel_python/construction_trame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "adr_dst": adr_dst,
            "adr_src": adr_src,
            "type": type,
            "data": data
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.response && data.reponse.includes("Erreur")) {
                alert("Erreur lors de la construction de la trame.");
                return
            }
            displayHexView(data.trame);
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('result').textContent = 'Erreur lors de l\'analyse de la trame.';
        });
}
