import { useCardState } from "@/app/hooks/useCardState";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import { Box, HStack, Stack, Text, Icon, Spacer } from "@chakra-ui/react";
import { useEffect } from "react";
import { IoCarSport, IoPersonAdd } from "react-icons/io5";
import { PiPrinterLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { VscEdit } from "react-icons/vsc";

interface HeaderActions {
    onOpenAddVehicle: () => void;
    onOpenAddPerson: () => void
    onPrintCards: () => void
    onPrintSelectedCards: () => void
    onPrintSelectedVehicleCards: () => void
    onSetupNetwork: () => void

}

export default function HeaderActions(props: HeaderActions): JSX.Element {

    const {
        onOpenAddPerson,
        onOpenAddVehicle,
        onPrintSelectedCards,
        onPrintSelectedVehicleCards,
        onSetupNetwork,

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
                        cursor: 'pointer'
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
                        cursor: 'pointer'
                    }}
                    onClick={onOpenAddVehicle}
                    
                >
                    <Icon
                        fontSize="3xl"
                        color={'#607d8c'}
                    >
                        <IoCarSport />
                    </Icon>
                    <Text
                        fontSize={'small'}
                        fontWeight={'bold'}
                        color={'#607d8c'}
                    >
                        Viaturas
                    </Text>
                </Box>
                
                <Spacer />
                {
                    (selectedCard !== null || selectedVehicleCard !== null) &&
                        <Box
                            py={4}
                            px={4}
                            textAlign={'center'} 
                            _hover={{
                                bgColor: '#cbe5f2',
                                cursor: 'default'
                            }}
                            onClick={() => {
                                if (selectedCard) {
                                    onOpenAddPerson();
                                } else if (selectedVehicleCard) {
                                    onOpenAddVehicle();
                                }
                            }}
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
                        </Box>
                }
                
                {
                   (selectedCard !== null || selectedVehicleCard !== null) &&
                        <Box
                            py={4}
                            px={4}
                            textAlign={'center'}
                            _hover={{
                                bgColor: '#cbe5f2',
                                cursor: 'default'
                            }}
                            onClick={() => {
                                if (selectedCard) {
                                    onPrintSelectedCards();
                                } else if (selectedVehicleCard) {
                                    onPrintSelectedVehicleCards();
                                }
                            }}
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
                        </Box> 
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