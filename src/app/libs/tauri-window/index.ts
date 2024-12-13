import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { Buffer } from "buffer"
import { readFile, BaseDirectory } from '@tauri-apps/plugin-fs';

export async function openCardPDF(path: string) {

    const content = await readFile(path, { baseDir: BaseDirectory.AppLocalData })
    const base64PDF = Buffer.from(content).toString('base64')

    //await invoke('open_invoice_pdf')
    const invoiceWindow = new WebviewWindow('invoiceWindow', {
        url: `pvcCard.html?pdfData=${encodeURIComponent(base64PDF)}`,
        title: "Factura",
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
