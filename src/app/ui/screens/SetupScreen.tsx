import { Button, VStack, Tabs } from "@chakra-ui/react";
import DialogModal from "../components/DialogModal";
import { Input } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio"
import { useSetupState } from "@/app/hooks/useSetupState";
import { usePersonState } from "@/app/hooks/usePersonState";
import SelectComponent from "../components/SelectComponent";
import { message } from '@tauri-apps/plugin-dialog';

interface SetupScreen {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}

export default function SetupScreen(props: SetupScreen): JSX.Element {

    const {
        open,
        contentRef,
        onOpenChange,
    } = props

    const saveNetworkAddress = useSetupState(state => state.saveNetworkAddress)
    const savePersonFunction = useSetupState(state => state.savePersonFunction)
    const savePersonEscort = useSetupState(state => state.savePersonEscort)

    const address = useSetupState(state => state.address)
    const personFunctions = useSetupState(state => state.personFunctions)
    const personEscorts = useSetupState(state => state.personEscorts)

    const forceRefresh = usePersonState(state => state.forceRefresh)

    const [serverAddress, setServerAddress] = useState<string>(address ? address : "")
    const [network, setNetwork] = useState<string>(address ? "servidor" : "local")
    const [functionToAdd, setFunctionToAdd] = useState<string>("")
    const [escortToAdd, setEscortToAdd] = useState<string>("")

    async function handleToPrint() {

        if (network === 'local') {
            saveNetworkAddress(null)
        } else {
            saveNetworkAddress(serverAddress)
        }
        forceRefresh()
        onOpenChange({ open: false })
    }

    async function handleSaveFunction(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {

            if (functionToAdd === "") {
                await message('O campo não pode estar vazio', { title: 'Função', kind: 'info' });
            } else if (address) {
                await savePersonFunction(functionToAdd, address)
                setFunctionToAdd("")
            } else {
                await message('Seleccione servidor em Redes', { title: 'Configuração de redes', kind: 'info' });
            }
        }
    }

    async function handleSaveEscort(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {

            if (escortToAdd === "") {
                await message('O campo não pode estar vazio', { title: 'Escolta', kind: 'info' });
            } else if (address) {
                await savePersonEscort(escortToAdd, address)
                setEscortToAdd("")
            } else {
                await message('Seleccione servidor em Redes', { title: 'Configuração de redes', kind: 'info' });
            }
        }
    }

    return (
        <DialogModal
            title="Definir a base de dados"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Tabs.Root defaultValue={"function"} variant={'outline'}>
                <Tabs.List>
                    <Tabs.Trigger value="function">
                        Gerir Função
                    </Tabs.Trigger>
                    <Tabs.Trigger value="escort">
                        Gerir Escolta
                    </Tabs.Trigger>
                    <Tabs.Trigger value="network">
                        Redes
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="function">
                    <Field
                        label="Função"
                        errorText="Este campo é obrigatório"
                        pb={5}
                    >
                        <Input
                            placeholder="Digite a função e pressione ENTER"
                            onChange={e => setFunctionToAdd(e.target.value)}
                            value={functionToAdd}
                            onKeyDown={handleSaveFunction}
                        />
                    </Field>
                    <Field
                        errorText="Este campo é obrigatório"
                    >
                        <SelectComponent
                            portalRef={contentRef}
                            label="Funções armazenadas"
                            placeholder="Clique para ver"
                            selectedValue={[]}
                            onValueChange={() => null}
                            data={personFunctions}
                        />
                    </Field>
                </Tabs.Content>
                <Tabs.Content value="escort">
                    <Field
                        label="Escolta"
                        errorText="Este campo é obrigatório"
                        pb={5}
                    >
                        <Input
                            placeholder="Digite a Escolta e pressione ENTER"
                            onChange={e => setEscortToAdd(e.target.value)}
                            value={escortToAdd}
                            onKeyDown={handleSaveEscort}
                        />
                    </Field>
                    <Field
                        errorText="Este campo é obrigatório"
                    >
                        <SelectComponent
                            portalRef={contentRef}
                            label="Escoltas armazenadas"
                            placeholder="Clique para ver"
                            selectedValue={[]}
                            onValueChange={() => null}
                            data={personEscorts}
                        />
                    </Field>
                </Tabs.Content>
                <Tabs.Content value="network">
                    <VStack gap={4}>
                        <RadioGroup
                            variant={'outline'}
                            spaceX="4"
                            colorPalette="teal"
                            value={network}
                            onValueChange={e => setNetwork(e.value)}
                        >
                            <Radio value="local" minW="120px">
                                Local
                            </Radio>
                            <Radio value="servidor">
                                Servidor
                            </Radio>
                        </RadioGroup>
                        {
                            network === 'local' ? null :
                                <Field label="Endereço do servidor">
                                    <Input
                                        type="text"
                                        placeholder="Ex: 192.168.0.1"
                                        autoComplete="none"
                                        autoCorrect="none"
                                        value={serverAddress}
                                        onChange={e => setServerAddress(e.target.value)}
                                    />
                                </Field>
                        }

                        <Button
                            onClick={handleToPrint}
                            width={'full'}
                        >
                            Salvar
                        </Button>
                    </VStack>
                </Tabs.Content>
            </Tabs.Root>
        </DialogModal>
    )
}