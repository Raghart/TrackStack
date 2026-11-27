import { ALBUM_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { Image, LinkOverlay, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

const SpotAlbumImg = ({ name, album_cover } : { name: string, album_cover: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    return(
        <LinkOverlay href={`/albums/${encodeURIComponent(name)}`}>
            <Skeleton position="absolute" loading={isLoading} rounded="2xl" boxSize={ALBUM_IMG_SIZES} />  

            <Image src={album_cover} objectFit="cover" rounded="2xl" alt={`Cover of the album ${name}`} 
                onLoad={() => setIsLoading(false)} opacity={isLoading ? 0 : 1} 
                transition="opacity 0.5s ease, transform 0.5s ease"
                transform={isLoading ? "scale(0.95)" : "scale(1)"} boxSize={ALBUM_IMG_SIZES} />
        </LinkOverlay>
    );
};

export default SpotAlbumImg;