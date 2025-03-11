import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import VehicleCardService from "../database/VehicleCardService";
import VehicleCardDao from "../database/VehicleCardDao";
import { VehicleCardType } from "../types/VehicleCardType";
import { create } from "zustand";
import { convertformatDateAngolan } from "../utils";


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
    generateVehicleCardFrontPVC: (card: VehicleCardType, hasBlueBackground?: boolean) => Promise<Uint8Array>;
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
                .then((cards: any) => {

                    if (!Array.isArray(cards)) {
                        console.error("Dados inválidos recebidos:", cards);
                        return;
                    }
                    set(() => ({ cards: cards as VehicleCardType[] }));
                })
                .catch(console.error);
        } else {
            VehicleCardDao.shared.getAllCards()
                .then((cards: any) => {
                    if (!Array.isArray(cards)) {
                        console.error("Dados inválidos recebidos:", cards);
                        return;
                    }
                    set(() => ({ cards: cards as VehicleCardType[] }));
                })
                .catch(console.error);
        }
    },


    generateVehicleCardFrontPVC: async (card: VehicleCardType, hasBlueBackground?: boolean) => {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const height = 368;
        const width = 510;
        const page = pdfDoc.addPage([width, height]);

        // Fundo Verde
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(0, 1, 0), // Cor verde
        });


        // Texto do Cartão
        page.drawText(`Nº ${card.cardNumber}`, {
            x: 30,
            y: height - 80,
            size: 24,
            font,
            color: rgb(1, 1, 1),
        });
        // Marca do veículo
        page.drawText(`MARCA: ${card.vehicle.brand}`, {
            x: 30,
            y: height - 140,
            size: 18,
            font,
            color: rgb(1, 1, 1),
        });

        // Data de Validade
        page.drawText(card.expiration.toString(), {
            x: width - 170,
            y: height - 40,
            size: 24,
            font,
            color: rgb(1, 1, 1),
        });

        // Letra Grande
        page.drawText(card.vehicle.color, {
            x: width / 2 - 50,
            y: height / 2 - 50,
            size: 120,
            font,
            color: rgb(1, 1, 1),
        });



        page.drawText(`Matrícula: ${card.vehicle.licensePlate?.toUpperCase() || "N/A"}`, {
            x: 10,
            y: height / 4.2,
            size: 9,
            color: rgb(0, 0, 0),
            font,
        });



        page.drawText(`Validade: ${convertformatDateAngolan(card.expiration)}`, {
            x: 10,
            y: height / 4.8,
            size: 9,
            color: rgb(0, 0, 0),
        });

        // Salvar e retornar o PDF
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    },
    generateVehicleCardBackPVC: async () => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([180, 130]); // 18cm x 13cm (convertido para pontos)
        
        // Adicionar conteúdo ao PDF
        const { width, height } = page.getSize();
        page.drawText('Verso do Cartão de Veículo', {
            x: width - 20,
            y: height - 40,
            size: 12
        });
    
        return await pdfDoc.save(); // Retorna um Uint8Array
    },
}));
