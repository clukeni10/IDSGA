import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export async function openCardPDF(path: string) {
    const invoiceWindow = new WebviewWindow('invoiceWindow', {
        url: `pvcCard.html?path=${encodeURIComponent(path)}`,
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