import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import { VehicleCardType } from "@/app/types/VehicleCardType";
import { Card, Icon, Text } from "@chakra-ui/react";
import { VscPassFilled } from "react-icons/vsc";
import { convertformatDateAngolan } from "@/app/utils"


interface VehicleCardId {
    card: VehicleCardType 
    onClick?: () => void;
}

export default function VehicleCardId(props: VehicleCardId): JSX.Element {
    const {
        card,
    } = props

    const selectedCard = useVehicleCardState(state => state.selectedCard)
    const setSelectedCard = useVehicleCardState(state => state.setSelectedCard)
    const clearSelectedCard = useVehicleCardState(state => state.clearSelectedCard)

    function handleSelectCards() {
        if (selectedCard === card) {
            clearSelectedCard()
        } else {
            setSelectedCard(card)
        }
    }

    return (
        <Card.Root
            maxW="xs"
            overflow="hidden"
            onClick={handleSelectCards}
            p={2}
        >
            <Card.Body>
                {
                    selectedCard === card ?
                        <Icon
                            fontSize="2xl"
                            color="#607d8c"
                            pos={'absolute'}
                            top={2}
                            right={2}
                        >
                            <VscPassFilled />
                        </Icon> : null
                }
                <Card.Title>{card.vehicle.brand}</Card.Title>
                <Card.Description>
                    {card.vehicle.color?.toUpperCase()}
                </Card.Description>
                <Text textStyle="xl" fontWeight="medium" letterSpacing="tight" mt="2">
                    N: {card.cardNumber}
                </Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">
                    Matrícula: {card.vehicle.licensePlate}
                </Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">
                    Entidade: {card.vehicle.entity }
                </Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">
                    Validade: {convertformatDateAngolan(card.expiration)}
                </Text>
            </Card.Body>

        </Card.Root>

    )
}