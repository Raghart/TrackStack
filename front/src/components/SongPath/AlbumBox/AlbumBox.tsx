import { ALBUMBOX_FONTSIZE, ALBUMBOX_LINECLAMPS, ALBUMBOX_PADDING, ALBUMBOX_SHADOW, ALBUMBOX_TITLE_FONTSIZE } from "@/components/constants/SongDetailsC";
import { LinkOverlay, Heading, Flex, LinkBox } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";

const AlbumBox = ({ album_name }: { album_name: string }) => {
    return(
        <Flex as={LinkBox} direction="column"textAlign="center" color="white" border="6px solid" borderRadius="xl" 
            borderColor="orange.600" transition="transform 0.3s ease, box-shadow 0.3s ease" backdropFilter="blur(10px)" 
            _hover={{ transform: "scale(1.05)", boxShadow: ALBUMBOX_SHADOW }} justify="center" h="full" maxH="full"
            p={ALBUMBOX_PADDING} textShadow="0 1px 3px black">

                <Zoom triggerOnce direction="left" delay={100}>
                    <Heading color="yellow.400" letterSpacing="wider" fontWeight="700" 
                        fontFamily="'Barlow Condensed', sans-serif" fontSize={ALBUMBOX_TITLE_FONTSIZE}>
                        ALBUM
                    </Heading>
                </Zoom>

                <LinkOverlay href={`/albums/${encodeURIComponent(album_name)}`} lineHeight={1} color="orange.400"
                    lineClamp={ALBUMBOX_LINECLAMPS} transition="color 0.3s ease" fontSize={ALBUMBOX_FONTSIZE}
                    _hover={{ color: "orange.500", textDecoration: "none" }} fontFamily="'Barlow', sans-serif"
                    fontWeight="700">
                        <Zoom triggerOnce direction="right" delay={100}>
                            {album_name}
                        </Zoom>
                </LinkOverlay>
        </Flex>
    );
};

export default AlbumBox;