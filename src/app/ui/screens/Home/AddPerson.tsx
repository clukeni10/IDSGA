import { useState } from "react";
import DialogModal from "../../components/DialogModal";
import { Flex, Input, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import SelectComponent from "../../components/SelectComponent";
import { Button } from "@/components/ui/button";
import { usePersonState } from "@/app/hooks/usePersonState";
import { PersonType } from "@/app/types/PersonType";
import UUIDv4 from "@/app/libs/uuidv4";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useCardState } from "@/app/hooks/useCardState";
import ImagePreview from "../../components/ImagePreview";
import { personAccesstypes } from "@/app/utils/constants";

interface AddPersonModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}

export default function AddPersonModal(props: AddPersonModal): JSX.Element {

    const {
        open,
        contentRef,
        onOpenChange
    } = props

    const [loading, setLoading] = useState<boolean>(false)
    const [selectedJob, onJobValueChange] = useState<string[]>([])
    const [selectedAccessTypes, onSelectedAccessTypes] = useState<string[]>([])
    const [escort, setEscort] = useState<string[]>([])
    const [entity, setEntity] = useState<string[]>([])
    const [imagePreview, setImagePreview] = useState<string>('');
    const [employeeName, setEmployeeName] = useState<string>("")
    const [cardValidate, setCardValidate] = useState<string>(new Date().toString())

    const addPerson = usePersonState(state => state.addPerson)
    const cards = useCardState(state => state.cards)
    const address = useSetupState(state => state.address)
    const personFunctions = useSetupState(state => state.personFunctions)
    const personEscorts = useSetupState(state => state.personEscorts)
    const personEntities = useSetupState(state => state.personEntities)


    async function handleAddPerson() {
        try {
            setLoading(true)
            const person: PersonType = {
                name: employeeName,
                job: selectedJob[0],
                id: UUIDv4.generateId(),
                escort: escort[0],
                entity: entity[0],
                image: imagePreview,
                accessType: selectedAccessTypes[0]
            }

            const valid = new Date(cardValidate)

            if (address) {
                await addPerson(person, valid, address, cards)
                    .catch(() => {
                        setLoading(false)
                    })
            } else {
                await addPerson(person, valid, address)
                    .catch(() => {
                        setLoading(false)
                    })
            }

            setLoading(false)
            onJobValueChange([])
            setEscort([])
            setEmployeeName("")
            onOpenChange({ open: false })
        } catch (error) {
            setLoading(false)
        }
    }

    const currentYear = new Date().getFullYear();
    const maxYear = Math.min(currentYear, 2025);
    const maxDate = `${maxYear}-12-31`;

    return (
        <DialogModal
            title="Cadastro de pessoal"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                <Button
                    onClick={handleAddPerson}
                    loading={loading}
                >
                    Cadastrar
                </Button>
            }
        >
            <VStack gap={4}>
                <Flex
                    w='100%'
                    /* p='10px' */
                    align='center'
                    justify='center'
                    // borderTop='1px solid #ddd'
                    justifyContent={'center'}
                >
                    <ImagePreview
                        loading={false}
                        setLoading={() => { }}
                        //onSelectedFile={onSelectedFile}
                        imagePreview={imagePreview}
                        onSelectedImagePreview={() => { }}
                        onDeleteImage={() => { }}
                        text='Adicionar foto (Opcional)'
                        setImagePreview={setImagePreview}
                    />
                </Flex>
                <Field
                    label="Nome"
                    errorText="Este campo é obrigatório"
                >
                    <Input
                        placeholder="Digite o nome completo"
                        onChange={e => setEmployeeName(e.target.value)}
                        value={employeeName}
                    />
                </Field>
                <Field
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Função"
                        placeholder="Seleccione a função"
                        selectedValue={selectedJob}
                        onValueChange={onJobValueChange}
                        data={personFunctions}
                    />
                </Field>
                <Field
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Tipos de acesso"
                        placeholder="Seleccione a função"
                        selectedValue={selectedAccessTypes}
                        onValueChange={onSelectedAccessTypes}
                        data={personAccesstypes}
                    />
                </Field>
                <Field
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Escolta"
                        placeholder="Seleccione a escolta"
                        selectedValue={escort}
                        onValueChange={setEscort}
                        data={personEscorts}
                    />
                </Field>
                <Field
                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Escolta"
                        placeholder="Seleccione a entidade"
                        selectedValue={entity}
                        onValueChange={setEntity}
                        data={personEntities}
                    />
                </Field>
                <Field label="Validade do cartão">
                    <Input
                        type="date"
                        value={cardValidate}
                        onChange={e => setCardValidate(e.target.value)}
                        max={maxDate}
                        min={"2025-01-01"}
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}