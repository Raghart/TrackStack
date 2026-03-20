import { Tag } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { SwitchLabelType } from "@/types/RecDataTypes";
import { defaultSwitchStyle, MapSwitchStyles, SwitchStyles } from "@/dynamicCSS/SwitchStyles";
import { RIGHT_SWITCH_PX, tagRBG } from "@/components/constants/TopBarC";

const RightSwitchTag = ({ label, description } : { label: SwitchLabelType, description: string }) => {
    const switchStyle = MapSwitchStyles.get(label) || defaultSwitchStyle;
    return(
        <Tooltip content={description} showArrow openDelay={200} closeDelay={0}
        contentProps={{ css: { "--tooltip-bg": tagRBG(label), color: "white" } }}>
            <Tag.Root size={{ base: "sm", sm: "md", md: "lg", lg: "lg" }} fontFamily="'Barlow', sans-serif" 
            fontWeight="600" px={RIGHT_SWITCH_PX} py={2} color="white" bg={switchStyle.tagBg} 
            borderRadius="full" boxShadow={switchStyle.border}>
                <Tag.Label>{label}</Tag.Label>
            </Tag.Root>
        </Tooltip>
    );
};

export default RightSwitchTag;