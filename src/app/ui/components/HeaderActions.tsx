import { useCardState } from "@/app/hooks/useCardState";
import { useSetupState } from "@/app/hooks/useSetupState";
import { Box, HStack, Stack, Text, Icon, Spacer } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { PiPrinterLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { VscEdit } from "react-icons/vsc";

interface HeaderActions {
    onOpenAddPerson: () => void
    onPrintCards: () => void
    onPrintSelectedCards: () => void
    onSetupNetwork: () => void
    onUpdateCard: () => void
}

export default function HeaderActions(props: HeaderActions): JSX.Element {

    const {
        onOpenAddPerson,
        onPrintSelectedCards,
        onSetupNetwork,
        onUpdateCard
    } = props;

    const getPersonFunction = useSetupState(state => state.getPersonFunction)
    const getPersonEscort = useSetupState(state => state.getPersonEscort)
    const getPersonEntity = useSetupState(state => state.getPersonEntity)

    const selectedCard = useCardState(state => state.selectedCard)

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
                <Spacer />
                {
                    selectedCard !== null ?
                        <Box
                            py={4}
                            px={4}
                            textAlign={'center'}
                            _hover={{
                                bgColor: '#cbe5f2',
                                cursor: 'default'
                            }}
                            onClick={onUpdateCard}
                        >
                            <Icon
                                fontSize="2xl"
                                color={'#607d8c'}
                            >
                                <VscEdit />
                            </Icon>
                            <Text
                                fontSize={'small'}
                                fontWeight={'bold'}
                                color={'#607d8c'}
                            >
                                Editar cartão
                            </Text>
                        </Box> : null
                }
                {
                    selectedCard !== null ?
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
                                Imprimir seleccionado(s)
                            </Text>
                        </Box> : null
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