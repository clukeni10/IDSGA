"use client"
import { Stack,  For, Tabs, Flex } from "@chakra-ui/react";
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
import { IoCarSport,  } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";



export default function HomeScreen(): JSX.Element {

   
    const [openPerson, setOpenPerson] = useState<{ open: boolean }>({ open: false })
    const [openVehicle, setOpenVehicle] = useState<{ open: boolean }>({ open: false })
    const [openOption, setOpenOption] = useState<{ open: boolean }>({ open: false })
    const [openSetup, setOpenSetup] = useState<{ open: boolean }>({ open: false })

    const contentRef = useRef<HTMLDivElement>(null)

    /* const generateA4Cards = useCardState(state => state.generateA4Cards)
    const generateA4CardsBack = useCardState(state => state.generateA4CardsBack) */
    const getAllCards = useCardState(state => state.getAllCards)
    const getAllVehicleCards= useVehicleCardState(state => state.getAllCards)
    
    const generatePersonCardFrontPVC = useCardState(state => state.generatePersonCardFrontPVC)
    const generatePersonCardBackPVC = useCardState(state => state.generatePersonCardBackPVC)
    const clearSelectedCard = useCardState(state => state.clearSelectedCard)
    const cards = useCardState(state => state.cards)
    const vehiclesCards = useVehicleCardState(state => state.cards)
    const selectedCard = useCardState(state => state.selectedCard)


    const refresh = usePersonState(state => state.refresh)

    const address = useSetupState(state => state.address)

    useEffect(() => {
        getAllCards(address)
        getAllVehicleCards(address)
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

    async function handleOnPrintingVehicleCard(){
        if(vehiclesCards.length !== 0) {
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

    }

    
    

   

    

    function handleoOnSetupNetwork() {
        setOpenSetup({ open: true })
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

    

   

    return (
        <Stack>
            <HeaderActions
                onOpenAddPerson={handleOnOpenAddPerson}
                onOpenAddVehicle={handleOnOpenAddVehicle}
                onPrintCards={handleOnPrintingCard}
                onPrintSelectedCards={handleOnPrintingCard}
                onPrintSelectedVehicleCards={handleOnPrintingVehicleCard}
                onSetupNetwork={handleoOnSetupNetwork}
                
                
            />

            
                <Tabs.Root defaultValue="users" p={6} >
                    <Tabs.List >
                        <Tabs.Trigger value="users" >
                            <HiUsers color={'#607d8c'} />
                        </Tabs.Trigger>
                    
                    
                        <Tabs.Trigger value="vehicles">
                            <IoCarSport color={'#607d8c'}/>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="users">
                        <Flex  gap={10} wrap="wrap">
                        <For each={cards}>
                            {(card) => (
                                <CardId key={card.cardNumber} card={card} />
                            )}
                        </For>
                        </Flex>
                    

                    </Tabs.Content>
                    <Tabs.Content value="vehicles">
                        <Flex  gap={10} wrap="wrap">
                        <For each={vehiclesCards}>
                            {(vehicleCard) => (
                                <VehicleCardId key={vehicleCard.cardNumber} card={vehicleCard} />
                            )}
                        </For>
                        </Flex>

                    </Tabs.Content>
                    
                    

                </Tabs.Root>

               


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
        
    )
}

