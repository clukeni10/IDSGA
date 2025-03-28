import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import { VehicleCardType } from "@/app/types/VehicleCardType";
import { convertformatDateAngolan } from "@/app/utils";
import { Card, Icon, Text } from "@chakra-ui/react";
import { VscPassFilled } from "react-icons/vsc";

interface VehicleCardId {
    card: VehicleCardType
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

                <Card.Title>{card?.vehicle?.brand ?? "Sem marca"}</Card.Title>
                <Card.Description>{card?.vehicle?.color ?? "Sem cor"}</Card.Description>
                <Text textStyle="xl" fontWeight="medium" letterSpacing="tight" mt="2">N: {card?.cardNumber ?? "Sem número"}</Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">Entidade: {card?.vehicle?.entity ?? "Sem entidade"}</Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">Matrícula: {card?.vehicle?.licensePlate ?? "Sem matrícula"}</Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">Tipo de Cartão: {card?.permitType ?? "Sem tipo"}</Text>
                <Text textStyle="xs" fontWeight="medium" letterSpacing="tight" mt="2">Validade: {card?.expiration ? convertformatDateAngolan(card.expiration) : "Sem validade"}</Text>

            </Card.Body>

        </Card.Root>
    )
}