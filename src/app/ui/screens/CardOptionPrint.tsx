import { Button, VStack } from "@chakra-ui/react";
import DialogModal from "../components/DialogModal";
import { Input } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useState } from "react";
import { message } from '@tauri-apps/plugin-dialog';
import { Radio, RadioGroup } from "@/components/ui/radio"

interface CardOptionPrintScreen {
    open: boolean
    onOpenChange: (e: { open: boolean }) => void
    onHandleToPrint: (date: Date, cardSidePrint: string) => void
}

export default function CardOptionPrintScreen(props: CardOptionPrintScreen): JSX.Element {

    const {
        open,
        onOpenChange,
        onHandleToPrint
    } = props

    const [cardValidate, setCardValidate] = useState<string>("")
    const [cardSidePrint, setCardSidePrint] = useState<string>("frontal")

    async function handleToPrint() {
        const valid = new Date(cardValidate)

        if (cardSidePrint === 'frontal') {
            if (cardValidate !== "") {
                onHandleToPrint(valid, cardSidePrint)
            } else {
                await message('Digite uma data de validade válida', { title: 'Impressão de cartão', kind: 'info' });
            }
        } else {
            onHandleToPrint(valid, cardSidePrint)
        }
    }

    return (
        <DialogModal
            title="Imprimir cartão"
            open={open}
            onOpenChange={onOpenChange}
            footer={
                <Button
                    onClick={handleToPrint}
                >
                    Imprimir
                </Button>
            }
        >
            <VStack gap={4}>

                <RadioGroup
                    variant={'outline'}
                    spaceX="4"
                    colorPalette="teal"
                    value={cardSidePrint}
                    onValueChange={e => setCardSidePrint(e.value)}
                >
                    <Radio value="frontal" minW="120px">
                        Frontal
                    </Radio>
                    <Radio value="verso">
                        Verso
                    </Radio>
                </RadioGroup>
                {
                    cardSidePrint === 'verso' ? null :
                        <Field label="Validade do cartão">
                            <Input
                                type="date"
                                value={cardValidate}
                                onChange={e => setCardValidate(e.target.value)}
                            />
                        </Field>
                }
            </VStack>
        </DialogModal>
    )
}