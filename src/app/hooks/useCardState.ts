import { create } from "zustand";
import { CardType } from "../types/CardType";
import CardDao from "../database/CardDao";
import { BlendMode, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { bottom, convertformatDateAngolan, getFirstAndLastName, signed, signedBack, top } from "../utils";
import CardService from "../database/CardService";


const initialState: State = { 
    cards: [],
    selectedCard: null  
} 
 
 interface State {
    cards: CardType[] 
    selectedCard: CardType | null
}

interface Actions {

    getAllCards: (url: string | null) => void
    generatePersonCardFrontPVC: (card: CardType, hasBlueBackground?: boolean) => Promise<Uint8Array>
    generatePersonCardBackPVC: () => Promise<Uint8Array>
    generateA4CardsBack: (cards: CardType[]) => Promise<Uint8Array>
    generateA4Cards: (cards: CardType[]) => Promise<Uint8Array>
    setSelectedCard: (card: CardType) => void
    clearSelectedCard: () => void
    generateCardPDF: (card: CardType) => Promise<Uint8Array>
}



 
export const useCardState = create<Actions & State>((set) => ({
    ...initialState,
    setSelectedCard: (selectedCard: CardType) => set(() => {

        /*  const selectedCards = [...state.selectedCards]
 
         if (selectedCards.includes(selectedCard)) {
             return ({ selectedCards: selectedCards.filter(card => card.cardNumber !== selectedCard.cardNumber) })
         }
  */
        return ({ selectedCard })
    }),
    
    clearSelectedCard: () => set(() => ({ selectedCard: null })),
    getAllCards: (url: string | null) => {
        if (url) {
            CardService.shared.getAllCards(url)
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
        } else {
            CardDao.shared.getAllCards()
                .then(cards => {
                    set(() => ({ cards }))
                })
                .catch(console.log)
        }
    },
    generatePersonCardFrontPVC: async (card: CardType, hasBlueBackground?: boolean) => {
        const pdfDoc = await PDFDocument.create();
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const height = 242.64;
        const width = 153;

        const page = pdfDoc.addPage([width, height]);

        const grayColor = rgb(0.9, 0.9, 0.9);
        const orangeColor = rgb(1, 0.5, 0);
        const blueColor = rgb(0.141, 0.608, 0.753);
        const whiteColor = rgb(1, 1, 1);

        const imageMaxWidth = width - 40; 
        const imageMaxHeight = height / 2.5;


        const boxSpacing = 2;

        let imgPerson;

        try {
            imgPerson = await pdfDoc.embedPng(card.person.image ?? '');
        } catch (error) {
            console.log(error)
            imgPerson = await pdfDoc.embedJpg(card.person.image ?? '');
        }

        const imageWidth = Math.min(imgPerson.width, imageMaxWidth);
        const imageHeight = Math.min(imgPerson.height, imageMaxHeight);

        const signedImage = await pdfDoc.embedPng(signed);

        //const imagerPersonDims = imgPerson.scale(0.15);
        const signedImageDims = signedImage.scale(0.18);

        const sideBoxWidth = 18;
        const sideBoxHeight = 18;
        const sideLabels = card.person.accessType;

        page.drawRectangle({
            x: 0,
            y: height - 145,
            width: width,
            height: 230,
            color: hasBlueBackground ? blueColor : grayColor,
            opacity: hasBlueBackground ? 1 : 0.5
        });

        sideLabels.forEach((label, index) => {
            const boxYOffset = index * (sideBoxHeight + boxSpacing);

            page.drawRectangle({
                x: 5,
                y: height - 30 - boxYOffset,
                width: sideBoxWidth,
                height: sideBoxHeight,
                color: index === 0 || index === 5 ? whiteColor : orangeColor,
                borderWidth: 1,
            });

            page.drawText(label, {
                x: 9,
                y: height - 26 - boxYOffset,
                size: 14,
                color: rgb(0, 0, 0),
                font: helveticaBold,
            });
        });

        page.drawText(card.cardNumber.split("").join("\n"), {
            x: width - 20,
            y: height - 35,
            size: 24,
            color: rgb(0, 0, 0),
            font: helveticaBold,
        });

        const textWidth = helveticaBold.widthOfTextAtSize(card.person.entity, 20);
        const pageWidth = page.getWidth();
        const x = (pageWidth - textWidth) / 2;

        page.drawText(card.person.entity, {
            x,
            y: sideBoxHeight + 85,
            size: 18,
            color: rgb(0, 0, 0),
            font: helveticaBold,
        });

        page.drawRectangle({
            x: (width - imageWidth) / 1.3,
            y: height - imageHeight - 22,
            width: imageWidth - 20,
            height: imageHeight + 10,
            borderWidth: 1,
            color: whiteColor
        });

        page.drawImage(imgPerson, {
            x: (width - imageWidth) / 1.3,
            y: height - imageHeight - 22,
            width: imageWidth - 20,
            height: imageHeight + 10,
        });

        page.drawImage(signedImage, {
            x: (width - signedImageDims.width) / 2,
            y: 0,
            width: signedImageDims.width, 
            height: signedImageDims.height,
        });

        page.drawText(`Nome: ${getFirstAndLastName(card.person.name.toLocaleUpperCase())}`, {
            x: 10,
            y: height / 3,
            size: 9,
            color: rgb(0, 0, 0),
            font: helveticaBold
        });

        page.drawText(`Função: ${card.person.job?.toUpperCase()}`, {
            x: 10,
            y: height / 3.7,
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

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    },
    generatePersonCardBackPVC: async () => {
        const pdfDoc = await PDFDocument.create();
        const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const height = 242.64;
        const width = 153;

        const page = pdfDoc.addPage([width, height]);

        const signedImage = await pdfDoc.embedPng(signedBack);

        const signedImageDims = signedImage.scale(0.15);
        const title = 'PRERROGATIVAS';
        const first = "1. O uso do presente Passe de Acesso é \npessoal e intransmissível e válido até a data \nde expiração, escrita na parte frontal."
        const second = "2. O porte visível e ostensivo é obrigatório e \npermite o Acesso do Portador somente na \nárea autorizada conforme indica no passe."
        const third = "3. O uso indevido do passe, implicará \npenalizações ao infractor conforme \nlegislação e regulamento aplicáveis."
        const forth = "4. Em caso de extravio, perda, roubo ou \nfurto. O portador deverá notificar a \nAutoridade Aeroportuária, podendo fazê-lo \nao Supervisor de Segurança 05 ou a Policia."
        const x = (title.length + 2) * 2;
        const y = height - 20;
        const fontSize = 12;

        page.drawImage(signedImage, {
            x: (width - signedImageDims.width) / 2,
            y: 0,
            width: signedImageDims.width,
            height: signedImageDims.height,
        });

        page.drawText(title, {
            x,
            y,
            size: fontSize,
            font: helveticaFontBold,
            color: rgb(0, 0, 0),
            blendMode: BlendMode.Darken,
        });

        page.drawLine({
            start: { x, y: y - 2 },
            end: { x: x + title.length * fontSize * 0.66, y: y - 2 },
            thickness: 1,
            color: rgb(0, 0, 0),
        });

        page.drawText(first, {
            x: 3,
            y: y - 30,
            font: helveticaFont,
            size: 7.5,
            lineHeight: 8
        })

        page.drawText(second, {
            x: 3,
            y: y - 60,
            font: helveticaFont,
            size: 7.5,
            lineHeight: 8
        })
        page.drawText(third, {
            x: 3,
            y: y - 90,
            font: helveticaFont,
            size: 7.5,
            lineHeight: 8
        })
        page.drawText(forth, {
            x: 3,
            y: y - 120,
            font: helveticaFont,
            size: 7.5,
            lineHeight: 8
        })

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    },
    generateA4CardsBack: async (cards: CardType[]) => {
        const pdfDoc = await PDFDocument.create();
        const helveticaFontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const cardWidth = 153;
        const cardHeight = 242.64;

        const pageWidth = PageSizes.A4[0];
        const pageHeight = PageSizes.A4[1];

        const marginX = 30;
        const marginY = 30;
        const spacingX = 20;
        const spacingY = 20;

        const rows = 3;
        const cols = 3;
        const cardsPerPage = rows * cols;

        const signedImage = await pdfDoc.embedPng(signedBack);

        const signedImageDims = signedImage.scale(0.15);

        const title = 'PRERROGATIVAS';
        const fontSize = 12;

        const prerrogatives = [
            `1. O uso do presente Passe de Acesso é \npessoal e intransmissível e válido até a data \nde expiração, escrita na parte frontal.`,
            `2. O porte visível e ostensivo é obrigatório e \npermite o Acesso do Portador somente na \nárea autorizada conforme indica no passe.`,
            `3. O uso indevido do passe, implicará \npenalizações ao infractor conforme \nlegislação e regulamento aplicáveis.`,
            `4. Em caso de extravio, perda, roubo ou \nfurto. O portador deverá notificar a \nAutoridade Aeroportuária, podendo fazê-lo \nao Supervisor de Segurança 05 ou a Policia.`,
        ];

        for (let pageIndex = 0; pageIndex < Math.ceil(cards.length / cardsPerPage); pageIndex++) {

            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            const startIndex = pageIndex * cardsPerPage;
            const endIndex = Math.min(startIndex + cardsPerPage, cards.length);

            for (let i = startIndex; i < endIndex; i++) {
                const cardIndex = i % cardsPerPage; // Índice relativo à página atual
                const col = cardIndex % cols; // Coluna atual
                const row = Math.floor(cardIndex / cols); // Linha atual

                const x = marginX + col * (cardWidth + spacingX);
                const y = pageHeight - marginY - (row + 1) * (cardHeight + spacingY);

                // Desenhar retângulo cinza
                page.drawRectangle({
                    x: x,
                    y: y,
                    width: cardWidth,
                    height: cardHeight,
                    color: rgb(1, 1, 1),
                    borderColor: rgb(0.5, 0.5, 0.5),
                    borderWidth: 1,
                });

                // Adicionar imagem de fundo assinada
                page.drawImage(signedImage, {
                    x: x + (cardWidth - signedImageDims.width) / 2,
                    y: y,
                    width: signedImageDims.width,
                    height: signedImageDims.height,
                });

                // Adicionar título "PRERROGATIVAS"
                page.drawText(title, {
                    x: x + (cardWidth - title.length * fontSize * 0.5) / 2.4,
                    y: y + cardHeight - 20,
                    size: fontSize,
                    font: helveticaFontBold,
                    color: rgb(0, 0, 0),
                });

                // Adicionar linha abaixo do título
                page.drawLine({
                    start: { x: x + 20, y: y + cardHeight - 22 },
                    end: { x: x + cardWidth - 10, y: y + cardHeight - 22 },
                    thickness: 1,
                    color: rgb(0, 0, 0),
                });

                // Adicionar prerrogativas
                prerrogatives.forEach((text, index) => {
                    page.drawText(text, {
                        x: x + 2,
                        y: y + cardHeight - 50 - index * 40,
                        font: helveticaFont,
                        size: 7.5,
                        lineHeight: 8,
                    });
                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    },
    generateA4Cards: async (cards: CardType[]) => {
        const pdfDoc = await PDFDocument.create();
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const pageWidth = PageSizes.A4[0];
        const pageHeight = PageSizes.A4[1];

        const cardWidth = 153;
        const cardHeight = 242.64;

        const marginX = 30; // Margem lateral
        const marginY = 30; // Margem superior/inferior
        const spacingX = 20; // Espaçamento horizontal entre cartões
        const spacingY = 20; // Espaçamento vertical entre cartões

        const rows = 3; // Número de linhas
        const cols = 3; // Número de colunas
        const cardsPerPage = rows * cols; // Máximo de cartões por página

        // Carregar imagens externas
        const topImage = await pdfDoc.embedPng(top);
        const bottomImage = await pdfDoc.embedPng(bottom);
        const signedImage = await pdfDoc.embedPng(signed);

        // Paginação
        for (let pageIndex = 0; pageIndex < Math.ceil(cards.length / cardsPerPage); pageIndex++) {
            // Criar nova página A4
            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            const startIndex = pageIndex * cardsPerPage; // Índice inicial para a página
            const endIndex = Math.min(startIndex + cardsPerPage, cards.length); // Índice final para a página

            for (let i = startIndex; i < endIndex; i++) {
                const card = cards[i];
                const cardIndex = i % cardsPerPage; // Índice relativo na página atual

                const col = cardIndex % cols; // Coluna atual
                const row = Math.floor(cardIndex / cols); // Linha atual

                const x = marginX + col * (cardWidth + spacingX);
                const y = pageHeight - marginY - (row + 1) * (cardHeight + spacingY);

                // Desenhar retângulo cinza
                page.drawRectangle({
                    x: x,
                    y: y,
                    width: cardWidth,
                    height: cardHeight,
                    color: rgb(1, 1, 1),
                    borderColor: rgb(0.5, 0.5, 0.5),
                    borderWidth: 1,
                });

                // Ajustar imagens com escala
                const topImageDims = topImage.scale(0.15);
                const bottomImageDims = bottomImage.scale(0.15);
                const signedImageDims = signedImage.scale(0.18);

                page.drawRectangle({
                    x: x + 1,
                    y: y + cardHeight - 110,
                    width: cardWidth - 2,
                    height: topImageDims.height + bottomImageDims.height + 35,
                    color: rgb(0.9, 0.9, 0.9),
                });

                page.drawImage(topImage, {
                    x: x + (cardWidth - topImageDims.width) / 2,
                    y: y + cardHeight - topImageDims.height - 10,
                    width: topImageDims.width,
                    height: topImageDims.height,
                });

                // Adicionar imagem da base
                page.drawImage(bottomImage, {
                    x: x + (cardWidth - bottomImageDims.width) / 2,
                    y: y + cardHeight / 1.75,
                    width: bottomImageDims.width,
                    height: bottomImageDims.height,
                });

                // Adicionar imagem de assinatura
                page.drawImage(signedImage, {
                    x: x + (cardWidth - signedImageDims.width) / 2,
                    y: y + 10,
                    width: signedImageDims.width,
                    height: signedImageDims.height,
                });

                // Adicionar textos no cartão
                page.drawText(card.cardNumber, {
                    x: x + cardWidth / 2 - 25,
                    y: y + cardHeight / 2 + 65,
                    size: 24,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Nome: `, {
                    x: x + 8,
                    y: y + cardHeight / 2.1,
                    size: 10,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(getFirstAndLastName(card.person.name.toLocaleUpperCase()), {
                    x: x + 50,
                    y: y + cardHeight / 2.1,
                    size: 9,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Função:`, {
                    x: x + 8,
                    y: y + cardHeight / 2.5,
                    size: 10,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(card.person.job?.toUpperCase(), {
                    x: x + 50,
                    y: y + cardHeight / 2.5,
                    size: 9,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Validade:`, {
                    x: x + 8,
                    y: y + cardHeight / 3.1,
                    size: 10,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(convertformatDateAngolan(card.expiration), {
                    x: x + 66,
                    y: y + cardHeight / 3.1,
                    size: 9,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Entidade:`, {
                    x: x + 8,
                    y: y + cardHeight / 4.1,
                    size: 10,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });

                page.drawText(`FNCT/${card.person.entity ?? 'SGA-SA'}`, {
                    x: x + 66,
                    y: y + cardHeight / 4.1,
                    size: 9,
                    color: rgb(0, 0, 0),
                });
            }
        }

        // Salvar PDF como bytes
        const pdfBytes = await pdfDoc.save();

        return pdfBytes;
    },

    generateCardPDF: async (card: CardType) => {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();

        // Add a page to the document
        const page = pdfDoc.addPage([300, 400]); // ID card dimensions
        const { width, height } = page.getSize();

        // Draw the background color
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(0.9, 0.9, 0.9), // Light gray background
        });

        // Draw the left-side blocks (A-F)
        const blockHeight = 30;
        const blockWidth = 20;
        const colors = [rgb(1, 1, 1), rgb(1, 0.5, 0)]; // Black and Orange
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach((letter, index) => {
            page.drawRectangle({
                x: 10,
                y: height - 20 - (index + 1) * blockHeight,
                width: blockWidth,
                height: blockHeight,
                color: index === 1 || index === 2 || index === 3 ? colors[1] : colors[0], // Orange for B, C, D
            });
            page.drawText(letter, {
                x: 15,
                y: height - 20 - (index + 1) * blockHeight + 8,
                size: 10,
                color: rgb(1, 1, 1),
            });
        });

        // Draw the card number on the right side
        const cardDigits = card.cardNumber.split('');
        cardDigits.forEach((digit, index) => {
            page.drawText(digit, {
                x: 260,
                y: height - 20 - index * blockHeight - blockHeight / 2,
                size: 12,
                color: rgb(0, 0, 0),
            });
        });

        // Draw a placeholder for the photo
        page.drawRectangle({
            x: 50,
            y: height - 150,
            width: 100,
            height: 100,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });

        // Add text fields
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(`NOME: ${card.person.name}`, {
            x: 10,
            y: 80,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });
        page.drawText(`FUNÇÃO: ${card.person.job}`, {
            x: 10,
            y: 65,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Val: ${card.expiration.toLocaleDateString('pt-PT')}`, {
            x: 10,
            y: 50,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });
        page.drawText(card.person.entity, {
            x: 10,
            y: 35,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        // Optionally embed logo or signature images (if you have them)
        // const logoImage = await fetch('path_to_logo.png').then((res) => res.arrayBuffer());
        // const embeddedLogo = await pdfDoc.embedPng(logoImage);
        // page.drawImage(embeddedLogo, {
        //   x: 10,
        //   y: 10,
        //   width: 50,
        //   height: 20,
        // });

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Create a blob and trigger download



        return pdfBytes;
    }







}));