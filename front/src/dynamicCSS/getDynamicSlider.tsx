import { SliderTitles } from "@/types/RecDataTypes";
import { defaultSliderStyle, MapSliderStyles, SliderStyles } from "./SliderStyles";
import { Icon } from "@chakra-ui/react";

export const getSliderStyle = (title: SliderTitles, value: number) => {
    const style = MapSliderStyles.get(title) || defaultSliderStyle;
    const [lowBg, midBg, HighBg] = style.SliderBg;
    const [lowIcon, midIcon, HighIcon] = style.Icon;
    const [lowIconCol, midIconCol, HighIconCol] = style.IconColor;
    const [lowBorder, midBorder, HighBorder] = style.IconBorder;
    const [lowShadow, midShadow, HighShadow] = style.shadow;
    const idx = value < style.threshold[0] ? 0 : value < style.threshold[1] ? 1 : 2;
    
    switch (true) {
        case value < style.threshold[0]: {
            return {
                Bg: lowBg,
                Icon: <Icon as={lowIcon} color={lowIconCol} />,
                IconBorder: lowBorder,
                Shadow: lowShadow,
            }
        }
        case value < style.threshold[1]: {
            return {
                Bg: midBg,
                Icon: <Icon as={midIcon} color={midIconCol} />,
                IconBorder: midBorder,
                Shadow: midShadow,
            }
        }
        default: {
            return {
                Bg: HighBg,
                Icon: <Icon as={HighIcon} color={HighIconCol} />,
                IconBorder: HighBorder,
                Shadow: HighShadow,
            }
        }
    }
};