"use client"
import { Stack, Grid, For, GridItem } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AddPersonModal from "./AddPerson";
import AddVehicleModal from "./AddVehicle";
import CardId from "../../components/CardId";
import VehicleCardId from "../../components/VehicleCardId";
import HeaderActions from "../../components/HeaderActions";
import { useCardState } from "@/app/hooks/useCardState";
import { usePersonState } from "@/app/hooks/usePersonState";
import { openCardPDF } from "@/app/libs/tauri-window";
import { saveFileLocal } from "@/app/libs/tauri-fs";
import CardOptionPrintScreen from "../CardOptionPrint";
import SetupScreen from "../SetupScreen";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";


export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })
    const [openPerson, setOpenPerson] = useState<{ open: boolean }>({ open: false })
    const [openVehicle, setOpenVehicle] = useState<{ open:boolean}>({open: false })
    const [openOption, setOpenOption] = useState<{ open: boolean }>({ open: false })
    const [openSetup, setOpenSetup] = useState<{ open: boolean }>({ open: false })

    const contentRef = useRef<HTMLDivElement>(null)

    const getAllCards = useCardState(state => state.getAllCards)
    /* const generateA4Cards = useCardState(state => state.generateA4Cards)
    const generateA4CardsBack = useCardState(state => state.generateA4CardsBack) */
    const generatePersonCardFrontPVC = useCardState(state => state.generatePersonCardFrontPVC)
    const generatePersonCardBackPVC = useCardState(state => state.generatePersonCardBackPVC)
    const generateVehicleCardFrontPVC = useVehicleCardState(state => state.generateVehicleCardFrontPVC)
    const clearSelectedCard = useCardState(state => state.clearSelectedCard)
    const cards = useCardState(state => state.cards)
    const vehicles = useVehicleCardState(state => state.cards)
    const selectedCard = useCardState(state => state.selectedCard)
    const selectedVehicleCard= useVehicleCardState(state => state.selectedVehicleCard)

    const refresh = usePersonState(state => state.refresh)

    const address = useSetupState(state => state.address)

    useEffect(() => {
        getAllCards(address)
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpenPerson({ open: true })
    }

    function handleOnOpenAddVehicle() {
        setOpenVehicle({ open: true })
    }

    async function handleOnPrintingCard() { 
        if (cards.length !== 0) {
            setOpenOption({ open: true })
        }
    }



    async function onHandleToPrint(cardSidePrint: string, cardType: string) {
        const dirPath = 'pdf'
        const extension = 'pdf'
        let pathUri: Uint8Array


        if (selectedCard) {
            if (cardSidePrint === 'frontal') {
                pathUri = await generatePersonCardFrontPVC(selectedCard, cardType === 'internal')
            } else {
                pathUri = await generatePersonCardBackPVC()
            }

            const filePath = await saveFileLocal(pathUri, 'cards', dirPath, extension)
            await openCardPDF(filePath)
            clearSelectedCard()
            setOpenOption({ open: false })
        }

        if(selectedVehicleCard) {
            if (cardSidePrint === 'frontal') {
                pathUri = await generateVehicleCardFrontPVC(selectedVehicleCard, cardType === 'internal')
            } 

            
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

    return (
        <Stack>
            <HeaderActions
                onOpenAddPerson={handleOnOpenAddPerson}
                onOpenAddVehicle={handleOnOpenAddVehicle}
                onPrintCards={handleOnPrintingCard}
                onPrintSelectedCards={handleOnPrintingCard}
                onSetupNetwork={handleoOnSetupNetwork}
                onUpdateCard={handleUpdateCard}
            />

            <Stack
                p={4}
            >
                <Grid templateColumns="1fr 1fr" gap="10px">
    
    <GridItem>
        <For each={cards}>
            {(card) => (
                <CardId key={card.cardNumber} card={card} />
            )}
        </For>
    </GridItem>

   
    <GridItem>
        <For each={vehicles}>
            {(vehicle) => (
                <VehicleCardId key={vehicle.cardNumber} card={vehicle} />
            )}
        </For>
    </GridItem>
</Grid>


                <AddPersonModal
                    contentRef={contentRef}
                    open={openPerson.open}
                    onOpenChange={setOpenPerson}
                />

                <AddVehicleModal
                    contentRef={contentRef}
                    open={openVehicle.open}
                    onOpenChange={setOpenVehicle}
                
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

