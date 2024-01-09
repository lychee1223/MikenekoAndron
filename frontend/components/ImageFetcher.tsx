import { useEffect, useState } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

const ImageFetcher = (props: any) => {
    const [imageData, setImageData] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/images/${encodeURIComponent(props.path)}`);
            if (!res.ok) {
                return
            }
            const data = await res.blob();
            setImageData(URL.createObjectURL(data));
        };

        fetchImage();
    }, [props.path]);

    return (
        <>
            {imageData ? (
                <Image
                    src={imageData}
                    alt="image"
                    boxSize="100%" objectFit="contain"
                />
            ) : (
                <Text>Error loading image</Text>
            )}
        </>
    );
};

export default ImageFetcher;