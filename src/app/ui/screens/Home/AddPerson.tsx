import { useState } from "react";
import DialogModal from "../../components/DialogModal";
import { Input, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import SelectComponent from "../../components/SelectComponent";
import { Button } from "@/components/ui/button";
import { usePersonState } from "@/app/hooks/usePersonState";
import { PersonType } from "@/app/types/PersonType";
import UUIDv4 from "@/app/libs/uuidv4";

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

    const [employeeName, setEmployeeName] = useState<string>("")

    const addPerson = usePersonState(state => state.addPerson)

    function handleAddPerson() {
        setLoading(true)
        const person: PersonType = {
            name: employeeName,
            job: selectedJob[0],
            id: UUIDv4.generateId()
        }
        
        addPerson(person)
        setLoading(false)
        onJobValueChange([])
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
                        data={[
                            { value: "administrador", label: "Administrador" },
                            { value: "técnico", label: "Técnico" },
                            { value: "segurança", label: "Segurança" },
                        ]}
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}