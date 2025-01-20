import { useCardState } from "@/app/hooks/useCardState";
import { CardType } from "@/app/types/CardType"
import { convertformatDateAngolan } from "@/app/utils"
import { Card, Text, IconButton } from "@chakra-ui/react"
//import { VscPassFilled } from "react-icons/vsc";
import { IoMdPrint } from "react-icons/io";
import { APPCOLOR } from "@/app/utils/constants";

interface CardId {
    card: CardType
    handleOnPrintingCard(): Promise<void>
}

export default function CardId(props: CardId): JSX.Element {

    const { card, handleOnPrintingCard } = props

    //const selectedCards = useCardState(state => state.selectedCards)
    const setSelectedCard = useCardState(state => state.setSelectedCard)


    function handleSelectCards() {
        setSelectedCard(card)
        handleOnPrintingCard()
    }

    return (
        <Card.Root
            maxW="xs"
            overflow="hidden"
            onClick={handleSelectCards}
        >
            <Card.Body
                position={"relative"}
            >
                {/* {
                    selectedCards.includes(card) ?
                        <Icon
                            fontSize="2xl"
                            color="#607d8c"
                            pos={'absolute'}
                            top={2}
                            right={2}
                        >
                            <VscPassFilled />
                        </Icon> : null
                } */}
                <Card.Title>{card.person.name}</Card.Title>
                <Card.Description>
                    {card.person.job?.toUpperCase()}
                </Card.Description>
                <Text textStyle="xl" fontWeight="medium" letterSpacing="tight" mt="2">
                    N: {card.cardNumber}
                </Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">
                    Entidade: {card.person.entity ?? 'SGA-SA'}
                </Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">
                    Validade: {convertformatDateAngolan(card.expiration)}
                </Text>
                <IconButton
                    style={{ cursor: 'pointer', }}
                    title='Imprimir'
                    position={"absolute"}
                    right={2}
                    bg={APPCOLOR}
                >
                    <IoMdPrint color="#000"/>
                </IconButton>
            </Card.Body>
        </Card.Root>

    )
}