import { Box, Button, Field, Flex, Input, VStack } from "@chakra-ui/react"
import DialogModal from "../../components/DialogModal"
import SelectComponent from "../../components/SelectComponent"
import { useState } from "react"
import { useSetupState } from "@/app/hooks/useSetupState"



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


    const [entity, setEntity] = useState<string[]>([])

    const personEntities = useSetupState(state => state.personEntities)

    return (
        <DialogModal
            title="Cadastro de veículo"
            open={open}
            footer={
                selectedCard ?
                    <Button
                        onClick={handleUpdateVehicle}
                        loading={loading}
                    >
                        Actualizar
                    </Button>

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

                </Flex>
                <Field
                    label="Marca"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a marca do veículo"

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
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Tipo"
                        placeholder="Seleccione o tipo de veículo"
                        selectedValue={entity}
                        onValueChange={setEntity}
                        data={personEntities}
                    />
                </Field>
                <Field
                    label="Cor"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a cor do veículo"
                    />
                </Field>
                <Field
                    label="Matrícula"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite a matrícula do veículo"
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}