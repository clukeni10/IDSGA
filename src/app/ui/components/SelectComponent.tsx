import { createListCollection } from "@chakra-ui/react"
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select"

interface SelectComponent {
    label?: string
    placeholder?: string
    portalRef?: React.RefObject<HTMLDivElement>
    data: { label: string, value: string }[]
    selectedValue: string[]
    onValueChange: (value: string[]) => void
}

export default function SelectComponent(props: SelectComponent): JSX.Element {

    const {
        label,
        portalRef,
        selectedValue,
        data,
        placeholder,
        onValueChange
    } = props

    const dataWork = createListCollection({
        items: data,
    })

    return (
        <SelectRoot
            collection={dataWork}
            width="320px"
            value={selectedValue}
            onValueChange={(e) => onValueChange(e.value)}
        >
            {label ? <SelectLabel>{label}</SelectLabel> : null}
            <SelectTrigger>
                <SelectValueText placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
                portalRef={portalRef}
                zIndex={100000}
            >
                {dataWork.items.map((data) => (
                    <SelectItem item={data} key={data.value}>
                        {data.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}