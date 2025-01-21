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
import SetupScreen from "../SetupScreen";
import { useSetupState } from "@/app/hooks/useSetupState";


export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })
    const [openOption, setOpenOption] = useState<{ open: boolean }>({ open: false })
    const [openSetup, setOpenSetup] = useState<{ open: boolean }>({ open: false })

    const contentRef = useRef<HTMLDivElement>(null)

    const getAllCards = useCardState(state => state.getAllCards)
    /* const generateA4Cards = useCardState(state => state.generateA4Cards)
    const generateA4CardsBack = useCardState(state => state.generateA4CardsBack) */
    const generatePersonCardFrontPVC = useCardState(state => state.generatePersonCardFrontPVC)
    const generatePersonCardBackPVC = useCardState(state => state.generatePersonCardBackPVC)
    const clearSelectedCard = useCardState(state => state.clearSelectedCard)
    const cards = useCardState(state => state.cards)
    const selectedCard = useCardState(state => state.selectedCard)

    const refresh = usePersonState(state => state.refresh)

    const address = useSetupState(state => state.address)

    useEffect(() => {
        getAllCards(address)
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpen({ open: true })
    }

    async function handleOnPrintingCard() {
        if (cards.length !== 0) {
            setOpenOption({ open: true })
        }
    }

    async function onHandleToPrint(cardSidePrint: string) {
        const dirPath = 'pdf'
        const extension = 'pdf'
        let pathUri: Uint8Array


        if (selectedCard) {
            if (cardSidePrint === 'frontal') {
                pathUri = await generatePersonCardFrontPVC(selectedCard)
                console.log(pathUri)
            } else {
                pathUri = await generatePersonCardBackPVC()
            }

            const filePath = await saveFileLocal(pathUri, 'cards', dirPath, extension)
            await openCardPDF(filePath)
            clearSelectedCard()
            setOpenOption({ open: false })
        }



        /* if (cardSidePrint === 'frontal') {
            if (selectedCards.length !== 0) {
                pathUri = await generateA4Cards(selectedCards)
            } else {
                pathUri = await generateA4Cards(cards)
            }
        } else {
            if (selectedCards.length !== 0) {
                pathUri = await generateA4CardsBack(selectedCards)
            } else {
                pathUri = await generateA4CardsBack(cards)
            }
        } */

    }

    function handleUpdateCard() {
        setOpen({ open: true })
    }

    function handleoOnSetupNetwork() {
        setOpenSetup({ open: true })
    }


    console.log(selectedCard);
    

    return (
        <Stack>
            <HeaderActions
                onOpenAddPerson={handleOnOpenAddPerson}
                onPrintCards={handleOnPrintingCard}
                onPrintSelectedCards={handleOnPrintingCard}
                onSetupNetwork={handleoOnSetupNetwork}
                onUpdateCard={handleUpdateCard}
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

                <SetupScreen
                    open={openSetup.open}
                    onOpenChange={setOpenSetup}
                />
            </Stack>
        </Stack>
    )
}