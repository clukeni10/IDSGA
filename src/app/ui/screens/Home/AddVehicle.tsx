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
    selectedVehicleCard?: VehicleCardType
}

export default function AddVehicleModal(props: AddVehicleModal): JSX.Element {

    const {
        open,
        contentRef,
        onOpenChange
    } = props
 
    const carBrands = [

        "Toyota", "Hyundai", "Kia", "Nissan", "Mercedes-Benz", "BMW", "Volkswagen", "Ford", "Renault", "Peugeot",
        "Mitsubishi", "Chevrolet", "Honda", "Mazda", "Audi", "Opel", "Land Rover", "Jeep", "Fiat", "Volvo",
        "Citroën", "Chery", "Suzuki", "Daihatsu", "Isuzu", "Subaru", "Lexus", "Porsche", "Cadillac", "Dongfeng",
        "Jaguar", "SsangYong", "Bugatti", "Haval", "GWM", "BYD", "Geely", "FAW", "Skoda", "GAC",


        "Yamaha", "Kawasaki", "Bajaj", "Loncin", "Zongshen", "Keeway", "Lifan", "TVS",
        "Outro"
    ];

    const carBrandsOptions = carBrands.map((brand) => ({
        label: brand,
        value: brand
    }));





    
    const [message, setMessage] = useState<string>()
    const personEntities = useSetupState(state => state.personEntities)
    const [cardValidate, setCardValidate] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const cards = useVehicleCardState(state => state.cards)
    const selectedCard = useVehicleCardState(state => state.selectedCard)
    const clearSelectedCard = useVehicleCardState(state => state.clearSelectedCard)
    const addVehicle = useVehicleState(state => state.addVehicle)
    const updateVehicle = useVehicleState(state => state.updateVehicle)




    const [entity, setEntity] = useState<string[]>([])
    const [vehicleBrand, setVehicleBrand] = useState<string[]>([])
    const [vehicleType, setVehicleType] = useState<string[]>([])
    const [vehicleColor, setVehicleColor] = useState<string>('')
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string>('')



    useEffect(() => {

        if (selectedCard) {
            
            setVehicleBrand([selectedCard.vehicle.brand])
            setVehicleType([selectedCard.vehicle.type])
            setVehicleColor(selectedCard.vehicle.color)
            setEntity([selectedCard.vehicle.entity]);
            setVehicleLicensePlate(selectedCard.vehicle.licensePlate)
            setCardValidate(selectedCard.expiration.toISOString().split('T')[0]) 
            
            
        }
    }, [selectedCard, cards])

    useEffect(() => {
        if (!open) { 
            clearSelectedCard();
            setVehicleBrand(['']);
            setCardValidate('');
            setEntity(['']);
            setVehicleColor('');
            setVehicleType(['']);
            setVehicleLicensePlate('');
        }

    }, [open])

    async function handleAddVehicle() {
        try {
            setLoading(true)
            const vehicle: VehicleType = {
                brand: vehicleBrand[0],
                entity: entity[0],
                type: vehicleType[0],
                id: UUIDv4.generateId(),
                color: vehicleColor.trim(),
                licensePlate: vehicleLicensePlate.trim(),
            }

            const valid = new Date(cardValidate)

            if (entity) {
                await addVehicle(vehicle, valid, Array.isArray(cards) ? cards : [cards])
                    .catch(() => {
                        setLoading(false)
                    })

                setLoading(false);
                setEntity(['']);
                onOpenChange({ open: false });
                setMessage("")
                setVehicleBrand(['']);
                setVehicleColor('');
                setVehicleLicensePlate('');
                setVehicleType(['']);
            }
        } catch (error) {
            setLoading(false);
            setMessage("")
            
        }
    }

    async function handleUpdateVehicle() {
        try {
            setLoading(true);
    
            const vehicle: VehicleType = {
                id: selectedCard?.vehicle?.id ?? '',
                brand: vehicleBrand[0],
                type: vehicleType[0],
                color: vehicleColor,
                licensePlate: vehicleLicensePlate,
                entity: entity[0],
            };
    
            const valid = new Date(cardValidate);
    
            const card: VehicleCardType = {
                vehicle,
                expiration: valid,
                cardNumber: selectedCard?.cardNumber ?? '',
            };
    
            await updateVehicle(vehicle, card)
            setLoading(false)
            setMessage("")
            setEntity(['']);
            setVehicleBrand(['']);
            setVehicleColor('');
            setVehicleLicensePlate('');
            setVehicleType(['']);
            clearSelectedCard()
            onOpenChange({ open: false })

            
            useVehicleCardState.setState(state => ({
                cards: state.cards.map(c => 
                    c.cardNumber === selectedCard?.cardNumber ? { ...c, vehicle } : c
                ),
            }));
    
            
            
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <DialogModal
            title="Cadastro de Veículos"
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
                    w="100%"
                    flexDir={'column'}
                    align='center'
                    justify='center'
                    justifyContent={'center'}
                >


                </Flex>
                <Text fontSize={'smaller'} fontWeight={'bold'} color={'red'}>{message}</Text>
                <Field

                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Marca do veículo"
                        placeholder="Selecione a marca do veículo"
                        selectedValue={vehicleBrand} // Agora um array de strings
                        onValueChange={setVehicleBrand} // Aceita um array de strings
                        data={carBrandsOptions}
                    >

                    </SelectComponent>

                </Field>
                <Field

                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Tipo de Veículo"
                        placeholder="Seleccione o tipo de veículo"
                        selectedValue={vehicleType}
                        onValueChange={setVehicleType}
                        data={[

                            { label: "Carro", value: "Carro" },
                            { label: "Motorizada", value: "Motorizada" }
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
                        value={vehicleLicensePlate}
                        onChange={e => setVehicleLicensePlate(e.target.value)}

                    />


                </Field>
                <Field
                    label="Digite a cor do veículo"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a cor do veículo"
                        value={vehicleColor}
                        onChange={e => setVehicleColor(e.target.value)}
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