import { create } from "zustand";
import { CardType } from "../types/CardType";
import CardDao from "../database/CardDao";
import { BlendMode, PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { bottom, convertformatDateAngolan, getFirstAndLastName, signed, signedBack, top } from "../utils";
import CardService from "../database/CardService";

const initialState: State = {
    cards: [],
    selectedCards: []
}

interface State {
    cards: CardType[]
    selectedCards: CardType[]
}

interface Actions {
    getAllCards: (url: string | null) => void
    generatePersonCardFrontPVC: (card: CardType) => Promise<Uint8Array<ArrayBuffer>>
    generatePersonCardBackPVC: () => Promise<Uint8Array<ArrayBuffer>>
    generateA4CardsBack: (cards: CardType[]) => Promise<Uint8Array<ArrayBuffer>>
    generateA4Cards: (cards: CardType[]) => Promise<Uint8Array<ArrayBuffer>>
    setSelectedCard: (card: CardType) => void
    clearSelectedCard: () => void
}

export const useCardState = create<Actions & State>((set) => ({
    ...initialState,
    setSelectedCard: (selectedCard: CardType) => set((state) => {

        const selectedCards = [...state.selectedCards ]

        if (selectedCards.includes(selectedCard)) {
            return ({ selectedCards: selectedCards.filter(card => card.cardNumber !== selectedCard.cardNumber ) })    
        }

        return ({ selectedCards: [...state.selectedCards, selectedCard] })
    }),
    clearSelectedCard: () => set(() => ({ selectedCards: [] })),
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
    generatePersonCardFrontPVC: async (card: CardType) => {
        const pdfDoc = await PDFDocument.create();
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const height = 242.64;
        const width = 153;

        const page = pdfDoc.addPage([width, height]);

        const grayColor = rgb(0.9, 0.9, 0.9);

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

        page.drawText(`Nome: ${getFirstAndLastName(card.person.name.toLocaleUpperCase())}`, {
            x: 10,
            y: height / 2.1,
            size: 11,
            color: rgb(0, 0, 0),
            font: helveticaBold
        });

        page.drawText(`Função: ${card.person.job?.toUpperCase()}`, {
            x: 10,
            y: height / 2.5,
            size: 11,
            color: rgb(0, 0, 0),
            font: helveticaBold
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
                    x: x + 10,
                    y: y + cardHeight / 2.1,
                    size: 11,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(getFirstAndLastName(card.person.name.toLocaleUpperCase()), {
                    x: x + 50,
                    y: y + cardHeight / 2.1,
                    size: 10,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Função:`, {
                    x: x + 10,
                    y: y + cardHeight / 2.5,
                    size: 11,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(card.person.job?.toUpperCase(), {
                    x: x + 60,
                    y: y + cardHeight / 2.5,
                    size: 10,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Validade:`, {
                    x: x + 10,
                    y: y + cardHeight / 3.1,
                    size: 11,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });
                page.drawText(convertformatDateAngolan(card.expiration), {
                    x: x + 66,
                    y: y + cardHeight / 3.1,
                    size: 11,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`Entidade:`, {
                    x: x + 10,
                    y: y + cardHeight / 4.1,
                    size: 11,
                    color: rgb(0, 0, 0),
                    font: helveticaBold
                });

                page.drawText(`FNCT/${card.person.entity ?? 'SGA-SA'}`, {
                    x: x + 66,
                    y: y + cardHeight / 4.1,
                    size: 11,
                    color: rgb(0, 0, 0),
                });
            }
        }

        // Salvar PDF como bytes
        const pdfBytes = await pdfDoc.save();

        return pdfBytes;
    }
}));