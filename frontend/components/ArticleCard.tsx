import {
    Box,
    VStack,
    Heading,
    Card,
    CardBody,
    Image,
    Tag,
    TagLabel,
} from "@chakra-ui/react"

import Theme from "@/components/Theme";
import ImageFetcher from "@/components/ImageFetcher";

function ArticleCard(props: any) {
    return (
        <>
            <Card p={1} aspectRatio={1} bg={Theme.color.backgroundC}>
                <CardBody>
                    {/* サムネ */}
                    <Box h="60%">
                        <ImageFetcher 
                            path={props.thumbnail_path}
                        />
                    </Box>

                    {/* 見出し */}
                    <Box h="40%" pt={2}>
                        <VStack>
                            {/* タグ */}
                            <Tag
                                borderRadius="full"
                                variant="solid"
                                colorScheme={props.tagColor}
                                mr="auto"
                            >
                                <TagLabel>{props.tag}</TagLabel>
                            </Tag>

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