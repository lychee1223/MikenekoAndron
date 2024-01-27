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
    SimpleGrid,
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
    AspectRatio,
    HStack,
    Flex,
    IconButton,
} from "@chakra-ui/react"

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

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

    // モーダルの開閉および初期入力フォームの管理
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef =  React.useRef<HTMLInputElement>(null)

    // 画像を入力するInputのRefと画像のリスト
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);

    // Modalを開いた際の処理
    useEffect(() =>{
        setErrorMessage('');
        setImages([])
    }, [isOpen])

    // アップロードする画像をリストに追加
    const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newImages = Array.from(event.target.files || []);
        if (newImages.length > 0) {
            setImages((prevImages) => [...prevImages, ...newImages]);
        }

        // 画像の選択をリセット
        const input = document.getElementById('createImagesInput') as HTMLInputElement;
        input.value = '';
    };

    // アップロードする画像をリストから削除
    const deleteImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
        if (images.length > 0) {
            const formData = new FormData();
            images.forEach((image) => {
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

        router.reload();
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                aria-label="CreateArticle"
                position='fixed' bottom='20px' right='20px'
                size="md"
                borderRadius='full'
                bg={Theme.color.main}
                color='white' _hover={{ filter: 'brightness(90%)' }} _active={{ filter: 'brightness(80%)' }}
                icon={<HiPlus />}
            >
                <Text>+</Text>
            </ IconButton>

            {/* 作品作成モーダル */}
            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
                motionPreset='slideInBottom'
                blockScrollOnMount={false}
            >
                <ModalOverlay />
                <ModalContent maxW="lg">
                    <ModalHeader>新規記事を作成</ModalHeader>
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
                                        name="title" id="createTitleInput"
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>本文</FormLabel>
                                    <Textarea
                                        name="body" id="createBodyInput"
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>タグ</FormLabel>
                                    <Select name="tag" id="createTagSelect" width="100px">
                                    {Array.from(props.tagColorMap.entries()).map(([tag, color], i) => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel pointerEvents="none">画像をアップロード</FormLabel>
                                    <Input
                                        type="file" multiple
                                        name="iamges" id="createImagesInput"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={addImage}
                                        display="none"
                                    />
                                    {/* アップロード画像のプレビュー */}
                                    <SimpleGrid spacing="10px" minChildWidth="80px">
                                        {images.length > 0 && (
                                            <>
                                                {images.map((image, index) => (
                                                    <Box
                                                        key={index}
                                                        w="80px"
                                                        position="relative"
                                                    >
                                                        <AspectRatio ratio={16 / 9}>
                                                            <Image
                                                                src={URL.createObjectURL(image)}
                                                                alt={`selected preview ${index}`}
                                                                borderRadius="8px"
                                                                objectFit="contain"
                                                            />
                                                        </AspectRatio>
                                                        <CloseButton
                                                            position="absolute" top={0} right={0}
                                                            h="100%" w="100%"
                                                            color="rgba(0,0,0,0)"
                                                            _hover={{ bg: 'rgba(0,0,0,0.4)', color: "white"}}
                                                            _active={{ bg: 'rgba(0,0,0,0.1)' }}
                                                            onClick={() => deleteImage(index)}
                                                        />
                                                    </Box>
                                                ))}
                                            </>
                                        )}
                                        {/* 画像追加ボタン */}
                                        <Button
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            w="80px"
                                            aspectRatio={16 / 9}
                                            border="2px dashed gray"
                                            bg="gray.200"
                                            borderRadius="8px"
                                            _hover={{ filter: 'brightness(90%)' }}
                                            _active={{ filter: 'brightness(80%)' }}
                                        >
                                            <MdOutlineFileUpload />
                                        </Button>
                                        {/* パディング */}
                                        {Array.from({ length: 4 - images.length }).map((_, i) => (
                                            <Box key={4 + i} w="80px" aspectRatio={16 / 9}></Box>
                                        ))}
                                    </SimpleGrid>
                                </FormControl>
                                <Button type="submit" colorScheme={Theme.color.colorScheme} isLoading={isLoading}>
                                    アップロード
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