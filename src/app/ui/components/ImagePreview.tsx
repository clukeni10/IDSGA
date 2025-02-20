import { Box, Input, VStack, Text, Image, Spinner, Icon, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { GoTrash } from "react-icons/go";
import { VscDeviceCamera } from 'react-icons/vsc';


export interface ImagePreviewProps {
    onSelectedImagePreview: (file: File | undefined) => void
    imagePreview: string
    setImagePreview: React.Dispatch<React.SetStateAction<string>>
    onMessage: (message: string) => void
    onDeleteImage?: () => void
    setLoading: (loading: boolean) => void
    onResultFile: (file: File) => void
    onClick?: () => void
    text?: string
    loading: boolean
    isItem?: boolean
    className?: string
    disabledInput?: boolean
}

function ImagePreview(props: ImagePreviewProps): JSX.Element {

    const {
        onClick,
        onSelectedImagePreview,
        text,
        onDeleteImage,
        onMessage,
        loading,
        isItem,
        disabledInput,
        imagePreview,
        setImagePreview
    } = props

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });


    function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        const file = e.target.files?.[0];
        const f = e.target.files as FileList

        if (file && file.size > 1000000) {
            onMessage("A imagem seleccionada excede o tamanho de 1 MB máximo.")
        } else {
            reader.onload = (e: ProgressEvent<FileReader>) => {
                onSelectedImagePreview(file);
                const result = e.target?.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(f[0]);
        }
    }

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = event.target as HTMLImageElement;

        setImageDimensions({ width: target.naturalWidth, height: target.naturalHeight });
    };

    const onClosePreview = () => {
        setImagePreview('');
        setImageDimensions({ width: 0, height: 0 });
        onDeleteImage?.();
    };

    return (
        <Box>
            {
                imagePreview === '' ?
                    <Box
                        cursor='pointer'
                        borderWidth='1px'
                        borderRadius='md'
                        width={'200px'}
                        height={'200px'}
                        display='flex'
                        flexShrink={0}
                        flexDir='column'
                        justifyContent='space-between'
                        alignItems='center'
                        onClick={onClick ? onClick : () => document.getElementById('imageFile')?.click()}
                        bg='#fff'
                    >
                        <VStack
                            pt={'80px'}
                        >

                            {loading ? (
                                <Spinner color='#F29325' />
                            ) : (
                                <Stack
                                    alignItems={'center'}
                                >
                                    <Icon
                                        fontSize="2xl"
                                        color={'#666'}
                                    >
                                        <VscDeviceCamera />
                                    </Icon>
                                    {text ? <Text fontSize={'sm'} textAlign={'center'} color={'#666'}>{text}</Text> : <Text>Adicionar foto</Text>}
                                </Stack>
                            )}
                        </VStack>
                        {!disabledInput && (
                            <Input
                                type='file'
                                placeholder='Adicionar foto'
                                readOnly
                                backgroundColor='white'
                                accept="image/png, image/jpeg, image/jpg"
                                _hover={{
                                    cursor: 'pointer',
                                }}
                                id='imageFile'
                                hidden
                                onChange={onChangeImage}
                            />
                        )}
                    </Box>
                    :
                    <Box
                        position='relative'
                        width={'223px'}
                        height={'223px'}
                        borderWidth='1px'
                        borderRadius='md'
                    >
                        <Image
                            src={imagePreview}
                            alt='Preview'
                            onLoad={handleImageLoad}
                            boxSize='100%'
                            objectFit={(imageDimensions.width > 223 && imageDimensions.height > 1000) || (imageDimensions.width < 223 && imageDimensions.height > 223) ? 'contain' : 'cover'}
                        />
                        {
                            !isItem ?
                                (
                                    <Box
                                        position='absolute'
                                        top='0'
                                        right='0'
                                        margin='2'
                                        zIndex='1'
                                        bg={'#fff'}
                                        p={'2'}
                                        borderRadius={'8'}
                                        cursor='pointer'
                                        onClick={onClosePreview}
                                    >
                                        <Icon>
                                            <GoTrash color='#f00' />
                                        </Icon>
                                    </Box>
                                ) : (
                                    null
                                )
                        }
                    </Box>
            }
        </Box>
    )
}

export default React.memo(ImagePreview, (prev, next) =>
    prev.imagePreview === next.imagePreview &&
    prev.onSelectedImagePreview === next.onSelectedImagePreview)