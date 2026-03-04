import { AlbumResponse } from "@/types/albumTypes";
import { Image, LinkBox, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import AlbumCardLayer from "./AlbumCardLayer";
import { PATH_CARD_SIZES } from "../constants/ArtistPathC";

const AlbumCard = ({ name, album_cover } : AlbumResponse) => {
    const [loading, setLoading] = useState(true);
    return(
        <LinkBox position="relative" borderRadius="2xl" overflow="hidden" aspectRatio={3/4} w="full" 
            h="full" _hover={{ "& .overlay": { opacity: 1 } }} maxW={PATH_CARD_SIZES} 
            data-testid="ArtistCard">

            <Skeleton position="absolute" loading={loading} borderRadius="2xl" w="full" h="full" inset={0} />
            <Image src={album_cover} onLoad={() => setLoading(false)} w="full" h="full" objectFit="cover"
                borderRadius="2xl" opacity={loading ? 0 : 1} transform={loading ? "scale(0.95)" : "scale(1)"} 
                transition="opacity 0.5s ease, transform 0.5s ease" alt={`Cover image of the artist ${name}`} />

            <AlbumCardLayer name={name} />
        </LinkBox>
    );
};

export default AlbumCard;