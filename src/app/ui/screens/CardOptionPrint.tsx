import { Button, Fieldset } from "@chakra-ui/react";
import DialogModal from "../components/DialogModal";
import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio"

interface CardOptionPrintScreen {
    open: boolean
    onOpenChange: (e: { open: boolean }) => void
    onHandleToPrint: (cardSidePrint: string, cardType: string) => void
}

export default function CardOptionPrintScreen(props: CardOptionPrintScreen): JSX.Element {

    const {
        open,
        onOpenChange,
        onHandleToPrint
    } = props

    const [cardSidePrint, setCardSidePrint] = useState<string>("frontal")
    const [cardType, setCardType] = useState<string>("internal")

    async function handleToPrint() {
        if (cardSidePrint === 'frontal') {
            onHandleToPrint(cardSidePrint, cardType)
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
            <Fieldset.Root size="lg">
                <Fieldset.Legend>Tipo de cartão</Fieldset.Legend>
                <RadioGroup
                    variant={'outline'}
                    spaceX="4"
                    colorPalette="teal"
                    value={cardType}
                    onValueChange={e => setCardType(e.value)}
                >
                    <Radio value="internal" minW="120px">
                        Interno
                    </Radio>
                    <Radio value="external">
                        Externo
                    </Radio>
                </RadioGroup>
                <Fieldset.Legend>Impressão</Fieldset.Legend>
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
            </Fieldset.Root>
        </DialogModal>
    )
}