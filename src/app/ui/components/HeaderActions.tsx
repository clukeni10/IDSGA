import { Box, HStack, Stack, Text, Icon, Spacer } from "@chakra-ui/react";
import { IoPersonAdd } from "react-icons/io5";
import { PiPrinterLight } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";


interface HeaderActions {
    onOpenAddPerson: () => void
    onPrintCards: () => void
    onSetupNetwork: () => void
}

export default function HeaderActions(props: HeaderActions): JSX.Element {

    const {
        onOpenAddPerson,
        onPrintCards,
        onSetupNetwork
    } = props;

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
                <Box
                    py={4}

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
                        Imprimir
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