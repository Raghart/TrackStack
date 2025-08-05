import { ART_IMG_SIZES } from "@/components/constants/TrackSearchC";
import { ArtistResponse } from "@/types/artistTypes";
import { Image, LinkOverlay, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

const ArtistImage = ({ name, album_cover } : ArtistResponse ) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    return(
        <LinkOverlay href={`/artists/${encodeURIComponent(name)}`}>
            <Skeleton position="absolute" loading={isLoading} rounded="full" boxSize={ART_IMG_SIZES} />

            <Image boxSize={ART_IMG_SIZES} objectFit="cover" src={album_cover} alt={`Cover of the artist ${name}`} 
            rounded="full" transition="all 0.5s ease" onLoad={() => setIsLoading(false)} 
            opacity={isLoading ? 0 : 1} transform={isLoading ? "scale(0.95)" : "scale(1)"} />
        </LinkOverlay>
    );
};

export default ArtistImage;