import { Tag } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { SwitchLabelType } from "@/types/RecDataTypes";
import { SwitchStyles } from "@/dynamicCSS/SwitchStyles";
import { LEFT_SWITCH_PX, tagLBG } from "@/components/constants/TopBarC";

const LeftSwitchTag = ({ label, description } : { label: SwitchLabelType, description: string }) => {
    return(
        <Tooltip content={description} showArrow openDelay={200} closeDelay={0}
            contentProps={{ css: { "--tooltip-bg": tagLBG(label), color: "white" } }}>
            <Tag.Root color="white" bg={SwitchStyles[label].tagBg} boxShadow={SwitchStyles[label].border} 
                fontWeight="600" borderRadius="full" fontSize="x1" fontFamily="'Barlow', sans-serif"
                size={{ base: "sm", sm: "md", md: "lg", lg: "lg" }} px={LEFT_SWITCH_PX} py={2}>
                <Tag.Label>{label}</Tag.Label> 
            </Tag.Root>
        </Tooltip>
    );
};

export default LeftSwitchTag;