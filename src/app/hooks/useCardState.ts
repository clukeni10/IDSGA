import { create } from "zustand";
import { CardType } from "../types/CardType";
import CardDao from "../database/CardDao";
import { PDFDocument, rgb } from 'pdf-lib';
import { readFile } from "@tauri-apps/plugin-fs"
import { convertformatDateAngolan } from "../utils";

const initialState: State = {
    cards: [],
}

interface State {
    cards: CardType[]
}

interface Actions {
    getAllCards: () => void
    generatePersonCardPVC: (card: CardType) => Promise<Uint8Array<ArrayBuffer>>
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
    generatePersonCardPVC: async (card: CardType) => {
        const pdfDoc = await PDFDocument.create();

        const height = 242.64;
        const width = 153;

        const page = pdfDoc.addPage([width, height]);

        const grayColor = rgb(0.9, 0.9, 0.9);

        const signed = await readFile('resources/signed.jpg')
        const top = await readFile('resources/t_up.png')
        const bottom = await readFile('resources/t_down.png')

        const topImage = await pdfDoc.embedPng(top);
        const bottomImage = await pdfDoc.embedPng(bottom);
        const signedImage = await pdfDoc.embedJpg(signed);

        const topImageDims = topImage.scale(0.15);
        const bottomImageDims = bottomImage.scale(0.15);
        const signedImageDims = signedImage.scale(0.18);

        page.drawRectangle({
            x: 0,
            y: height - 110,
            width: width,
            height: 230,
            color: grayColor,
        });

        page.drawImage(topImage, {
            x: (width - topImageDims.width) / 2,
            y: height - topImageDims.height - 10,
            width: topImageDims.width,
            height: topImageDims.height,
        });

        page.drawText(card.cardNumber, {
            x: width / 2 - 25,
            y: height / 2 + 65,
            size: 24,
            color: rgb(0, 0, 0),
        });

        page.drawImage(bottomImage, {
            x: (width - bottomImageDims.width) / 2,
            y: height / 1.75,
            width: bottomImageDims.width,
            height: bottomImageDims.height,
        });

        page.drawImage(signedImage, {
            x: (width - signedImageDims.width) / 2,
            y: 0,
            width: signedImageDims.width,
            height: signedImageDims.height,
        });

        page.drawText(`Nome: ${card.person.name}`, {
            x: 10,
            y: height / 2.1,
            size: 11,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Função: ${card.person.job}`, {
            x: 10,
            y: height / 2.5,
            size: 11,
            color: rgb(0, 0, 0),
        });


        page.drawText(`Validade: ${convertformatDateAngolan(card.expiration)}`, {
            x: 10,
            y: height / 3.1,
            size: 11,
            color: rgb(0, 0, 0),
        });

        page.drawText('FNCT/SGA-SA', {
            x: 'FNCT/SGA-SA'.length * 3.9,
            y: height / 4.2,
            size: 11,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
}));