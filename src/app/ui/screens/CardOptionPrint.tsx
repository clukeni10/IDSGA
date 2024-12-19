import { Button, VStack } from "@chakra-ui/react";
import DialogModal from "../components/DialogModal";
import { useState } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio"

interface CardOptionPrintScreen {
    open: boolean
    onOpenChange: (e: { open: boolean }) => void
    onHandleToPrint: (cardSidePrint: string) => void
}

export default function CardOptionPrintScreen(props: CardOptionPrintScreen): JSX.Element {

    const {
        open,
        onOpenChange,
        onHandleToPrint
    } = props

    const [cardSidePrint, setCardSidePrint] = useState<string>("frontal")

    async function handleToPrint() {
        if (cardSidePrint === 'frontal') {
            onHandleToPrint(cardSidePrint)
        } else {
            onHandleToPrint(cardSidePrint)
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
            </VStack>
        </DialogModal>
    )
}