import { Flex, Input, VStack, Text } from "@chakra-ui/react"
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field"
import DialogModal from "../../components/DialogModal"
import SelectComponent from "../../components/SelectComponent"
import { useEffect, useState } from "react"
import { useSetupState } from "@/app/hooks/useSetupState"
import { useVehicleState } from "@/app/hooks/useVehicleState"
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState"
import { VehicleType } from "@/app/types/VehicleType"
import UUIDv4 from "@/app/libs/uuidv4"
import { VehicleCardType } from "@/app/types/VehicleCardType"



interface AddVehicleModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}
export function AddVehicleModal(props: AddVehicleModal): JSX.Element {

    const {
        open,
        contentRef,
        onOpenChange
    } = props


    const [loading, setLoading] = useState<boolean>(false)
    const [cardValidate, setCardValidate] = useState<string>('')
    const [message, setMessage] = useState<string>()


    const [entity, setEntity] = useState<string[]>([])
    const [vehicleType, setVehicleType] = useState<string[]>([])
    const [vehicleBrand, setVehicleBrand] = useState<string>('')
    const [vehicleColor, setVehicleColor] = useState<string>('')
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string>('')
    const [vehiclePermitType, setVehiclePermitType] = useState<string[]>([])



    const addVehicle = useVehicleState(state => state.addVehicle)
    const updateVehicle = useVehicleState(state => state.updateVehicle)
    const cards = useVehicleCardState(state => state.cards)
    const selectedCard = useVehicleCardState(state => state.selectedCard)
    const clearSelectedCard = useVehicleCardState(state => state.clearSelectedCard)

    const personEntities = useSetupState(state => state.personEntities)
    const address = useSetupState(state => state.address)

    useEffect(() => {
        if (selectedCard) {
            setVehicleBrand(selectedCard.vehicle.brand)
            setVehicleColor(selectedCard.vehicle.color)
            setVehicleLicensePlate(selectedCard.vehicle.licensePlate)
            setVehicleType([selectedCard.vehicle.type])
            setVehiclePermitType([selectedCard.permitType])
            setCardValidate(selectedCard.expiration.toISOString().split('T')[0])

        }
    }, [selectedCard])

    useEffect(() => {
        if (!open) {
            clearSelectedCard();
            setVehicleBrand('');
            setVehicleColor('');
            setVehicleLicensePlate('');
            setVehicleType([]);
            setVehiclePermitType([]);
            setCardValidate('');
        }
    }, [open])

    async function handleAddVehicle() {
        try {
            setLoading(true)
            const vehicle: VehicleType = {
                id: UUIDv4.generateId(),
                brand: vehicleBrand,
                color: vehicleColor,
                licensePlate: vehicleLicensePlate,
                type: vehicleType[0],
                entity: entity[0]
            }

            const valid = new Date(cardValidate)

            await addVehicle(vehicle, valid, address, cards)
                .catch(() => {
                    setLoading(false)
                })

            setLoading(false)
            setEntity([])
            setMessage("")
            onOpenChange({ open: false })
            setVehicleBrand('');
            setVehicleColor('');
            setVehicleLicensePlate('');
            setVehicleType([]);
            setVehiclePermitType([]);
            setCardValidate('');

        } catch (error) {
            setLoading(false);
            setMessage("")
        }
    }

    async function handleUpdateVehicle() {
        try {
            setLoading(true)
            const vehicle: VehicleType = {
                id: selectedCard?.vehicle.id ?? '',
                brand: vehicleBrand,
                color: vehicleColor,
                licensePlate: vehicleLicensePlate,
                type: vehicleType[0],
                entity: entity[0]
            }

            const valid = new Date(cardValidate)

            const card: VehicleCardType = {
                vehicle,
                expiration: valid,
                cardNumber: selectedCard?.cardNumber ?? '',
                permitType: selectedCard?.permitType ?? ''
            }

            await updateVehicle(vehicle, address, card)
            setLoading(false)
            setMessage("")
            setEntity([])
            setVehicleBrand("")
            setVehicleColor("")
            setVehicleLicensePlate("")
            setVehicleType([])
            clearSelectedCard()
            setVehiclePermitType([]);
            onOpenChange({ open: false })
        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <DialogModal
            title="Cadastro de veículo"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                selectedCard ?
                    <Button
                        onClick={handleUpdateVehicle}
                        loading={loading}
                    >
                        Actualizar
                    </Button>
                    :
                    <Button
                        onClick={handleAddVehicle}
                        loading={loading}
                    >
                        Cadastrar
                    </Button>
            }
        >
            <VStack gap={4}>
                <Flex
                    w='100%'
                    flexDir={'column'}
                    align='center'
                    justify='center'
                    justifyContent={'center'}
                >
                    <Text fontSize={'smaller'} fontWeight={'bold'} color={'red'}>{message}</Text>
                </Flex>
                <Field
                    label="Marca"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a marca do veículo"
                        onChange={e => setVehicleBrand(e.target.value)}
                        value={vehicleBrand}
                    />
                </Field>
                <Field
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Entidade"
                        placeholder="Seleccione a entidade"
                        selectedValue={entity}
                        onValueChange={setEntity}
                        data={personEntities}
                    />
                </Field>
                <Field errorText="Este campo é obrigatório">
                    <SelectComponent
                        portalRef={contentRef}
                        label="Tipo"
                        placeholder="Seleccione o tipo de veículo"
                        selectedValue={vehicleType}
                        onValueChange={setVehicleType}
                        data={[
                            { label: "Carro", value: "Carro" },
                            { label: "Motorizada", value: "Motorizada" }
                        ]}
                    />
                </Field>
                <Field errorText="Este campo é obrigatório">
                    <SelectComponent
                        portalRef={contentRef}
                        label="Tipo de Cartão"
                        placeholder="Seleccione o tipo de cartão"
                        selectedValue={vehiclePermitType}
                        onValueChange={setVehiclePermitType}
                        data={[
                            { label: "Permanente", value: "Permanente" },
                            { label: "Temporâreo", value: "Temporâreo" }
                        ]}
                    />
                </Field>

                <Field
                    label="Cor"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a cor do veículo"
                        onChange={e => setVehicleColor(e.target.value)}
                        value={vehicleColor}
                    />
                </Field>
                <Field
                    label="Matrícula"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a matrícula do veículo"
                        onChange={e => setVehicleLicensePlate(e.target.value)}
                        value={vehicleLicensePlate}
                    />
                </Field>
                <Field label="Validade do cartão">
                    <Input
                        type="date"
                        value={cardValidate}
                        onChange={e => setCardValidate(e.target.value)}
                        min={"2025-01-01"}
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}


