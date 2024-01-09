import Link from "next/link";

import { useState, useEffect } from 'react';
import {
    Box,
    HStack,
    Heading,
    Tabs,
    TabList,
    Tab,
    IconButton,
    Divider,
    Button,
} from "@chakra-ui/react"
import { FaGithub, } from "react-icons/fa"
import { BiLogoGmail, } from "react-icons/bi"
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import Theme from "@/components/Theme";
import MailToIcon from "@/components/MailToIcon"
import LoginButton from "@/components/LoginButton";

const Header = (props: any) =>{
    // 外部リンクの管理
    const URL = {
        github: "https://github.com/lychee1223",
    }

    const router = useRouter()

    // ログアウトボタンが押された際の処理
    const logout = () => {
        Cookies.remove('access_token')
        localStorage.removeItem('isLoggedIn');
        router.reload()
    }

    return (
        <Box w="100%" zIndex="9999" bg={Theme.color.backgroundC}>
            <HStack p={4} justify="center">
                {/* グローバルナビ */}
                <Box flex="1">
                    <Tabs colorScheme="blue" variant="soft-rounded" defaultIndex={props.defaultIndex}>
                        <TabList>
                            <Link href="/">
                                <Tab>Top</Tab>
                            </Link>
                            <Link href="/about">
                                <Tab>About</Tab>
                            </Link>
                            <Link href="/works">
                                <Tab>Works</Tab>
                            </Link>
                            <Link href="/blog">
                                <Tab>Blog</Tab>
                            </Link>
                        </TabList>
                    </Tabs>
                </Box>

                {/* サイト名 */}
                <Box flex="1">
                    <Link href="/">
                        <Heading textAlign="center" size="lg" color={Theme.color.main}>三毛猫のアンドロン</Heading>
                    </Link>                    
                </Box>

                <Box flex="1">
                    <HStack spacing={2} justify="flex-end">
                        {/* 外部リンクへのアクセス */}
                        <IconButton
                            as="a"
                            href={URL.github}
                            target="_blank"
                            aria-label="GitHub"
                            icon={<FaGithub />}
                            fontSize={30}
                        />
                        <MailToIcon icon={<BiLogoGmail />} fontSize={30} />

                        {/* ログイン、ログアウトボタン */}
                        <Box>
                            {props.isLoggedIn ? (
                                <Button onClick={logout} width='110px'>ログアウト</Button>
                            ) : (
                                <LoginButton />
                            )}
                        </Box>
                    </HStack>                
                </Box>
            </HStack>
            <Divider
                boxShadow="0px 2px 4px rgba(0, 0, 0, 0.5)"
            />
        </Box>

    );
}

export default Header;