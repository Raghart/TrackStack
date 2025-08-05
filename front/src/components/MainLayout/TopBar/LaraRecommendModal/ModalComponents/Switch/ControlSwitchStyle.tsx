import { leftTagSet } from "@/components/constants/TopBarC";
import { SwitchStyle } from "@/types/modalCssTypes";
import { SwitchLabelType } from "@/types/RecDataTypes";
import { Icon, Switch } from "@chakra-ui/react";

const ControlSwitchStyle = ({ switchValue, leftTag, rightTag } : { switchValue: SwitchLabelType, leftTag: SwitchStyle, 
    rightTag: SwitchStyle }) => {
    return(
        <Switch.Control w="100%" h="100%" bg={leftTag.ThumbBackgroundBg} _checked={{ bg: rightTag.ThumbBackgroundBg }} 
            borderRadius="full" alignItems="center" transition="all 0.2s ease-in-out" display="flex"
            boxShadow={leftTagSet.has(switchValue) ? leftTag.border : rightTag.border}>

            <Switch.Thumb bg={leftTagSet.has(switchValue) ? leftTag.ThumbBg : rightTag.ThumbBg} display="flex"
                boxSize="34px" borderRadius="full" transition="transform 0.2s" boxShadow="base"
                transform={leftTagSet.has(switchValue) ? "translate(0)" : "translateX(22px)"}
                alignItems="center" justifyContent="center">

                <Switch.ThumbIndicator fallback={<Icon as={leftTag.ThumbIcon} boxSize="21px" color={leftTag.IconColor} />}>
                    <Icon as={rightTag.ThumbIcon} boxSize="21px" color={rightTag.IconColor} />
                </Switch.ThumbIndicator>
            </Switch.Thumb>

            <Switch.Indicator fallback={<Icon as={leftTag.ThumbBackgroundIcon} boxSize="21px" 
                color={leftTag.BackgroundIconColor} />} ml={leftTagSet.has(switchValue) ? "6": "0"} 
                mr={leftTagSet.has(switchValue) ? "0": "6"}>
                <Icon as={rightTag.ThumbBackgroundIcon} boxSize="21px" color={rightTag.BackgroundIconColor}/> 
            </Switch.Indicator>
        </Switch.Control>
    );
};

export default ControlSwitchStyle;