function displayInterfaces(interfaces) {
    const resultDiv = document.getElementById("result");
  
    if (!resultDiv) {
      console.error("Div with id 'result' not found!");
      return;
    }
  
    let content = "";
    interfaces.forEach((details, name) => {
      content += `
        <div class="mockup-code max-w-4xl w-auto p-8 shadow-2xl shrink-0 relative backdrop-blur-lg bg-black/30 border-2 border-white/5 rounded-xl shadow-lg">
          <pre data-prefix=">"><code class="text-white/90 text-lg font-bold mb-2">Interface: ${name}</code></pre>
          <div class="space-y-2">
            ${details
              .map(
                (detail) => `
              <pre data-prefix="$" class="text-warning"><code>${detail.family}</code></pre>
              <div class="pl-10">
                <pre data-prefix="1"><code class="text-white/90"><strong>Address:</strong> ${detail.address}</code></pre>
                <pre data-prefix="2"><code class="text-white/90"><strong>Netmask:</strong> ${detail.netmask}</code></pre>
                <pre data-prefix="3"><code class="text-white/90"><strong>Family:</strong> ${detail.family}</code></pre>
                <pre data-prefix="4"><code class="text-white/90"><strong>MAC:</strong> ${detail.mac}</code></pre>
                <pre data-prefix="5"><code class="text-white/90"><strong>Internal:</strong> ${detail.internal}</code></pre>
                <pre data-prefix="6"><code class="text-white/90"><strong>CIDR:</strong> ${detail.cidr}</code></pre>
                ${
                  detail.scopeid !== undefined
                    ? `<pre data-prefix="7"><code class="text-white/90"><strong>Scope ID:</strong> ${detail.scopeid}</code></pre>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    });
  
    resultDiv.innerHTML = content;
}
  

function getNetworksInterface() {
    fetch("/api/network/infos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((datas) => {
        displayInterfaces(new Map(Object.entries(datas))    )
    })
}