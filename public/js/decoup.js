document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("decoupForm").addEventListener('submit', function (event) {
        event.preventDefault();
        console.log("Formulaire soumis !");

        const ipInput = document.getElementById('ip').value;
        console.log("IP saisie :", ipInput);

        const resultElement = document.getElementById('result');

        try {
            const [ip, prefix] = ipInput.split('/');
            console.log("IP :", ip, "Préfixe :", prefix);

            if (!validateIP(ip) || isNaN(prefix) || prefix < 0 || prefix > 32) {
                throw new Error('Adresse IP ou CIDR invalide.');
            }

            const subnetInfo = calculateSubnets(ip, parseInt(prefix));
            console.log("Sous-réseaux calculés :", subnetInfo);

            let output = `
                <table class="table table-xs text-white/90 w-full">
                    <thead>
                        <tr>
                            <th class="text-white/90">Réseau</th>
                            <th class="text-white/90">Préfixe</th>
                            <th class="text-white/90">Premier Hôte</th>
                            <th class="text-white/90">Dernier Hôte</th>
                            <th class="text-white/90">Broadcast</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subnetInfo.map(subnet => `
                            <tr>
                                <td>${subnet.network}</td>
                                <td>${subnet.prefix}</td>
                                <td>${subnet.firstHost}</td>
                                <td>${subnet.lastHost}</td>
                                <td>${subnet.broadcast}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            resultElement.innerHTML = output;
        } catch (error) {
            errorAlert.classList.remove("hidden");
            setTimeout(() => {
                errorAlert.classList.add("hidden");
            }, 2500);
        }
    });
});

function validateIP(ip) {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255;
    });
}

function calculateSubnets(ip, prefix) {
    const subnetPrefix = Math.min(prefix + 2, 32); // Exemple de logique
    const subnetCount = Math.pow(2, subnetPrefix - prefix);
    const ipNum = ipToNumber(ip);

    const subnets = [];
    for (let i = 0; i < subnetCount; i++) {
        const network = ipNum + (i * (1 << (32 - subnetPrefix)));
        const firstHost = network + 1;
        const lastHost = network + (1 << (32 - subnetPrefix)) - 2;
        const broadcast = network + (1 << (32 - subnetPrefix)) - 1;

        subnets.push({
            network: numberToIp(network),
            prefix: subnetPrefix,
            firstHost: numberToIp(firstHost),
            lastHost: numberToIp(lastHost),
            broadcast: numberToIp(broadcast),
        });
    }

    return subnets;
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part), 0) >>> 0;
}


function numberToIp(num) {
    return [
        (num >>> 24) & 0xFF,
        (num >>> 16) & 0xFF,
        (num >>> 8) & 0xFF,
        num & 0xFF
    ].join('.');
}