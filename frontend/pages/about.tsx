import Head from "next/head"
import styles from "@/styles/Home.module.css"
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Image,
    SimpleGrid
} from "@chakra-ui/react"
import { FaUnity, FaPython, } from "react-icons/fa"
import { SiUnrealengine, SiCplusplus, } from "react-icons/si"

import Theme from "@/components/Theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {

    // スキルリスト
    const SKILL_LIST = [
        {
            header: "Unity",
            icon: <FaUnity size="90%" />,
            body: "UniTaskを用いた非同期処理の実装, PUNを用いた簡単なマルチゲームのチーム開発経験あり"
        },
        {
            header: "UE4 / UE5",
            icon: <SiUnrealengine size="80%" />,
            body: "GASを用いたアクションゲームのチーム開発経験あり. 現在C++での開発を勉強中"
        },
        {
            header: "C++",
            icon: <SiCplusplus size="50%" />,
            body: "CUIオセロゲームを開発しました"
        },
        {
            header: "Python",
            icon: <FaPython size="50%" />,
            body: "PyTorchを用いた機械学習"
        },
    ];

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
                <Header defaultIndex={1} isLoggedIn={isLoggedIn}/>

                {/* コンテンツ */}
                <Box className={styles.content}>
                    {/* プロフィール */}
                    <Box h="350px" bg={Theme.color.backgroundA}>
                        <HStack h="100%" spacing={20} >
                            <Image
                                src="/img/icon.png"
                                alt="icon"
                                w="20%"
                                ml="auto"
                            />
                            <VStack h="100%" w="50%" spacing={1} justify="center">
                                <Heading size="3xl" mb={5} mr="auto" color={Theme.color.main}>川田 拓朗</Heading>
                                <Text mr="auto">所属：法政大学 理工学部 応用情報工学科</Text>
                                <Text mr="auto">　　　知的情報処理研究室(彌冨研究室)</Text>
                                <Text mr="auto">email：takuro.kawada.3g@stu.hosei.ac.jp</Text>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* スキル */}
                    <Box p={4} bg={Theme.color.backgroundB}>
                        <VStack h="100%" justify="center" spacing={0}>
                            <Heading size="4xl" mb={4} color={Theme.color.main}>SKILL</Heading>
                        </VStack>
                        <SimpleGrid spacing="15px" minChildWidth="250px">
                            {SKILL_LIST.map((skill, index) => (
                                <Box p={2} aspectRatio={1.5} bg={Theme.color.backgroundC} key={index}>
                                    <HStack h="100%">
                                        {skill.icon}
                                        <VStack mb="auto">
                                            <Heading mr="auto" color={Theme.color.main}>{skill.header}</Heading>
                                            <Text>{skill.body}</Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
                </Box>
                {/* フッター */}
                <Footer />
            </main>
        </>
    )
}
