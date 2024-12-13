import { create } from "zustand";
import { CardType } from "../types/CardType";
import CardDao from "../database/CardDao";
import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const initialState: State = {
    cards: [],
}

interface State {
    cards: CardType[]
}

interface Actions {
    getAllCards: () => void
    generatePersonCardPVC: () => Promise<Uint8Array<ArrayBufferLike>>
}

export const useCardState = create<Actions & State>((set) => ({
    ...initialState,
    getAllCards: () => {
        CardDao.shared.getAllCards()
            .then(cards => {
                set(() => ({ cards }))
            })
            .catch(console.log)
    },
    generatePersonCardPVC: async () => {
        // Cria um novo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Define o tamanho do cartão A7 (74mm x 105mm) em pontos
        const width = 74 * 2.83465; // 74 mm convertido para pontos (1 mm = 2.83465 pontos)
        const height = 105 * 2.83465; // 105 mm convertido para pontos (1 mm = 2.83465 pontos)

        // Adiciona uma página com o tamanho especificado
        const page = pdfDoc.addPage([width, height]);

        // Adiciona as fontes padrão
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // Define cores
        const blueColor = rgb(0.2, 0.2, 0.7); // Azul para a letra T
        const blackColor = rgb(0, 0, 0);

        // Desenha o "T"
        page.drawText("T", {
            x: width / 2 - 15,
            y: height - 30,
            size: 16,
            font: boldFont,
            color: blueColor,
        });

        // Desenha o número
        page.drawText("00007", {
            x: width / 2 - 20,
            y: height - 60,
            size: 12,
            font: boldFont,
            color: blackColor,
        });

        // Desenha os dados
        page.drawText("Nome: MANUEL PEDRO", {
            x: 10,
            y: height - 90,
            size: 8,
            font: timesRomanFont,
        });

        page.drawText("Função: LOAD CONTROL", {
            x: 10,
            y: height - 110,
            size: 8,
            font: timesRomanFont,
        });

        page.drawText("VALIDADE: 12/12/2024", {
            x: 10,
            y: height - 130,
            size: 8,
            font: timesRomanFont,
        });

        // Desenha o rodapé
        page.drawText("FNCT/SGA-SA", {
            x: 10,
            y: 10,
            size: 6,
            font: boldFont,
        });

        page.drawText("AEROPORTO INTERNACIONAL PAULO TEIXEIRA JORGE", {
            x: 10,
            y: 0,
            size: 5,
            font: timesRomanFont,
        });

        // Salva o PDF como bytes
        const pdfBytes = await pdfDoc.save();

        // Retorna os bytes do PDF
        return pdfBytes;
    }
}));