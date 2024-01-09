import Head from "next/head"
import styles from "@/styles/Home.module.css"
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import {
    Box,
    Stack,
    VStack,
    HStack,
    Heading,
    Text,
    Image,
    Spinner,
} from "@chakra-ui/react"

import Theme from "@/components/Theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ログイン状態を確認
    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = Cookies.get('access_token')
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_HOST}/users/me`,
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                },
            )
            if (!res.ok) {
                // localStorage.removeItem('isLoggedIn')
                setIsLoggedIn(false);
                return
            }
            // localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true)
        }
        fetchUser()
    }, [])

    return (
        <>
            <Head>
                <title>三毛猫のアンドロン</title>
                <meta name="description" content="my portfolio site" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={`${styles.main} ${inter.className}`}>
                {/* ヘッダ */}
                <Header defaultIndex={0} isLoggedIn={isLoggedIn}/>

                {/* コンテンツ */}
                <Box className={styles.content}>
                    <Box h="500px" bg={Theme.color.backgroundA}>
                        <VStack h="100%" justify="center" spacing={0} >
                            <Heading size="4xl">TAKURO KAWADA</Heading>
                            <Heading>I AM AN ENGINEER</Heading>
                        </VStack>
                    </Box>

                    {/* ゲーム開発特集 */}
                    <Box h="500px" p={4} bg={Theme.color.backgroundB}>
                        <HStack h="100%" spacing={0} >
                            {/* テキスト */}
                            <VStack h="100%" w="50%" spacing={3} justify="center">
                                <Heading size="4xl" color={Theme.color.main}>ゲーム開発</Heading>
                                <Text>Unity / UE5 を用いた作品の数々</Text>
                            </VStack>

                            {/* イメージ画像 */}
                            <VStack h="100%" w="50%" justify="center" spacing={0} >
                                <Box h="50%" w="100%" p={4} mr="10%">
                                    <Image
                                        src="/img/works/PoA/PoA_image2.png"
                                        alt="workImage01"
                                        boxSize="100%" objectFit="contain"
                                        ml="auto"
                                    />
                                </Box>
                                <Box h="50%" w="100%" p={4} ml="10%">
                                    <Image
                                        src="/img/works/PoA/PoA_image3.png"
                                        alt="workImage02"
                                        boxSize="100%" objectFit="contain"
                                        mr="auto"
                                    />
                                </Box>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* 自然言語処理特集 */}
                    <Box h="500px" bg={Theme.color.backgroundA}>
                        <HStack h="100%" spacing={0}>
                            {/* イメージ画像 */}
                            <VStack h="100%" w="50%" justify="center">
                                <Image
                                    src="/img/works/coding_image.png"
                                    alt="nlpImage01"
                                    boxSize="80%" objectFit="contain"
                                />
                            </VStack>

                            {/* テキスト */}
                            <VStack h="100%" w="50%" spacing={3} justify="center">
                                <Heading size="4xl" color={Theme.color.main}>自然言語処理</Heading>
                                <Text>機械学習</Text>
                            </VStack>
                        </HStack>
                    </Box>
                </Box>
                {/* フッター */}
                <Footer />
            </main>
        </>
    )
}