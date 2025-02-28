import { Flex, VStack, Input, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import DialogModal from "../../components/DialogModal";
import { Field } from "@/components/ui/field";
import SelectComponent from "../../components/SelectComponent";
import { useSetupState } from "@/app/hooks/useSetupState";
import { VehicleType } from "@/app/types/VehicleType";
import UUIDv4 from "@/app/libs/uuidv4";
import { useEffect, useState } from "react";
import { useVehicleCardState } from "@/app/hooks/useVehicleCardState";
import { useVehicleState } from "@/app/hooks/useVehicleState";
import { VehicleCardType } from "@/app/types/VehicleCardType";



interface AddVehicleModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}

export default function AddVehicleModal(props: AddVehicleModal): JSX.Element {

    const {
        open,
        contentRef,
        onOpenChange
    } = props


    //const addVehicle = useVehicleState(state => state.addVehicle)
    const [message, setMessage] = useState<string>()
    const [option, setOption] = useState<string[]>([]);
    const personEntities = useSetupState(state => state.personEntities)
    const [entity, setEntity] = useState<string[]>([])
    const [cardValidate, setCardValidate] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const cards = useVehicleCardState(state => state.cards)
    const selectedVehicleCard = useVehicleCardState(state => state.selectedVehicleCard)
    const clearSelectedVehicleCard = useVehicleCardState(state => state.clearSelectedVehicleCard)
    const addVehicle = useVehicleState(state => state.addVehicle)
    const updateVehicle = useVehicleState(state => state.updateVehicle)
    const address = useSetupState(state => state.address)



    const [vehicleBrand, setVehicleBrand] = useState<string>("")
    const [vehicleType, setVehicleType] = useState<string>('')
    const [vehicleColor, setVehicleColor] = useState<string>('')
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string>('')



    useEffect(() => {

        if (selectedVehicleCard) {
            setVehicleBrand(selectedVehicleCard.vehicle.brand)
            setVehicleType(selectedVehicleCard.vehicle.type)
            setVehicleColor(selectedVehicleCard.vehicle.color)
            setEntity([selectedVehicleCard.vehicle.entity]); // Envia um array contendo a string
            setVehicleLicensePlate(selectedVehicleCard.vehicle.licensePlate)
            setCardValidate(selectedVehicleCard.expiration.toISOString().
                split('T')[0])
        }
    }, [selectedVehicleCard])

    useEffect(() => {
        if (!open) {
            clearSelectedVehicleCard();
            setVehicleBrand('');
            setCardValidate('');
            setEntity([]);
            setVehicleColor('');
            setVehicleType('');
            setVehicleLicensePlate('');
        }

    }, [open])

    async function handleAddVehicle() {
        try {
            setLoading(true)
            const vehicle: VehicleType = {
                brand: vehicleBrand.trim(),
                entity: entity[0],
                type: vehicleType[0],
                id: UUIDv4.generateId(),
                color: vehicleColor.trim(),
                licensePlate: vehicleLicensePlate.trim(),
            }

            const valid = new Date(cardValidate)

            if (entity) {
                await addVehicle(vehicle, valid, address ?? '', Array.isArray(cards) ? cards : [cards])
                    .catch(() => {
                        setLoading(false)
                    })

                setLoading(false);
                setEntity([]);
                onOpenChange({ open: false });
                setVehicleBrand('');
                setVehicleColor('');
                setVehicleLicensePlate('');
                setVehicleType('');
            }
        } catch (error) {
            setLoading(false);
            setMessage("")
        }
    }

    async function handleUpdateVehicle() {
        try {
            setLoading(true)
            const vehicle: VehicleType = {
                id: selectedVehicleCard?.vehicle?.id ?? '',
                brand: selectedVehicleCard?.vehicle?.brand ?? '',
                type: selectedVehicleCard?.vehicle?.type ?? '',
                color: selectedVehicleCard?.vehicle?.color ?? '',
                licensePlate: selectedVehicleCard?.vehicle?.licensePlate ?? '',
                entity: ""
            }

            const valid = new Date(cardValidate)

            const card: VehicleCardType = {
                vehicle,
                entity: "",
                expiration: valid,
                cardNumber: selectedVehicleCard?.cardNumber ?? ''
            }

            await updateVehicle(vehicle, entity[0], card)
            setLoading(false)
            setEntity([]);
            onOpenChange({ open: false });
            setVehicleBrand('');
            setVehicleColor('');
            setVehicleLicensePlate('');
            setVehicleType('');
            onOpenChange({ open: false })




        }     catch (error) {
            setLoading(false)

        }
               
}


return (
    <DialogModal
        title="Cadastro de Veículos"
        open={open}
        onOpenChange={onOpenChange}
        footer={
            selectedVehicleCard ?

            <Button
                onClick={handleUpdateVehicle }
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
                w="100%"
                flexDir={'column'}
                align='center'
                justify='center'
                justifyContent={'center'}
            >


            </Flex>
            <Text fontSize={'smaller'} fontWeight={'bold'} color={'red'}>{message}</Text>
            <Field
                label="Marca"
                errorText="Este campo é obrigatório"
            >
                <Input
                    placeholder="Digite o nome da marca do veículo"
                />
            </Field>
            <Field

                errorText="Este campo é obrigatório"
            >
                <SelectComponent
                    portalRef={contentRef}
                    label="Tipo de Veículo"
                    placeholder="Seleccione o tipo de veículo"
                    selectedValue={option}
                    onValueChange={setOption}
                    data={[

                        { label: "Carro", value: "carro" },
                        { label: "Motorizada", value: "motorizada" }
                    ]}
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
            <Field
                label="Matrícula do veículo"
                errorText="Este campo é obrigatório"
            >
                <Input
                    placeholder="Digite o nº da matrícula do veículo"
                />


            </Field>
            <Field
                label="Digite a cor do veículo"
                errorText="Este campo é obrigatório"
            >
                <Input
                    placeholder="Digite a cor do veículo"
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