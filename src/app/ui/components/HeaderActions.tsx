import { Box, HStack, Stack, Text, Icon } from "@chakra-ui/react";
import { IoPersonAdd } from "react-icons/io5";

interface HeaderActions {
    onOpenAddPerson: () => void
}

export default function HeaderActions(props: HeaderActions): JSX.Element {

    const {
        onOpenAddPerson
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
            </HStack>
        </Stack>
    )
}