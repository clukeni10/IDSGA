import { Button, VStack } from "@chakra-ui/react";
import DialogModal from "../components/DialogModal";
import { Input } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio"
import { useNetworkState } from "@/app/hooks/useNetworkState";
import { usePersonState } from "@/app/hooks/usePersonState";

interface SetupNetworkScreen {
    open: boolean
    onOpenChange: (e: { open: boolean }) => void
}

export default function SetupNetworkScreen(props: SetupNetworkScreen): JSX.Element {

    const {
        open,
        onOpenChange,
    } = props

    const saveNetworkAddress = useNetworkState(state => state.saveNetworkAddress)
    const forceRefresh = usePersonState(state => state.forceRefresh)

    const address = useNetworkState(state => state.address)
    const [serverAddress, setServerAddress] = useState<string>(address ? address : "")
    const [network, setNetwork] = useState<string>(address ? "servidor" : "local")

    async function handleToPrint() {

        if (network === 'local') {
            saveNetworkAddress(null)
        } else {
            saveNetworkAddress(serverAddress)
        }
        forceRefresh()
        onOpenChange({ open: false })
    }

    return (
        <DialogModal
            title="Definir a base de dados"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                <Button
                    onClick={handleToPrint}
                >
                    Salvar
                </Button>
            }
        >
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
                                value={serverAddress}
                                onChange={e => setServerAddress(e.target.value)}
                            />
                        </Field>
                }
            </VStack>
        </DialogModal>
    )
}