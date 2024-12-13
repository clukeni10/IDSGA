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

export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })

    const contentRef = useRef<HTMLDivElement>(null)

    const getAllCards = useCardState(state => state.getAllCards)
    const generatePersonCardPVC = useCardState(state => state.generatePersonCardPVC)
    const cards = useCardState(state => state.cards)
    const refresh = usePersonState(state => state.refresh)

    useEffect(() => {
        getAllCards()
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpen({ open: true })
    }

    async function handleOnPrintingCard(cardId: string) {
        const pathUri = await generatePersonCardPVC()
        const dirPath = 'pdf'
        const extension = 'pdf'
        const filePath = await saveFileLocal(pathUri, cardId, dirPath, extension)
        await openCardPDF(filePath)
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
            </Stack>
        </Stack>
    )
}