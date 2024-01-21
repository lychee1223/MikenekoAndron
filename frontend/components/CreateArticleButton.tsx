import {
    Alert,
    AlertIcon,
    Box,
    Stack,
    VStack,
    Heading,
    Card,
    CardBody,
    Image,
    Tag,
    TagLabel,
    Button,
    CloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react"

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Theme from "@/components/Theme";
import React from 'react';

interface Props {
    tagColorMap: Map<string, string>;
    isWorks: boolean;
}

function CreateArticleButton(props: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef =  React.useRef<HTMLInputElement>(null)

    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newImages = Array.from(event.target.files || []);

        if (newImages.length > 0) {
            setSelectedImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // 記事と画像をサーバにアップロード
    const createArticle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoading(true);

        const target = event.target as typeof event.target & {
            tag: { value: string };
            title: { value: string };
            body: { value: string };
        };

        // リクエスト時刻を文字列に変換
        const currentDate = new Date();
        const isoFormattedDate = currentDate.toISOString();

        // 記事の作成
        const articleRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/articles`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                is_works: String(props.isWorks),
                tag: target.tag.value,
                date: isoFormattedDate,
                title: target.title.value,
                body: target.body.value,
            }),
        });

        if (!articleRes.ok) {
            const error = await articleRes.json();
            setErrorMessage(error.detail);
            setIsLoading(false);
            return;
        }

        const articleData = await articleRes.json();
        const articleId = articleData.id; // 記事のIDを取得

        // 画像のアップロード
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const images = imageInput?.files;

        if (selectedImages.length > 0) {
            const formData = new FormData();
            selectedImages.forEach((image) => {
                formData.append('images', image);
            });

            const imageRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images?article_id=${articleId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('access_token')}`,
                },
                body: formData,
            });

            if (!imageRes.ok) {
                const error = await imageRes.json();
                setErrorMessage(error.detail);
                setIsLoading(false);
                return;
            }
        }

        // 成功時にはリロード
        router.reload();
    };


    return (
        <>
            <Button
                onClick={onOpen}
                position='fixed'
                bottom='20px'
                right='20px'
                borderRadius='full'
                bg={Theme.color.main}
                color='white'
                _hover={{}}
                _active={{ filter: 'brightness(90%)' }}
            >
                <Text>+</Text>
            </ Button>

            {/* 作品入力モーダル */}
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
                motionPreset='slideInBottom'
                blockScrollOnMount={false}
            >
                <ModalOverlay />
                <ModalContent maxW="lg">
                    <ModalHeader>記事を作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={createArticle} encType="multipart/form-data">
                            <Stack w="100%">
                                {errorMessage && (
                                    <Alert status="error">
                                        <AlertIcon />
                                        {errorMessage}
                                    </Alert>
                                )}
                                <FormControl isRequired>
                                    <FormLabel>タイトル</FormLabel>
                                    <Input
                                        ref={initialRef}
                                        type="text"
                                        name="title"
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>本文</FormLabel>
                                    <Textarea
                                        name="body"
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>タグ</FormLabel>
                                    <Select name="tag" width="100px">
                                    {Array.from(props.tagColorMap.entries()).map(([tag, color], i) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>画像をアップロード</FormLabel>
                                    <Input
                                        type="file"
                                        name="images"
                                        id="imageInput"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {/* 新たに画像を選択した一覧 */}
                                    {selectedImages.length > 0 && (
                                        <Box mt={4} display="flex" flexWrap="wrap">
                                            {selectedImages.map((image, index) => (
                                                <Box key={index} m={2} position="relative">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`selected preview ${index}`}
                                                        width="100"
                                                        height="100"
                                                    />
                                                    <CloseButton position="absolute" top="-8px" right="-8px" onClick={() => handleRemoveImage(index)} />
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </FormControl>
                                <Button type="submit" colorScheme={Theme.color.colorScheme} isLoading={isLoading}>
                                    作成
                                </Button>
                            </Stack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateArticleButton;