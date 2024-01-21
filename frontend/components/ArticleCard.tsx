import {
    Box,
    VStack,
    HStack,
    Heading,
    Card,
    CardBody,
    Image,
    Text,
    Tag,
    TagLabel,
    AspectRatio
} from "@chakra-ui/react"

import Theme from "@/components/Theme";
import ImageFetcher from "@/components/ImageFetcher";

function ArticleCard(props: any) {
    // 画像が紐づいていない記事のパス
    const defaultImagePath = "/img/default_thumbnail.png";

    return (
        <>
                <Card p={1} aspectRatio={1} bg={Theme.color.backgroundC}>
                    <CardBody>
                        {/* サムネ */}
                        <AspectRatio ratio={10/6}>
                            {props.thumbnail_path ? (
                                <ImageFetcher 
                                    path={props.thumbnail_path}
                                />
                            ) : (
                                <Image
                                    src={defaultImagePath}
                                    alt="image"
                                    boxSize="100%" objectFit="contain"
                                />
                            )}                            
                        </AspectRatio>

                        {/* 見出し */}
                        <Box h="40%" pt={2}>
                            <VStack>
                                <HStack w="100%">
                                    {/* タグ */}
                                    <Tag
                                        borderRadius="full"
                                        variant="solid"
                                        colorScheme={props.tagColor}
                                        mr="auto"
                                    >
                                        <TagLabel>{props.tag}</TagLabel>
                                    </Tag>

                                    {/* 更新日時 */}
                                    <Text>
                                        {props.date.replace(/T.*/, "")}
                                    </Text>
                                </HStack>

                                {/* タイトル */}
                                <Heading size="md" color={Theme.color.main}>{props.title}</Heading>
                            </VStack>
                        </Box>
                    </CardBody>
                </Card>
        </>
    )
}

export default ArticleCard;