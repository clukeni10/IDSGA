import { CardType } from "@/app/types/CardType"
import { Card, Text } from "@chakra-ui/react"

interface CardId {
    card: CardType
}

export default function CardId(props: CardId): JSX.Element {

    const {
        card,
    } = props

    return (
        <Card.Root maxW="xs" overflow="hidden">
            <Card.Body>
                <Card.Title>{card.person.name}</Card.Title>
                <Card.Description>
                    {card.person.job.toUpperCase()}
                </Card.Description>
                <Text textStyle="xl" fontWeight="medium" letterSpacing="tight" mt="2">
                    N: {card.cardNumber}
                </Text>
            </Card.Body>
        </Card.Root>

    )
}