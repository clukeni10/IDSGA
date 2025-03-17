
import VehicleCardService from "../database/VehicleCardService";
import VehicleCardDao from "../database/VehicleCardDao";
import { VehicleCardType } from "../types/VehicleCardType";
import { create } from "zustand";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";





const initialState: State = {
    cards: [],
    selectedCard: null
};

interface State {
    cards: VehicleCardType[]
    selectedCard: VehicleCardType | null
}

interface Actions {
    getAllCards: (url: string | null) => void;
    generateVehicleCardFrontPVC: (card: VehicleCardType, hasBlueBackground?: boolean) => Promise<Uint8Array>
    generateVehicleCardBackPVC: () => Promise<Uint8Array>
    setSelectedCard: (card: VehicleCardType) => void
    clearSelectedCard: () => void;

}



export const useVehicleCardState = create<Actions & State>((set) => ({
    ...initialState,

    setSelectedCard: (selectedCard: VehicleCardType) => set(() => {

        return ({ selectedCard })
    }),

    clearSelectedCard: () => set(() => ({ selectedCard: null })),

    getAllCards: (url: string | null) => {
        if (url) {
            VehicleCardService.shared.getAllCards()
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
                .catch(console.error);
        } else {
            VehicleCardDao.shared.getAllCards()
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
        }
    },
    generateVehicleCardFrontPVC: async (card: VehicleCardType, hasBlueBackground?: boolean) => {

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([350, 200]);

        // Get the standard font
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Set the background color (green)
        page.drawRectangle({
            x: 0,
            y: 0,
            width: 350,
            height: 200,
            color: rgb(0, 0.8, 0.2),
        });

        

        // Add the SGA logo placeholder
        page.drawRectangle({
            x: 10,
            y: 150,
            width: 80,
            height: 40,
            color: rgb(1, 1, 1),
        });

        // Add the SGA text
        page.drawText('SGA', {
            x: 20,
            y: 170,
            size: 20,
            font: helveticaBold,
            color: rgb(0, 0, 0.8),
        });

        // Add the permit type (P or T) in a large format
        page.drawText('P', {
            x: 260,
            y: 100,
            size: 100,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        // Add the expiration date
        page.drawText(card.expiration.toLocaleDateString("pt-AO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).replace(/\//g, "-"), {
            x: 220,
            y: 160,
            size: 20,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        // Add the permit number
        page.drawText(`Nº${card.cardNumber}`, {
            x: 10,
            y: 120,
            size: 20,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });
        // Add the company information
        page.drawText('COMPANHIA:', {
            x: 10,
            y: 100,
            size: 10,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        page.drawText(card.vehicle.entity, {
            x: 10,
            y: 85,
            size: 10,
            font: helvetica,
            color: rgb(1, 1, 1),
        });

        // Add the color information
        page.drawText('COR:', {
            x: 10,
            y: 70,
            size: 10,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        page.drawText(card.vehicle.color, {
            x: 10,
            y: 55,
            size: 10,
            font: helvetica,
            color: rgb(1, 1, 1),
        });

        // Add license plate or operations based on permit type
        if (card.permitType === 'P') {
            page.drawText('MATRICULA:', {
                x: 10,
                y: 40,
                size: 10,
                font: helveticaBold,
                color: rgb(1, 1, 1),
            });

            page.drawText(card.vehicle.licensePlate || '', {
                x: 10,
                y: 25,
                size: 10,
                font: helvetica,
                color: rgb(1, 1, 1),
            });
        } else {
            page.drawText('TIPO:', {
                x: 10,
                y: 40,
                size: 10,
                font: helveticaBold,
                color: rgb(1, 1, 1),
            });

            page.drawText(card.vehicle.type || '', {
                x: 10,
                y: 25,
                size: 10,
                font: helvetica,
                color: rgb(1, 1, 1),
            });
        }

        // Add brand and model
        page.drawText('MARCA:', {
            x: 150,
            y: 40,
            size: 10,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        page.drawText(`${card.vehicle.brand} `, {
            x: 150,
            y: 25,
            size: 10,
            font: helvetica,
            color: rgb(1, 1, 1),
        });

        // Add director information
        page.drawText('O DIRECTOR DO AEROPORTO', {
            x: 200,
            y: 15,
            size: 6,
            font: helveticaBold,
            color: rgb(1, 1, 1),
        });

        page.drawText('DR. ARMINDO CHAMBASSUCO', {
            x: 210,
            y: 5,
            size: 6,
            font: helvetica,
            color: rgb(1, 1, 1),
        });

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Create a blob and trigger download



        return pdfBytes;









    },

    generateVehicleCardBackPVC: async () => {
        const pdfDoc = await PDFDocument.create();
        const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }



}));
