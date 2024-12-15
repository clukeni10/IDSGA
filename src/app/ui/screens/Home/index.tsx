"use client"
import { Stack, Grid, For } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AddPersonModal from "./AddPerson";
import CardId from "../../components/CardId";
import HeaderActions from "../../components/HeaderActions";
import { useCardState } from "@/app/hooks/useCardState";
import { usePersonState } from "@/app/hooks/usePersonState";
import { openCardPDF } from "@/app/libs/tauri-window";
import { saveFileLocal } from "@/app/libs/tauri-fs";
import { CardType } from "@/app/types/CardType";
import CardOptionPrintScreen from "../CardOptionPrint";

export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })
    const [openOption, setOpenOption] = useState<{ open: boolean }>({ open: false })
    const [cardSelected, setCardSelected] = useState<CardType>()

    const contentRef = useRef<HTMLDivElement>(null)

    const getAllCards = useCardState(state => state.getAllCards)
    const generatePersonCardFrontPVC = useCardState(state => state.generatePersonCardFrontPVC)
    const generatePersonCardBackPVC = useCardState(state => state.generatePersonCardBackPVC)
    const cards = useCardState(state => state.cards)
    const refresh = usePersonState(state => state.refresh)

    useEffect(() => {
        getAllCards()
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpen({ open: true })
    }

    async function handleOnPrintingCard(card: CardType) {
        setCardSelected(card)
        setOpenOption({ open: true })
    }

    async function onHandleToPrint(date: Date, cardSidePrint: string) {

        const dirPath = 'pdf'
        const extension = 'pdf'
        let pathUri: Uint8Array<ArrayBuffer>

        if (cardSelected) {
            cardSelected.expiration = date
            
            if (cardSidePrint === 'frontal') {
                pathUri = await generatePersonCardFrontPVC(cardSelected) 
            } else {
                pathUri = await generatePersonCardBackPVC() 
            }
            const filePath = await saveFileLocal(pathUri, cardSelected.cardNumber, dirPath, extension)
            await openCardPDF(filePath)
        }
    }

    return (
        <Stack>
            <HeaderActions
                onOpenAddPerson={handleOnOpenAddPerson}
            />

            <Stack
                p={4}
            >
                <Grid templateColumns="repeat(5, 1fr)" gap="6">
                    <For each={cards}>
                        {(card) => (
                            <CardId
                                key={card.cardNumber}
                                card={card}
                                onPrintCard={handleOnPrintingCard}
                            />
                        )}
                    </For>
                </Grid>

                <AddPersonModal
                    contentRef={contentRef}
                    open={open.open}
                    onOpenChange={setOpen}
                />

                <CardOptionPrintScreen
                    open={openOption.open}
                    onOpenChange={setOpenOption}
                    onHandleToPrint={onHandleToPrint}
                />
            </Stack>
        </Stack>
    )
}