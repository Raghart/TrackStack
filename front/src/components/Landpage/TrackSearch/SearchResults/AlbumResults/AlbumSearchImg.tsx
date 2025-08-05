import { ALB_RESULTS_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

const AlbumSearchImg = ({ album_cover } : { album_cover: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    return(
        <>
            <Skeleton position="absolute" loading={isLoading} rounded="2xl" boxSize={ALB_RESULTS_IMG_SIZES} />
            <Image src={album_cover} objectFit="cover" alt={`Cover image of the album ${name}`} rounded="2xl" 
                onLoad={() => setIsLoading(false)} transform={isLoading ? "scale(0.95)" : "scale(1)"} 
                transition="transform 0.5s ease, opacity 0.5s ease" opacity={isLoading ? 0 : 1} 
                boxSize={ALB_RESULTS_IMG_SIZES} />
        </>
    );
};

export default AlbumSearchImg;