import { Button } from "@/components/ui/button"
import DialogModal from "../../components/DialogModal"
import { Flex, VStack, Text, Input } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"


import SelectComponent from "../../components/SelectComponent"
import { useEffect, useState } from "react"
import { useSetupState } from "@/app/hooks/useSetupState"
import CardService from "@/app/database/CardService"
import { useCardState } from "@/app/hooks/useCardState"


interface AddLicenseModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}
export function AddLicenseModal(props: AddLicenseModal) {
    const {
        open,
        contentRef,
        onOpenChange
    } = props

    const [loading, setLoading] = useState<boolean>(false)
    const [cardValidate, setCardValidate] = useState<string>('')

    const [names, setNames] = useState<string[]>([]);
    const url = "http://localhost:3000";

 


    useEffect(() => {
        const fetchNames = async () => {
            try {
                const fetchedNames = await CardService.shared.getAllNames(url);
                setNames(fetchedNames);
            } catch (error) {
                console.error("Erro ao carregar nomes:", error);
            }
        };

        fetchNames();
    }, []);
    const [licenseCategory, setLicenseCategory] = useState<string[]>([])

    const [entity, setEntity] = useState<string[]>([])
    const personEntities = useSetupState(state => state.personEntities)
    const personNames = useSetupState(state => state.personNames)

   

    const licenseCategories = [
        { label: "Ligeiro", value: "" },
        { label: "Ligeiro", value: "" },
        { label: "Ligeiro", value: "" }

    ]


    return (
        <DialogModal
            title="Emissão de Licença"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                <Button>
                    Emitir
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
                    <Text fontSize={'smaller'} fontWeight={'bold'} color={'red'}>message</Text>
                </Flex>
                <Field

                    errorText="Este campo é obrigatório"
                >
                    <SelectComponent
                        portalRef={contentRef}
                        label="Nome do condutor"
                        placeholder="Selecione o Condutor"
                        selectedValue={names}
                        onValueChange={setNames}
                        data={personNames}
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
                        label="Categoria"
                        placeholder="Selecione a Categoria"
                        selectedValue={licenseCategory}
                        onValueChange={setLicenseCategory}
                        data={licenseCategories}
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

