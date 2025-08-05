import { Box, Image, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import ArtLandInfo from "./ArtLandInfo";
import { ArtistResponse } from "@/types/artistTypes";

const LandpageArtistCard = ({  name, album_cover } : ArtistResponse) => {
    const [loading, setLoading] = useState<boolean>(true);
    return(
        <Box position="relative" borderRadius="2xl" overflow="hidden" aspectRatio={1} w="full" h="full" 
            _hover={{ "& .overlay": { opacity: 1 } }} maxW="103px">

            <Image src={album_cover} onLoad={() => setLoading(false)} transform={loading ? "scale(0.95)" : "scale(1)"} 
                objectFit="cover" borderRadius="2xl" opacity={loading ? 0 : 1} w="full" h="full"
                transition="transform 0.5s ease, opacity 0.5s ease" />

            <Skeleton position="absolute" loading={loading} borderRadius="2x1" w="full" h="full" inset={0} /> 
            <ArtLandInfo name={name} />
        </Box>
    );
};

export default LandpageArtistCard;