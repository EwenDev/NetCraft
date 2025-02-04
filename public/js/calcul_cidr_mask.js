// Fonction pour convertir le CIDR en masque
function cidrToMask(cidr) {
    let mask = [];
    let binaryMask = "1".repeat(cidr).padEnd(32, "0");
    for (let i = 0; i < 4; i++) {
        mask.push(parseInt(binaryMask.slice(i * 8, (i + 1) * 8), 2));
    }
    return mask.join('.');
}

// Fonction pour convertir un masque en CIDR
function maskToCidr(mask) {
    let binaryMask = '';
    mask.split('.').forEach(octet => {
        binaryMask += ('00000000' + parseInt(octet).toString(2)).slice(-8);
    });
    return binaryMask.indexOf('0') === -1 ? 32 : binaryMask.indexOf('0');
}

// Fonction pour gérer les changements dans le champ CIDR
document.getElementById('cidr').addEventListener('input', function() {
    const cidr = parseInt(this.value, 10);
    if (cidr >= 0 && cidr <= 32) {
        const mask = cidrToMask(cidr);
        document.getElementById('mask').value = mask; // Mettre le masque dans le champ 'mask'
    }
});

// Fonction pour gérer les changements dans le champ Masque
document.getElementById('mask').addEventListener('input', function() {
    const mask = this.value;
    const validMaskRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

    // Vérifier si le masque est valide
    if (validMaskRegex.test(mask)) {
        const cidr = maskToCidr(mask);
        document.getElementById('cidr').value = cidr; // Mettre le CIDR dans le champ 'cidr'
    }
});
