import { useState } from "react";
import DialogModal from "../../components/DialogModal";
import { Input, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import SelectComponent from "../../components/SelectComponent";
import { Button } from "@/components/ui/button";
import { usePersonState } from "@/app/hooks/usePersonState";
import { PersonType } from "@/app/types/PersonType";
import UUIDv4 from "@/app/libs/uuidv4";
import { useSetupState } from "@/app/hooks/useSetupState";
import { useCardState } from "@/app/hooks/useCardState";

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
    const [escort, setEscort] = useState<string[]>([])

    const [employeeName, setEmployeeName] = useState<string>("")
    const [cardValidate, setCardValidate] = useState<string>(new Date().toString())

    const addPerson = usePersonState(state => state.addPerson)
    const cards = useCardState(state => state.cards)
    const address = useSetupState(state => state.address)
    const personFunctions = useSetupState(state => state.personFunctions)
    const personEscorts = useSetupState(state => state.personEscorts)

    async function handleAddPerson() {
        setLoading(true)
        const person: PersonType = {
            name: employeeName,
            job: selectedJob[0],
            id: UUIDv4.generateId(),
            escort: escort[0]
        }

        const valid = new Date(cardValidate)

        if (address) {
            await addPerson(person, valid, address, cards)
        } else {
            await addPerson(person, valid, address)
        }

        setLoading(false)
        onJobValueChange([])
        setEscort([])
        setEmployeeName("")
        onOpenChange({ open: false })
    }

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
                        label="Escolta"
                        placeholder="Seleccione a escolta"
                        selectedValue={escort}
                        onValueChange={setEscort}
                        data={personEscorts}
                    />
                </Field>
                <Field label="Validade do cartão">
                    <Input
                        type="date"
                        value={cardValidate}
                        onChange={e => setCardValidate(e.target.value)}
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}