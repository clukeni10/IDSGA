import {  Flex,  VStack, Input} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import DialogModal from "../../components/DialogModal";
import { useEffect, useState } from "react";
import ImagePreview from "../../components/ImagePreview";
import { Field } from "@/components/ui/field";
import SelectComponent from "../../components/SelectComponent";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useCardState } from "@/app/hooks/useCardState";
import { VehicleType } from "@/app/types/VehicleType";
import UUIDv4 from "@/app/libs/uuidv4";
import { VehicleCardType } from "@/app/types/VehicleCardType";



interface AddVehicleModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}

export default function AddVehicleModal(props: AddVehicleModal): JSX.Element{

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
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    
    const [loading, setLoading] = useState<boolean>(false)

    const cards = useCardState(state => state.cards)

    const selectedCard = useCardState(state => state.selectedCard)
    const clearSelectedCard = useCardState(state => state.clearSelectedCard)


    const [vehicleBrand, setVehicleBrand] = useState<string>("")
    const [vehicleType, setVehicleType] = useState<string>('')
    const [vehicleColor, setVehicleColor] = useState<string>('')
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string>('')

    /*
useEffect(() => {

    if (selectedCard.vehicle){
        setVehicleBrand(selectedCard.vehicle.brand)
        setVehicleType(selectedCard.vehicle.type)
        setVehicleColor(selectedCard.vehicle.color)
        setEntity(selectedCard.vehicle.entity)
        setVehicleLicensePlate(selectedCard.vehicle.licensePlate)
        setCardValidate(selectedCard.expiration.toISOString().
        split('T')[0])
    }
}, [selectedCard])

useEffect(() => {
    if(!open){
        clearSelectedCard();
        setVehicleBrand('');
        setCardValidate('');
        setEntity([]);
        setVehicleColor('');
        setVehicleType('');
        setVehicleLicensePlate('');
    }
    
    }, [open]) */
    
   async function handleAddVehicle(){
        try{
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

            
            }

           
               
            
        }
    }


    return (
        <DialogModal
        title="Cadastro de Veículos"
        open={open}
        onOpenChange={onOpenChange}
        footer={
            
                <Button
                
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