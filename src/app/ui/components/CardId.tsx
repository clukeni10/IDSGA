import { CardType } from "@/app/types/CardType"
import { Button, Card, Text } from "@chakra-ui/react"

interface CardId {
    card: CardType
    onPrintCard: (cardId: string) => void
}

export default function CardId(props: CardId): JSX.Element {

    const {
        card,
        onPrintCard
    } = props

    function handlePrintCard() {
        onPrintCard(card.cardNumber)
    }

    return (
        <Card.Root maxW="xs" overflow="hidden">
            {/* <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Green double couch with wooden legs"
            /> */}
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
                {/* <Button variant="ghost">Apagar</Button> */}
            </Card.Footer>
        </Card.Root>

    )
}