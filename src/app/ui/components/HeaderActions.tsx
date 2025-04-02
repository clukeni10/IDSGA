import { useCardState } from "@/app/hooks/useCardState";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import { Box, HStack, Stack, Text, Icon, Spacer } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaRegIdCard } from "react-icons/fa";
import { IoCarSport, IoPersonAdd } from "react-icons/io5";
import { PiPrinterLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { VscEdit } from "react-icons/vsc";

interface HeaderActions {
    onOpenAddPerson: () => void
    onOpenAddVehicle: () => void
    onOpenAddLicense: () => void
    onPrintCards: () => void
    onPrintVehicleCards: () => void
    onPrintSelectedCards: () => void
    onSetupNetwork: () => void
    onUpdateCard: () => void
    onUpdateVehicleCard: () => void
}

export default function HeaderActions(props: HeaderActions): JSX.Element {

    const {
        onOpenAddPerson,
        onOpenAddVehicle,
        onOpenAddLicense,
        onPrintSelectedCards,
        onSetupNetwork,
        onUpdateCard,
        onUpdateVehicleCard
    } = props;

    const getPersonFunction = useSetupState(state => state.getPersonFunction)
    const getPersonEscort = useSetupState(state => state.getPersonEscort)
    const getPersonEntity = useSetupState(state => state.getPersonEntity)

    const selectedCard = useCardState(state => state.selectedCard)
    const selectedVehicleCard = useVehicleCardState(state => state.selectedCard)

    useEffect(() => {
        getPersonFunction()
        getPersonEscort()
        getPersonEntity()
    }, [])


    return (
        <Stack
            bgColor={'#D2ECFA'}
        >
            <HStack>
                <Box
                    py={4}
                    px={8}
                    textAlign={'center'}
                    _hover={{
                        bgColor: '#cbe5f2',
                        cursor: 'default'
                    }}
                    onClick={onOpenAddPerson}
                >
                    <Icon
                        fontSize="2xl"
                        color={'#607d8c'}
                    >
                        <IoPersonAdd />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Pessoal
                    </Text>
                </Box>
                <Box
                    py={4}
                    px={8}
                    textAlign={'center'}
                    _hover={{
                        bgColor: '#cbe5f2',
                        cursor: 'default'
                    }}
                    onClick={onOpenAddVehicle}
                >
                    <Icon
                        fontSize="2xl"
                        color={'#607d8c'}
                    >
                        <IoCarSport />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Veículos
                    </Text>
                </Box>
                <Box
                    py={4}
                    px={8}
                    textAlign={'center'}
                    _hover={{
                        bgColor: '#cbe5f2',
                        cursor: 'default'
                    }}
                    onClick={onOpenAddLicense}
                >
                    <Icon
                        fontSize="2xl"
                        color={'#607d8c'}
                    >
                        <FaRegIdCard />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Licenças
                    </Text>
                </Box>
                <Spacer />
                {
                    (selectedCard !== null || selectedVehicleCard !== null) && (
                        <>
                            <Box
                                py={4}
                                px={4}
                                textAlign={'center'}
                                _hover={{
                                    bgColor: '#cbe5f2',
                                    cursor: 'default'
                                }}
                                onClick={selectedVehicleCard ? onUpdateVehicleCard : onUpdateCard}
                            >
                                <Icon fontSize="2xl" color={'#607d8c'}>
                                    <VscEdit />
                                </Icon>
                                <Text fontSize={'small'} fontWeight={'bold'} color={'#607d8c'}>
                                    Editar cartão
                                </Text>
                            </Box>

                            <Box
                                py={4}
                                px={4}
                                textAlign={'center'}
                                _hover={{
                                    bgColor: '#cbe5f2',
                                    cursor: 'default'
                                }}
                                onClick={onPrintSelectedCards}
                            >
                                <Icon fontSize="2xl" color={'#607d8c'}>
                                    <PiPrinterLight />
                                </Icon>
                                <Text fontSize={'small'} fontWeight={'bold'} color={'#607d8c'}>
                                    Imprimir seleccionado(s)
                                </Text>
                            </Box>
                        </>
                    )
                }


                {/*  <Box
                    py={4}
                    px={4}
                    textAlign={'center'}
                    _hover={{
                        bgColor: '#cbe5f2',
                        cursor: 'default'
                    }}
                    onClick={onPrintCards}
                >
                    <Icon
                        fontSize="2xl"
                        color={'#607d8c'}
                    >
                        <PiPrinterLight />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Imprimir Todos
                    </Text>
                </Box> */}
                <Box
                    py={4}
                    px={8}
                    textAlign={'center'}
                    _hover={{
                        bgColor: '#cbe5f2',
                        cursor: 'default'
                    }}
                    onClick={onSetupNetwork}
                >
                    <Icon
                        fontSize="2xl"
                        color={'#607d8c'}
                    >
                        <VscSettings />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Configuração
                    </Text>
                </Box>
            </HStack>
        </Stack>
    )
}