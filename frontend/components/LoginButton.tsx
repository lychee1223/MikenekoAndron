import {
    Alert,
    AlertIcon,
    Button,
    IconButton,
    FormControl,
    FormLabel,
    InputGroup,
    Input,
    InputRightElement,
    Link,
    Stack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Theme from "@/components/Theme";
import React from 'react';

const Login = (props: any) =>{
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(true);
    const [showPass, setShowPass] = React.useState(false)

    const initialRef =  React.useRef<HTMLInputElement>(null);

    // Modalを開いた際の処理
    useEffect(() =>{
        setErrorMessage('');
        setIsOpenLoginModal(true)
    }, [isOpen])

    // ログイン用モーダルとサインアップ用モーダルを切り替えた際の処理
    useEffect(() =>{
        setErrorMessage('');
        initialRef.current && initialRef.current.focus();
    }, [isOpenLoginModal])

    // ログインのリクエストをPOST
    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        setIsLoading(true)
        
        const formData = new FormData(event.currentTarget)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/token`, {
            method: 'POST',
            body: formData,
        })
        if (!res.ok) {
            const error = await res.json()
            setErrorMessage(error.detail)
            setIsLoading(false)
            return
        }
        const token = await res.json()
        Cookies.set('access_token', token.access_token)
        router.reload()
    }

    // サインアップのリクエストをPOST
    const signup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setIsLoading(true)
        
        const target = event.target as typeof event.target & {
			username: { value: string }
			password: { value: string }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: target.username.value,
				password: target.password.value,
			}),
        })
        if (!res.ok) {
			const error = await res.json()
			setErrorMessage(error.detail)
			setIsLoading(false)
			return
        }

        const formData = new FormData()
        formData.append('username', target.username.value)
        formData.append('password', target.password.value)
        const token = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/token`, {
			method: 'POST',
			body: formData,
        }).then(res => res.json())
        Cookies.set('access_token', token.access_token)
        router.reload()
    }

    return (
        <>
            {/* Modalを開くためのボタン */}
            <Button
                onClick={onOpen}
                size='md'
                width='110px'
                variant='outline'
                _hover={{ bg: 'gray.200'}}
                _active={{ filter: 'brightness(90%)' }}
            >
                ログイン
            </Button>
            {isOpenLoginModal ? (
                // ログインモーダル
                <Modal
                    initialFocusRef={initialRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    motionPreset='slideInBottom'
                    blockScrollOnMount={false}
                >
                    <ModalOverlay />
                    <ModalContent maxW="lg">
                        <ModalHeader>ログイン</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={login}>
                                <Stack w="100%">
                                    {errorMessage && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            {errorMessage}
                                        </Alert>
                                    )}
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            ref={initialRef}
                                            type="text"
                                            name="username"
                                            onChange={() => setErrorMessage('')}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPass ? 'text' : 'password'}
                                                name="password"
                                                onChange={() => setErrorMessage('')}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    size="sm"
                                                    aria-label="ShowPass"
                                                    onClick={() => setShowPass(!showPass)}
                                                    icon={showPass ? <FaEyeSlash /> : <FaEye />}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Button type="submit" colorScheme={Theme.color.colorScheme} isLoading={isLoading}>
                                        ログイン
                                    </Button>
                                    <Text textAlign="center">
                                        アカウントをお持ちでない方は{' '}
                                        <Link onClick={() => setIsOpenLoginModal(false)} color="blue.500">
                                            アカウント作成
                                        </Link>
                                    </Text>
                                </Stack>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            ):(
                // サインアップ モーダル
                <Modal
                    initialFocusRef={initialRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    motionPreset='slideInBottom'
                    blockScrollOnMount={false}
                >
                    <ModalOverlay />
                    <ModalContent maxW="lg">
                        <ModalHeader>アカウント作成</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={signup}>
                                <Stack w="100%">
                                    {errorMessage && (
                                        <Alert status="error">
                                            <AlertIcon />
                                            {errorMessage}
                                        </Alert>
                                    )}
                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <Input
                                            ref={initialRef}
                                            type="text"
                                            name="username"
                                            onChange={() => setErrorMessage('')}
                                        />
                                    </FormControl>
                                    <FormControl isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPass ? 'text' : 'password'}
                                                name="password"
                                                onChange={() => setErrorMessage('')}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    size="sm"
                                                    aria-label="ShowPass"
                                                    onClick={() => setShowPass(!showPass)}
                                                    icon={showPass ? <FaEyeSlash /> : <FaEye />}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <Button type="submit" colorScheme={Theme.color.colorScheme} isLoading={isLoading}>
                                        アカウントを作成
                                    </Button>
                                    <Text textAlign="center">
                                        すでにアカウントをお持ちの方は{' '}
                                        <Link onClick={() => setIsOpenLoginModal(true)} color="blue.500">
                                            ログイン
                                        </Link>
                                    </Text>
                                </Stack>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}

export default Login;