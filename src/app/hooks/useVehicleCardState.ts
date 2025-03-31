import { create } from "zustand"
import VehicleCardDao from "../database/VehicleCardDao"
import VehicleCardService from "../database/VehicleCardService"
import { VehicleCardType } from "../types/VehicleCardType"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"


const initialState: State = {
    cards: [],
    selectedCard: null
}

interface State {
    cards: VehicleCardType[]
    selectedCard: VehicleCardType | null
}

interface Actions {
    setSelectedCard: (card: VehicleCardType) => void
    clearSelectedCard: () => void
    getAllCards: (url: string | null) => void
    generateVehicleCardFrontPVC: (card: VehicleCardType,  hasBlueBackground?: boolean) => Promise<Uint8Array>
    generateVehicleCardBackPVC: () => Promise<Uint8Array>
}

export const useVehicleCardState = create<Actions & State>((set) => ({
    ...initialState,
    setSelectedCard: (selectedCard: VehicleCardType) => set(() => {

        return ({ selectedCard })
    }),

    clearSelectedCard: () => set(() => ({ selectedCard: null })),
    getAllCards: (url: string | null) => {
        if (url) {
            VehicleCardService.shared.getAllCards(url)
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
        } else {
            VehicleCardDao.shared.getAllCards()
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
        }
    },
    generateVehicleCardFrontPVC: async (card: VehicleCardType) => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([350, 200]);

        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const { width, height } = page.getSize();

         // Carregar a imagem de fundo do texto repetido "AEROPORTO INTERNACIONAL..."
         const backgroundText = await fetch('/aeroporto.png').then(response => response.arrayBuffer());
         const backgroundImage = await pdfDoc.embedPng(backgroundText);

         page.drawImage(backgroundImage, {
            x: 0,
            y: 0,
            width: width,
            height: height
        });

         // Adicionar o logo SGA no canto superior esquerdo
         const sgaLogo = await fetch('/sga-logo.png').then(response => response.arrayBuffer());
         const logoImage = await pdfDoc.embedPng(sgaLogo);
         page.drawImage(logoImage, {
             x: 10,
             y: 150,
             width: 100,
             height: 50
         });
     
         // Cor branca para todo o texto
         const whiteColor = rgb(1, 1, 1);
     
         // Adicionar a data de expiração em formato grande
         page.drawText(card.expiration.toLocaleDateString("pt-AO", {
             year: "numeric",
             month: "2-digit",
             day: "2-digit"
         }).replace(/\//g, "."), {
             x: 140,
             y: 160,
             size: 40,
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
             size: 20,
             font: helveticaBold,
             color: whiteColor
         });
     
         page.drawText(card.vehicle.entity, {
             x: 10,
             y: 105,
             size: 15,
             font: helveticaBold,
             color: whiteColor
         });
     
         // Adicionar a informação da cor
         page.drawText('COR:', {
             x: 10,
             y: 85,
             size: 20,
             font: helveticaBold,
             color: whiteColor
         });
     
         page.drawText(card.vehicle.color, {
             x: 10,
             y: 70,
             size: 15,
             font: helveticaBold,
             color: whiteColor
         });
     
        
         
             page.drawText('MATRICULA:', {
                 x: 10,
                 y: 50,
                 size: 20,
                 font: helveticaBold,
                 color: whiteColor
             });
     
             page.drawText(card.vehicle.licensePlate || '', {
                 x: 10,
                 y: 35,
                 size: 15,
                 font: helveticaBold,
                 color: whiteColor
             });
         
          
         
     
         // Adicionar marca e modelo
         page.drawText('MARCA:', {
             x: 10,
             y: 15, // Posicionamento abaixo
             size: 20,
             font: helveticaBold,
             color: whiteColor
         });
     
         page.drawText(`${card.vehicle.brand} `, {
             x: 10,
             y: 1, // Posicionamento abaixo
             size: 15,
             font: helveticaBold,
             color: whiteColor
         });
     
         // Adicionar o tipo de permissão (P ou T) em formato grande
         page.drawText('P', {
             x: 200,
             y: 40,
             size: 150,
             font: helveticaBold,
             color: whiteColor
         });
     
         // Adicionar informação do diretor
         page.drawText('O DIRECTOR DO AEROPORTO', {
             x: 250,
             y: 30,
             size: 6,
             font: helveticaBold,
             color: whiteColor
         });
     
         page.drawText('DR. ARMINDO CHAMBASSUCO', {
             x: 240,
             y: 10,
             size: 6,
             font: helvetica,
             color: whiteColor
         });




        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    },
    generateVehicleCardBackPVC: async () => {
        const pdfDoc = await PDFDocument.create();
       // const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
       // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)


        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
}))