function simplifyIPv6(address) {
    try {
        const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

        if (!ipv6Pattern.test(address)) {
            throw new Error("Adresse IPv6 invalide");
        }

        let simplified = address.split(":").map(block => block.replace(/^0+/, "") || "0").join(":");

        simplified = simplified.replace(/(:0){2,}/g, ":").replace(/^:|:$/g, "::");

        return simplified;
    } catch (error) {

        return null;
    }
}

const resultElement = document.getElementById("result");
const errorAlert = document.getElementById("errorAlert");

document.getElementById("simplifieForm").addEventListener("submit", event => {
    event.preventDefault();
    const ipInput = document.getElementById("ip").value;
    const simplifiedIP = simplifyIPv6(ipInput);

    if (simplifiedIP) {
        errorAlert.classList.add("hidden");
        resultElement.textContent = simplifiedIP;
    } else {
        errorAlert.classList.remove("hidden");
        setTimeout(() => {
            errorAlert.classList.add("hidden");
        }, 2500);
        resultElement.textContent = "";
    }
});
