import { Box, Input, VStack, Text, Image, Spinner, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { CiCamera } from "react-icons/ci";
import { GoTrash } from "react-icons/go";


export interface ImagePreviewProps {
    onSelectedImagePreview: (fileString: string) => void
    imagePreview: string
    setImagePreview: React.Dispatch<React.SetStateAction<string>>
    onDeleteImage?: () => void
    setLoading: (loading: boolean) => void
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
        loading, 
        setLoading, 
        isItem, 
        disabledInput, 
        imagePreview,
        setImagePreview
    } = props

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
   

    function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        const f = e.target.files as FileList
        setLoading(true)
        setLoading(false)
        reader.onload = (e: ProgressEvent<FileReader>) => {
            onSelectedImagePreview(e.target?.result as string);
            const result = e.target?.result as string;
            setImagePreview(result);
            onSelectedImagePreview?.(result);
        };
        reader.readAsDataURL(f[0]);
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

    console.log("imagePreview", imagePreview)

    return (

        <Box>
            {
                imagePreview === '' ?
                    <Box
                        cursor='pointer'
                        borderWidth='1px'
                        borderRadius='md'
                        width={'223px'}
                        height={'223px'}
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
                                <>
                                    <Icon>
                                        <CiCamera />
                                    </Icon>
                                    {text ? <Text fontSize={'sm'} textAlign={'center'}>{text}</Text> : <Text>Adicionar foto</Text>}
                                </>
                            )}
                        </VStack>
                        {!disabledInput && (
                            <Input
                                type='file'
                                placeholder='Adicionar foto'
                                readOnly
                                backgroundColor='white'
                                accept='image/*'
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
                                            <GoTrash color='#f00'/>
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