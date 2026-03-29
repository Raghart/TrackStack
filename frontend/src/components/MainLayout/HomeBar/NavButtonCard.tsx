import { NAV_FONT_SIZES, NAV_ICON_SIZES } from "@/components/constants/HomeBarC";
import { NavItem } from "@/types/utilTypes";
import { Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";

const NavButtonCard = ({ name, bg, hover, iconType, IconColor, path } : NavItem ) => {
    return(
        <LinkBox key={name} bg={bg} _hover={{ bg: hover }} borderRadius="4xl" ml={2} mr={2} display="flex" 
            transition="background-color 0.2s ease-in-out" p={1} alignItems="center" gap={2}>
            <Icon as={iconType} color={IconColor} boxSize={NAV_ICON_SIZES} ml={2} />
            <LinkOverlay href={path} fontWeight="600" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="wide"
                fontSize={NAV_FONT_SIZES}>
                {name}
            </LinkOverlay>   
        </LinkBox>
    );
};

export default NavButtonCard;