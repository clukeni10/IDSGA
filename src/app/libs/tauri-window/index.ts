import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export async function openCardPDF(path: string, cardData: { name: string; personFunction:string, cardNumber: string, cardValidate: Date, acessType: string[]}) {

    const cardValidateString = cardData.cardValidate.toLocaleDateString("pt-AO"); // Exemplo: "31/12/2024"
    //const imagemParam = cardData.imagem ? encodeURIComponent(cardData.imagem) : "";



    
    const invoiceWindow = new WebviewWindow('invoiceWindow', {
        url: `pvcCard.html?path=${encodeURIComponent(path)}&name=${encodeURIComponent(cardData.name)}&cardNumber=${encodeURIComponent(cardData.cardNumber)}&acessType=${cardData.acessType}&cardValidate=${encodeURIComponent(cardValidateString)}&personFunction=${encodeURIComponent(cardData.personFunction)}`,


        title: "Impressão de Cartão",
        width: 800,
        height: 600,
        center: true,

        

        alwaysOnTop: true
    })

    invoiceWindow.once('tauri://created', () => {
        console.log("Criada")
    })
    invoiceWindow.once('tauri://close-requested', () => {
        invoiceWindow.close()
    })
    invoiceWindow.once('tauri://error', (e) => {
        console.log("Erro ao criar a janela de factura", e)
    })
} 