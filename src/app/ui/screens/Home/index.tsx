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
import CardOptionPrintScreen from "../CardOptionPrint";

export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })
    const [openOption, setOpenOption] = useState<{ open: boolean }>({ open: false })

    const contentRef = useRef<HTMLDivElement>(null)

    const getAllCards = useCardState(state => state.getAllCards)
    const generateA4Cards = useCardState(state => state.generateA4Cards)
    const generateA4CardsBack = useCardState(state => state.generateA4CardsBack)
    const cards = useCardState(state => state.cards)
    const refresh = usePersonState(state => state.refresh)

    useEffect(() => {
        getAllCards()
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpen({ open: true })
    }

    async function handleOnPrintingCard() {
        setOpenOption({ open: true })
    }

    async function onHandleToPrint(date: Date, cardSidePrint: string) {

        const dirPath = 'pdf'
        const extension = 'pdf'
        let pathUri: Uint8Array<ArrayBuffer>

        cards.map((card) => card.expiration = date)

        if (cardSidePrint === 'frontal') {
            pathUri = await generateA4Cards(cards)
        } else {
            pathUri = await generateA4CardsBack(cards)
        }
        const filePath = await saveFileLocal(pathUri, 'cards', dirPath, extension)
        await openCardPDF(filePath)
    }

    return (
        <Stack>
            <HeaderActions
                onOpenAddPerson={handleOnOpenAddPerson}
                onPrintCards={handleOnPrintingCard}
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