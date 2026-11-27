import { ART_RESULTS_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

const ArtistSearchImg = ({ album_cover } : { album_cover: string }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    return(
        <>
            <Skeleton position="absolute" loading={isLoading} rounded="full" boxSize={ART_RESULTS_IMG_SIZES} />
            <Image src={album_cover} objectFit="cover" rounded="full" onLoad={() => setIsLoading(false)} 
                opacity={isLoading ? 0 : 1} transform={isLoading ? "scale(0.95)" : "scale(1)"} 
                alt={`Cover image of the artist ${name}`} transition="opacity 0.5s ease, transform 0.5s ease" 
                boxSize={ART_RESULTS_IMG_SIZES} />
        </>
    );
};

export default ArtistSearchImg;