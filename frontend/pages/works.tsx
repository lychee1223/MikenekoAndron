import Head from "next/head"
import styles from "@/styles/Home.module.css"
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import {
    Box,
    HStack,
    VStack,
    Heading,
    Text,
    Divider,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    SimpleGrid,
    Tag,
    TagLabel,
    CloseButton,
} from "@chakra-ui/react"

import Theme from "@/components/Theme";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SlideShow from "@/components/SlideShow";
import CreateArticleButton from '@/components/CreateArticleButton';

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

export default function Home() {
    const TAG_COLOR = {
        unity : "red",
        ue : "messenger",
        ai : "green"
    }

    const tagColorMap = new Map<string, string>();
    tagColorMap.set('Unity', 'red');
    tagColorMap.set('UE', 'messenger');
    tagColorMap.set('AI', 'green');

    // 現在適用しているフィルタ
    const [currentFilterTag, setCurrentFilterTag] = useState(0);
    const handleChangeFilter = (filterID: React.SetStateAction<number>) => {
        setCurrentFilterTag(filterID);
    };

    // 現在表示している作品詳細ページ(-1は作品一覧ページ)
    const [currentWorkPage, setCurrentWorkPage] = useState(-1);
    const handleChangePage = (pageID: React.SetStateAction<number>) => {
        setCurrentWorkPage(pageID);
    };

    //******************************************************/
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        // ログイン状態を確認
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
                setIsLoggedIn(false);
                return
            }

            setIsLoggedIn(true)
            const userData = await res.json();
            setIsAdmin(userData.is_admin);
        }

        // 記事を取得
        const getArticles = async () =>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/articles`)
            if (!res.ok) {
                return
            }
            setArticles(await res.json());
        }
        fetchUser()
        getArticles()
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
                <Header defaultIndex={2} isLoggedIn={isLoggedIn}/>

                {/* コンテンツ */}
                {/* 作品パネル一覧 */}
                {
                    currentWorkPage == -1 &&

                    <Box className={styles.content}>
                        <Tabs colorScheme={Theme.color.colorScheme} defaultIndex={currentFilterTag}>
                            {/* フィルタ選択タブ */}
                            <TabList bg={Theme.color.backgroundA}>
                                <Tab onClick={() => handleChangeFilter(0)}>ALL</Tab>
                                {Array.from(tagColorMap.entries()).map(([tag, color], i) => (
                                    <Tab onClick={() => handleChangeFilter(i + 1)} key={i}>
                                        {tag}
                                    </Tab>
                                ))}
                            </TabList>
                            <Divider
                                boxShadow="0px 2px 4px rgba(0, 0, 0, 0.5)"
                            />
                            {/* 作品一覧 */}
                            <TabPanels bg={Theme.color.backgroundB}>
                                {/* ALL */}
                                <TabPanel>
                                    <SimpleGrid spacing="15px" minChildWidth="250px">
                                        {articles.map((article, i) => (
                                            <Box onClick={() => handleChangePage(i)} key={article.id}>
                                                <ArticleCard
                                                    thumbnail_path={article.images.length > 0 ? article.images[0].path : undefined}
                                                    tag={article.tag}
                                                    tagColor={tagColorMap.get(article.tag)}
                                                    date={article.date}
                                                    title={article.title}
                                                />
                                            </Box>
                                        ))}

                                        {/* 空の要素 */}
                                        <Box aspectRatio={1}></Box> 
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                        <Box aspectRatio={1}></Box>
                                    </SimpleGrid>
                                </TabPanel>

                                {/* 各フィルタをかけた際の一覧 */}
                                {Array.from(tagColorMap.entries()).map(([tag, color], i) => (
                                    <TabPanel key={i}>
                                        <SimpleGrid spacing="15px" minChildWidth="250px">
                                            {articles.map((article, j) => (
                                                (() => {
                                                    // フィルタを適用
                                                    if (article.tag == tag) {
                                                        return (
                                                            <Box onClick={() => handleChangePage(j)} key={article.id}>
                                                                <ArticleCard
                                                                    thumbnail_path={article.images.length > 0 ? article.images[0].path : undefined}
                                                                    tag={article.tag}
                                                                    tagColor={color}
                                                                    date={article.date}
                                                                    title={article.title}
                                                                />
                                                            </Box>
                                                        )
                                                    }
                                                })()
                                            ))}

                                            {/* 空の要素 */}
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                            <Box aspectRatio={1}></Box>
                                        </SimpleGrid>
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </Tabs>
                    </Box>
                }

                {/* 作品紹介ページ */}
                {
                    currentWorkPage != -1 &&

                    <Box className={styles.content}>
                        <Box p={2} bg={Theme.color.backgroundA}>
                            <HStack w="100%">
                                <Tag
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme={tagColorMap.get(articles[currentWorkPage].tag)}
                                    mr="auto" mb="auto"
                                >
                                    <TagLabel>{articles[currentWorkPage].tag}</TagLabel>
                                </Tag>
                                <Heading color={Theme.color.main}>{articles[currentWorkPage].title}</Heading>
                                <CloseButton ml="auto" mb="auto" onClick={() => handleChangePage(-1)} />
                            </HStack>
                        </Box>
                        <Divider
                            boxShadow="0px 2px 4px rgba(0, 0, 0, 0.5)"
                        />

                        {articles[currentWorkPage].images.length > 0 &&
                            <Box h="350px" p={4} bg={Theme.color.backgroundB}>
                                <SlideShow imageList={articles[currentWorkPage].images} />
                            </Box>
                        }

                        <Box h="350px" p={4} bg={Theme.color.backgroundA}>
                            <Box dangerouslySetInnerHTML={{ __html: articles[currentWorkPage].body }} />
                        </Box>

                        {/* コメント機能追加するよ */}
                        <Box h="350px" p={4} bg={Theme.color.backgroundB}>
                            <HStack w="100%">
                                aaa
                            </HStack>
                        </Box>
                    </Box>
                }

                {/* フッター */}
                <Footer />

                {/* 作品追加ボタン */}
                {isLoggedIn && isAdmin && (
                    <CreateArticleButton
                        tagColorMap={tagColorMap}
                        isWorks={true}
                    />
                )}
            </main>
        </>
    )
}
