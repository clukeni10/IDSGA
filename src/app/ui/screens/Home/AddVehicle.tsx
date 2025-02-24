import {  Flex,  VStack } from "@chakra-ui/react";
import DialogModal from "../../components/DialogModal";
import { useState } from "react";
import ImagePreview from "../../components/ImagePreview";

interface AddVehicleModal {
    open: boolean
    contentRef?: React.RefObject<HTMLDivElement>
    onOpenChange: (e: { open: boolean }) => void
}

export default function AddVehicleModal(props: AddVehicleModal): JSX.Element{

    const {
        open,
        contentRef,
        onOpenChange
    } = props

    
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [message, setMessage] = useState<string>()


    return (
        <DialogModal
        title="Cadastro de Veículos"
        open={open}
        onOpenChange={onOpenChange}
>

        <VStack gap={4}>
            <Flex
                w="100%"
                flexDir={'column'}
                align='center'
                justify='center'
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
            </Flex>
            
            
        </VStack>

        </DialogModal>
    
        
   
    )
}