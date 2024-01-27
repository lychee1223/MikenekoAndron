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
    IconButton,
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
} from "@chakra-ui/react"

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BsPencilSquare } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";

import Theme from "@/components/Theme";
import React from 'react';

type Image = {
    id: number
    path: string
}

type Article = {
    id: number
    is_works: boolean
    tag: string
    date: String
    title: string
    body: string
    images: Image[]
}

interface Props {
    tagColorMap: Map<string, string>;
    articleId: number;
}

function EditArticleButton(props: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // モーダルの開閉および初期入力フォームの管理
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef =  React.useRef<HTMLInputElement>(null)

    // 画像を入力するInputのRefと画像のリスト
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [article, setArticle] = useState<Article>();
    const [images, setImages] = useState<File[]>([]);

    // Modalを開いた際の処理
    useEffect(() =>{
        setErrorMessage('');

        // 記事の初期値を設定
        const fetchArticle = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/articles/${props.articleId}`);
            if (!res.ok) {
                const error = await res.json();
                setErrorMessage(error.detail);
                return
            }
            const data = await res.json();
            setArticle(data)
        };

        // 画像の初期値を設定
        const initializeImages = async (article: Article) => {
            const fetchImage = async (path: string) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images?path=${encodeURIComponent(path)}`);
                if (!res.ok) {
                    const error = await res.json();
                    setErrorMessage(error.detail);
                    return
                }
                const data = await res.blob();
                return new File([data], path);
            };
            const fetchedImages = await Promise.all(article.images.map((image) => fetchImage(image.path)));

            // 画像をリストに追加
            setImages(fetchedImages.filter((image) => image !== null) as File[]);
        };

        fetchArticle();
        if (article){
            initializeImages(article);
        }
    }, [isOpen])

    // アップロードする画像をリストに追加
    const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newImages = Array.from(event.target.files || []);
        if (newImages.length > 0) {
            setImages((prevImages) => [...prevImages, ...newImages]);
        }

        // 画像の選択をリセット
        const input = document.getElementById('images') as HTMLInputElement;
        input.value = '';
    };

    // アップロードする画像をリストから削除
    const deleteImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // 記事と画像を更新
    const editArticle = async (event: React.FormEvent<HTMLFormElement>) => {
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
        const articleRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/articles?id=${props.articleId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

        // 画像のアップロード
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });

        const imageRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images?article_id=${props.articleId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`,
            },
            body: images.length > 0 ? formData : undefined,
        });

        if (!imageRes.ok) {
            const error = await imageRes.json();
            setErrorMessage(error.detail);
            setIsLoading(false);
            return;
        }

        router.reload();
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                aria-label="EditArticle"
                size="sm"
                borderRadius='full'
                bg={Theme.color.main} _hover={{ filter: 'brightness(90%)' }} _active={{ filter: 'brightness(80%)' }}
                color="white" fontSize={16}
                icon={<BsPencilSquare />}
            />

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
                    <ModalHeader>記事を作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={editArticle} encType="multipart/form-data">
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
                                        name="title" id="title"
                                        defaultValue={article && article.title}
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>本文</FormLabel>
                                    <Textarea
                                        name="body" id="body"
                                        defaultValue={article && article.body}
                                        onChange={() => setErrorMessage('')}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>タグ</FormLabel>
                                    <Select
                                        name="tag" id="tag"
                                        defaultValue={article && article.tag}
                                        width="100px"
                                    >
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
                                        name="iamges" id="images"
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
                                    記事をアップロード
                                </Button>
                            </Stack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default EditArticleButton;