import { useEffect, useState } from "react";
import DialogModal from "../../components/DialogModal";
import { Flex, Input, Text, VStack } from "@chakra-ui/react";
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
import { CardType } from "@/app/types/CardType";

interface AddPersonModal { 
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement> 
    onOpenChange: (e: { open: boolean }) => void
    selectedCard?: CardType | null; //
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
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [employeeName, setEmployeeName] = useState<string>("")
    const [cardValidate, setCardValidate] = useState<string>('')

    const [message, setMessage] = useState<string>()
 
    const addPerson = usePersonState(state => state.addPerson)
    const updatePerson = usePersonState(state => state.updatePerson)
    const cards = useCardState(state => state.cards)
    const selectedCard = useCardState(state => state.selectedCard)
    const clearSelectedCard = useCardState(state => state.clearSelectedCard)

    const address = useSetupState(state => state.address)
    const personFunctions = useSetupState(state => state.personFunctions)
    const personEscorts = useSetupState(state => state.personEscorts)
    const personEntities = useSetupState(state => state.personEntities)
 
    useEffect(() => {

        if (selectedCard) {
            onJobValueChange([selectedCard.person.job])
            onSelectedAccessTypes(selectedCard.person.accessType)
            setEscort([selectedCard.person.escort])
            setEntity([selectedCard.person.entity])
            setImagePreview(selectedCard.person.image ?? '')
            setEmployeeName(selectedCard.person.name)
            setCardValidate(selectedCard.expiration.toISOString().split('T')[0])
        }

    }, [selectedCard])

    useEffect(() => {

        if (!open) {
            clearSelectedCard();
            setEmployeeName('');
            setCardValidate('');
            setEscort([]);
            setEntity([]);
            setImagePreview('');
            onSelectedAccessTypes([]);
            onJobValueChange([]);
        }

    }, [open])

    async function handleAddPerson() {
        try {
            setLoading(true)
            const person: PersonType = {
                name: employeeName.trim(),
                job: selectedJob[0],
                id: UUIDv4.generateId(),
                escort: escort[0],
                entity: entity[0],
                accessType: selectedAccessTypes
            }

            const valid = new Date(cardValidate)

            if (imageFile) {
                await addPerson(person, valid, address, imageFile, Array.isArray(cards) ? cards : [cards])
                    .catch(() => {
                        setLoading(false)
                    })

                setLoading(false)
                onJobValueChange([])
                setEscort([])
                setEmployeeName("")
                setMessage("")
                setImagePreview("")
                setImageFile(undefined)
                onSelectedAccessTypes([])
                setEntity([])
                onOpenChange({ open: false })
            }


        } catch (error) {
            setLoading(false)
            setMessage("")
        }
    }

    async function handleUpdatePerson() {
        try {
            setLoading(true)
            const person: PersonType = {
                name: employeeName,
                job: selectedJob[0],
                id: selectedCard?.person.id ?? '',
                escort: escort[0],
                entity: entity[0],
                image: selectedCard?.person.image,
                accessType: selectedAccessTypes
            }

            const valid = new Date(cardValidate)

            const card: CardType = {
                person,
                expiration: valid,
                cardNumber: selectedCard?.cardNumber ?? ''
            }

            await updatePerson(person, address, imageFile, card)
            setLoading(false)
            onJobValueChange([])
            setEscort([])
            setEmployeeName("")
            setMessage("")
            setImagePreview("")
            setImageFile(undefined)
            onSelectedAccessTypes([])
            setEntity([])
            clearSelectedCard()
            onOpenChange({ open: false }) 
        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <DialogModal
            title="Cadastro de pessoal"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                selectedCard ?
                    <Button
                        onClick={handleUpdatePerson}
                        loading={loading}
                    >
                        Actualizar
                    </Button>
                    :
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
                    flexDir={'column'}
                    align='center'
                    justify='center'
                    // borderTop='1px solid #ddd'
                    justifyContent={'center'}
                >
                    <ImagePreview
                        loading={false}
                        setLoading={() => { }}
                        imagePreview={imagePreview}
                        onMessage={setMessage}
                        onSelectedImagePreview={setImageFile}
                        onDeleteImage={() => { }}
                        text='Adicionar foto'
                        setImagePreview={setImagePreview}
                        onResultFile={setImageFile}
                    />
                    <Text fontSize={'smaller'} fontWeight={'bold'} color={'red'}>{message}</Text>
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
                        multiple
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
                        label="Entidade" 
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
                        min={"2025-01-01"}
                    />
                </Field>
            </VStack>
        </DialogModal>
    )
}