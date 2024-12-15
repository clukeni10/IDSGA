import React, { useEffect } from "react";

const PersonCardPDF: React.FC = () => {
    useEffect(() => {
        // Aguarda o carregamento e imprime
        window.print();
    }, []);

    return (
        <div style={{ width: "85.6mm", height: "53.98mm", margin: "auto", padding: "5mm", boxSizing: "border-box", border: "1px solid #000" }}>
            <img src="t_up.png" alt="Topo" style={{ width: "40mm", margin: "auto" }} />
            <div style={{ fontSize: "16pt", fontWeight: "bold", textAlign: "center" }}>1234567890</div>
            <div style={{ fontSize: "10pt", lineHeight: "1.4", marginTop: "5mm" }}>
                Nome: ARMINDO JAIME<br />
                Função: TÉCNICO<br />
                VALIDADE: 31 DEZEMBRO 2024<br />
                FNCT/SGA-SA
            </div>
            <img src="signed.jpg" alt="Assinatura" style={{ position: "absolute", bottom: "5mm", left: "5mm", width: "20mm" }} />
        </div>
    );
};

export default PersonCardPDF;
