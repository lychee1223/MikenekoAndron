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
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
} from "@chakra-ui/react"

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaTrashCan } from "react-icons/fa6";

import Theme from "@/components/Theme";
import React from 'react';

interface Props {
    articleId: number;
}

function DeleteArticleButton(props: Props) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // モーダルの開閉および初期入力フォームの管理
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    // 記事と画像をサーバから削除
    const createArticle = async () => {
        setIsLoading(true);

        // 記事の作成
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/articles?id=${props.articleId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('access_token')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const error = await res.json();
            setErrorMessage(error.detail);
            setIsLoading(false);
            onClose();
            return;
        }

        router.reload();
    };

    return (
        <>
            <IconButton
                onClick={onOpen}
                aria-label="DeleteArticle"
                size="sm"
                borderRadius='full'
                bg={Theme.color.main} _hover={{ filter: 'brightness(90%)' }} _active={{ filter: 'brightness(80%)' }}
                color="white" fontSize={16}
                icon={<FaTrashCan />}
            />

            {/* 作品作成モーダル */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                blockScrollOnMount={false}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        記事を削除
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Text>本当に記事を削除してもよろしいですか?</Text>
                        <Text>(この操作は元に戻せません)</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button colorScheme="red" onClick={createArticle} ml={3}>
                        OK
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default DeleteArticleButton;