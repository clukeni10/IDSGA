"use client"
import { Stack, Grid, For, Tabs } from "@chakra-ui/react";
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
import { AddVehicleModal } from "./AddVehicle";
import { FaRegIdBadge, FaRegIdCard } from "react-icons/fa";
import { IoCarSport } from "react-icons/io5";
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import VehicleCardId from "../../components/VehicleCardId";


export default function HomeScreen(): JSX.Element {

    const [open, setOpen] = useState<{ open: boolean }>({ open: false })
    const [openVehicle, setOpenVehicle] = useState<{ open: boolean }>({ open: false })
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

    const generateVehicleCardFrontPVC = useVehicleCardState(state => state.generateVehicleCardFrontPVC)
    const generateVehicleCardBackPVC = useVehicleCardState(state => state.generateVehicleCardBackPVC)
    const getAllVehicleCards = useVehicleCardState(state => state.getAllCards)
    const vehicleCards = useVehicleCardState(state => state.cards)
    const selectedVehicleCard = useVehicleCardState(state => state.selectedCard)
    const clearSelectedVehicleCard = useVehicleCardState(state => state.clearSelectedCard)

    const refresh = usePersonState(state => state.refresh)

    const address = useSetupState(state => state.address)

    useEffect(() => {
        getAllCards(address)
        getAllVehicleCards(address)
    }, [refresh])

    function handleOnOpenAddPerson() {
        setOpen({ open: true })
    }

    function handleOnOpenAddVehicle() {
        setOpenVehicle({ open: true })
    }


    async function handleOnPrintingCard() {
        if (cards.length !== 0) {
            setOpenOption({ open: true })
        }
    }

    async function handleOnPrintingVehicleCard() {
        if (cards.length !== 0) {
            setOpenOption({ open: true })
        }
    }

    async function onHandleToPrint(cardSidePrint: string, cardType: string) {
        let pathUri: Uint8Array


        if (selectedCard) {
            if (cardSidePrint === 'frontal') {
                pathUri = await generatePersonCardFrontPVC(selectedCard, cardType === 'internal')
            } else {
                pathUri = await generatePersonCardBackPVC()
            }

            const filePath = await saveFileLocal(pathUri, 'cards', 'pdf', 'pdf');

            if (!filePath) {
                console.error("❌ Erro: Caminho do arquivo não gerado corretamente.");
                return;
            }

            await openCardPDF(filePath, {
                name: selectedCard.person.name, 
                personFunction: selectedCard.person.job,
                cardNumber: selectedCard.cardNumber, 
                cardValidate: selectedCard.expiration,
                acessType: selectedCard.person.accessType

            });

            clearSelectedCard()
            setOpenOption({ open: false })
        }

        if (selectedVehicleCard) {
            if (cardSidePrint === 'frontal') {
                pathUri = await generateVehicleCardFrontPVC(selectedVehicleCard, cardType === 'internal')
            } else {
                pathUri = await generateVehicleCardBackPVC()
            }


            const filePath = await saveFileLocal(pathUri, 'cards', 'pdf', 'pdf');

            if (!filePath) {
                console.error("❌ Erro: Caminho do arquivo não gerado corretamente.");
                return;
            }

            console.log(`📂 Arquivo salvo: ${filePath}`);

          //  await openCardPDF(filePath); // ✅ Passa o caminho correto para a função!


           
            clearSelectedVehicleCard()
            setOpenVehicle
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

    function handleUpdateVehicleCard() {
        setOpenVehicle({ open: true })
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
                onPrintVehicleCards={handleOnPrintingVehicleCard}
                onPrintSelectedCards={handleOnPrintingCard}
                onSetupNetwork={handleoOnSetupNetwork}
                onUpdateCard={handleUpdateCard}
                onUpdateVehicleCard={handleUpdateVehicleCard}
            />

            <Stack
                p={4}
            >
                <Tabs.Root defaultValue="Pessoal">
                    <Tabs.List>
                        <Tabs.Trigger value="Pessoal">
                            <FaRegIdBadge />
                            Pessoal

                        </Tabs.Trigger>
                        <Tabs.Trigger value="Veículos">
                            <IoCarSport />
                            Veículos
                        </Tabs.Trigger>
                        <Tabs.Trigger value="Licenças">
                            <FaRegIdCard />
                            Licenças
                        </Tabs.Trigger>

                    </Tabs.List>
                    <Tabs.Content value="Pessoal">
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
                    </Tabs.Content>
                    <Tabs.Content value="Veículos">
                        <Grid templateColumns="repeat(5, 1fr)" gap="6">
                            <For each={vehicleCards}>
                                {(card) => (
                                    <VehicleCardId
                                        key={card.cardNumber}
                                        card={card}
                                    />
                                )}
                            </For>
                        </Grid>
                    </Tabs.Content>
                    <Tabs.Content value="Licenças"></Tabs.Content>

                </Tabs.Root>

                <AddPersonModal
                    contentRef={contentRef}
                    open={open.open}
                    onOpenChange={setOpen}
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