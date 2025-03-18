
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
    
        const { width, height } = page.getSize();
    
        // Carregar a imagem de fundo do texto repetido "AEROPORTO INTERNACIONAL..."
        const backgroundText = await fetch('/aeroporto.png').then(response => response.arrayBuffer());
        const backgroundImage = await pdfDoc.embedPng(backgroundText);
    
        // Desenhar a imagem de fundo primeiro
        page.drawImage(backgroundImage, {
            x: 0,
            y: 0,
            width: width,
            height: height
        });
    
        // Desenhar o retângulo verde semi-transparente por cima da imagem de fundo
        const greenColor = rgb(0 / 255, 173 / 255, 67 / 255); // Verde mais vivo como na imagem
        page.drawRectangle({
            x: 0,
            y: 0,
            width: width,
            height: height,
            color: greenColor,
            opacity: 0.85 // Mais opaco para mostrar o verde intenso
        });
    
        // Adicionar o logo SGA no canto superior esquerdo
        const sgaLogo = await fetch('/SGA Logo.png').then(response => response.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(sgaLogo);
        page.drawImage(logoImage, {
            x: 10,
            y: 150,
            width: 80,
            height: 40
        });
    
        // Cor branca para todo o texto
        const whiteColor = rgb(1, 1, 1);
    
        // Adicionar a data de expiração em formato grande
        page.drawText(card.expiration.toLocaleDateString("pt-AO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).replace(/\//g, "."), {
            x: 200,
            y: 160,
            size: 24,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar o número do cartão
        page.drawText(`Nº${card.cardNumber.padStart(3, '0')}`, {
            x: 10,
            y: 140,
            size: 24,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar a informação da companhia
        page.drawText('COMPANHIA:', {
            x: 10,
            y: 120,
            size: 12,
            font: helveticaBold,
            color: whiteColor
        });
    
        page.drawText(card.vehicle.entity, {
            x: 10,
            y: 105,
            size: 14,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar a informação da cor
        page.drawText('COR:', {
            x: 10,
            y: 90,
            size: 12,
            font: helveticaBold,
            color: whiteColor
        });
    
        page.drawText(card.vehicle.color, {
            x: 10,
            y: 80,
            size: 14,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar matrícula ou operações com base no tipo de permissão
        if (card.permitType === 'P') {
            page.drawText('MATRICULA:', {
                x: 10,
                y: 30,
                size: 12,
                font: helveticaBold,
                color: whiteColor
            });
    
            page.drawText(card.vehicle.licensePlate || '', {
                x: 10,
                y: 15,
                size: 14,
                font: helveticaBold,
                color: whiteColor
            });
        } else {
            page.drawText('TIPO:', {
                x: 10,
                y: 70,
                size: 12,
                font: helveticaBold,
                color: whiteColor
            });
    
            page.drawText(card.vehicle.type || '', {
                x: 10,
                y: 60,
                size: 14,
                font: helveticaBold,
                color: whiteColor
            });
        }
    
        // Adicionar marca e modelo
        page.drawText('MARCA:', {
            x: 10,
            y: 50, // Posicionamento abaixo
            size: 12,
            font: helveticaBold,
            color: whiteColor
        });
    
        page.drawText(`${card.vehicle.brand} `, {
            x: 10,
            y: 40, // Posicionamento abaixo
            size: 14,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar o tipo de permissão (P ou T) em formato grande
        page.drawText(card.permitType || '', {
            x: 250,
            y: 90,
            size: 120,
            font: helveticaBold,
            color: whiteColor
        });
    
        // Adicionar informação do diretor
        page.drawText('O DIRECTOR DO AEROPORTO', {
            x: 200,
            y: 10,
            size: 6,
            font: helveticaBold,
            color: whiteColor
        });
    
        page.drawText('DR. ARMINDO CHAMBASSUCO', {
            x: 210,
            y: 0,
            size: 6,
            font: helvetica,
            color: whiteColor
        });
    
        // Serializar o PDFDocument para bytes
        const pdfBytes = await pdfDoc.save();
    
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
