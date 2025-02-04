from scapy.all import *
import importlib
import sys
from typing import Any

def main():
    input_data = sys.argv[1]

    if input_data:
        data = json.loads(input_data)  #Json -> dict
        function_name = data.get('function_name')
        args = data.get('args', [])

        if function_name and hasattr(sys.modules[__name__], function_name):
            func = getattr(sys.modules[__name__], function_name)
            result = func(*args)
            print(result)
        else:
            print(f"Erreur: La fonction {function_name} n'est pas définie.")


def createFrame (src_mac, dst_mac, payload, eth_type = 0x0800):
    try:
        frame = Ether(src=src_mac, dst=dst_mac, type=eth_type) / payload
        return bytes_hex(frame).decode("utf-8")
    except Exception as e:
        return f"Erreur: {e}"


def sendTCP(target_ip: str, target_port: int):
    conf.verb = 0

    target = target_ip
    port = target_port

    packet = IP(dst=target)/TCP(dport=port, flags="S")
    response = sr1(packet, timeout=2)

    if response:
        if response.haslayer(TCP) and response[TCP].flags == "SA":
            return f"Port {port} sur {target} est ouvert (SYN-ACK reçu)."
        elif response.haslayer(TCP) and response[TCP].flags == "RA":
            return f"Port {port} sur {target} est fermer (RST-ACK reçu)."
        else:
            return f"Une reponse TCP inconnue est reçu sur {target}."
    else:
        return f"Pas de reponse de {target}."

def sendPing(target: str):
    conf.verb = 0
    packet = IP(dst=target)/ICMP()
    response = sr1(packet, timeout=2)
    if response:
        return f"Reponse de {target}: {response.summary()}"
    else:
        return f"Pas de reponse de {target}."

if __name__ == "__main__":
    main()
