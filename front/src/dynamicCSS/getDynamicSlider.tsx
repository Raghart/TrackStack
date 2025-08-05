import { SliderTitles } from "@/types/RecDataTypes";
import { SliderStyles } from "./SliderStyles";
import { Icon } from "@chakra-ui/react";

export const getSliderStyle = (title: SliderTitles, value: number) => {
    const style = SliderStyles[title];
    const idx = value < style.threshold[0] ? 0 : value < style.threshold[1] ? 1 : 2;
    
    return {
        Bg: style.SliderBg[idx],
        Icon: <Icon as={style.Icon[idx]} color={style.IconColor[idx]} />,
        IconBorder: style.IconBorder[idx],
        Shadow: style.shadow[idx]
    };
};