import { CardType } from "@/app/types/CardType"
import { Button, Card, Text } from "@chakra-ui/react"

interface CardId {
    card: CardType
    onPrintCard: (card: CardType) => void
}

export default function CardId(props: CardId): JSX.Element {

    const {
        card,
        onPrintCard
    } = props

    function handlePrintCard() {
        onPrintCard(card)
    }

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
            <Card.Footer gap="2">
                <Button
                    variant="solid"
                    onClick={handlePrintCard}
                >
                    Imprimir
                </Button>
            </Card.Footer>
        </Card.Root>

    )
}