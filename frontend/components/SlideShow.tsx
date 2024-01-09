import { useState } from 'react';
import { Image, Box, HStack, IconButton } from '@chakra-ui/react';
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"
import ImageFetcher from "@/components/ImageFetcher";

function SlideShow(props: any) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = props.imageList.length;

    const handleNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    const handlePrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    };

    return (
        <HStack h="100%">
            {/* 前へ ボタン */}
            <IconButton
                onClick={handlePrevSlide}
                icon={<FaArrowCircleLeft />}
                h="100%" fontSize="30px"
                aria-label={''}
            />
            {/* 画像 */}
            <Box h="100%" m="auto" pointerEvents="none">
                <ImageFetcher 
                    path={props.imageList[currentIndex].path}
                />
            </Box>
            {/* 次へ ボタン */}
            <IconButton
                onClick={handleNextSlide}
                icon={<FaArrowCircleRight />}
                h="100%" fontSize="30px"
                aria-label={''}
            />
        </HStack>
    );
}

export default SlideShow;