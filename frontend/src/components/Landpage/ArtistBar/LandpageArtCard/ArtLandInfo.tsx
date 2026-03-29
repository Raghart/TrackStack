import { LinkBox, LinkOverlay } from "@chakra-ui/react";

const ArtLandInfo = ({ name } : { name: string }) => {
    return(
        <LinkBox className="overlay" position="absolute" inset={0} w="full" h="full" p={1} display="flex" 
            alignItems="center" justifyContent="center" opacity={0} borderRadius="2xl"
            transition="opacity 0.3s ease" bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(6px)">

            <LinkOverlay href={`/artists/${encodeURIComponent(name)}`} fontWeight="700" textAlign="center" 
                lineHeight={1} fontSize="17px" color="yellow.500" fontStyle="italic" lineClamp={3} 
                fontFamily="'Barlow', sans-serif" overflow={name.length < 10 ? "visible" : "hidden"}>
                {name}
            </LinkOverlay>
        </LinkBox>
    );
};

export default ArtLandInfo;