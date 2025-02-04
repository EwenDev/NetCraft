document.getElementById("ipForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const ipInput = document.getElementById("ip").value;
    const binaryResult = document.getElementById("binaryResult");
    const hexResult = document.getElementById("hexResult");
    const errorAlert = document.getElementById("errorAlert");

    binaryResult.textContent = '';
    hexResult.textContent = '';
    errorAlert.classList.add("hidden");

    const ipParts = ipInput.split(".");
    if (ipParts.length !== 4 || !ipParts.every(part => part >= 0 && part <= 255)) {
        errorAlert.classList.remove("hidden");
        setTimeout(() => {
            errorAlert.classList.add("hidden");
        }, 2500);
        return;
    }

    const binaryConv = ipParts.map(part => Number(part).toString(2).padStart(8, "0"));
    binaryResult.textContent = binaryConv.join(".");

    const hexConv = ipParts.map(part => Number(part).toString(16).toUpperCase().padStart(2, "0"));
    hexResult.textContent = hexConv.join(".");
});