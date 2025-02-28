import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import CardService from "../database/CardService";
import VehicleDao from "../database/VehicleDao";
import { VehicleCardType } from "../types/VehicleCardType";
import { create } from "zustand";
import { convertformatDateAngolan } from "../utils";

const initialState: State = {
    cards: [],
    selectedVehicleCard: null
};

interface State {
    cards: VehicleCardType[];
    selectedVehicleCard: VehicleCardType | null;
}

interface Actions {
    getAllVehicleCards: (url: string | null) => void;
    clearSelectedVehicleCard: () => void;
    generateVehicleCardFrontPVC: (card: VehicleCardType, hasBlueBackground?: boolean) => Promise<Uint8Array>;
}

export const useVehicleCardState = create<Actions & State>((set) => ({
    ...initialState,

    setSelectedVehicleCard: (selectedVehicleCard: VehicleCardType) =>
        set(() => ({ selectedVehicleCard })),

    clearSelectedVehicleCard: () => set(() => ({ selectedVehicleCard: null })),

    getAllVehicleCards: (url: string | null) => {
        if (url) {
            CardService.shared.getAllVehicleCards(url)
                .then(cards => set((state) => ({ ...state, cards })))
                .catch(console.log);
        } else {
            VehicleDao.shared.getAllVehicles()
                .then(vehicles => {
                    const cards: VehicleCardType[] = vehicles.map(vehicle => ({
                        vehicle,
                        expiration: new Date(),
                        cardNumber: "0000",
                        entity: "Desconhecido"
                    }));

                    set((state) => ({ ...state, cards }));
                })
                .catch(console.log);
        }
    },

    generateVehicleCardFrontPVC: async (card: VehicleCardType, hasBlueBackground?: boolean) => {
        const pdfDoc = await PDFDocument.create();
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const height = 242.64;
        const width = 153;
        const page = pdfDoc.addPage([width, height]);

        // Definição de cores
        const grayColor = rgb(0.9, 0.9, 0.9);
        const blueColor = rgb(0.141, 0.608, 0.753);


        // Criar fundo azul ou cinza
        page.drawRectangle({
            x: 0,
            y: height - 145,
            width: width,
            height: 230,
            color: hasBlueBackground ? blueColor : grayColor,
            opacity: hasBlueBackground ? 1 : 0.5
        });

       
       

        // Número do cartão (separado por linhas)
        page.drawText(card.cardNumber.split("").join("\n"), {
            x: width - 20,
            y: height - 35,
            size: 24,
            color: rgb(0, 0, 0),
            font: helveticaBold,
        });

        // Nome da entidade centralizado
        const textWidth = helveticaBold.widthOfTextAtSize(card.vehicle.entity, 20);
        const pageWidth = page.getWidth();
        const x = (pageWidth - textWidth) / 2;

        page.drawText(card.vehicle.entity, {
            x,
            y: height - 85,
            size: 18,
            color: rgb(0, 0, 0),
            font: helveticaBold,
        });

        // Dados do veículo
        page.drawText(`Marca: ${card.vehicle.brand?.toLocaleUpperCase() || "N/A"}`, {
            x: 10,
            y: height / 3,
            size: 9,
            color: rgb(0, 0, 0),
            font: helveticaBold
        });

        page.drawText(`Cor: ${card.vehicle.color?.toUpperCase() || "N/A"}`, {
            x: 10,
            y: height / 3.7,
            size: 9,
            color: rgb(0, 0, 0),
            font: helveticaBold
        });

        page.drawText(`Matrícula: ${card.vehicle.licensePlate?.toUpperCase() || "N/A"}`, {
            x: 10,
            y: height / 4.2,
            size: 9,
            color: rgb(0, 0, 0),
            font: helveticaBold
        });

        page.drawText(`Tipo: ${card.vehicle.type?.toUpperCase() || "N/A"}`, {
            x: 10,
            y: height / 4.5,
            size: 9,
            color: rgb(0, 0, 0),
            font: helveticaBold
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
    }
}));
