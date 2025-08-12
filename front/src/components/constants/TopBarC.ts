import { SwitchLabelType } from "@/types/RecDataTypes";

export const TOPBAR_SIZES = { base:"calc(100% - 155px)", sm:"calc(100% - 205px)", md: "calc(100% - 227px)", 
    lg: "calc(100% - 245px)"};
export const COUNT_FONTSIZE = { base: "16px", sm: "20px", md: "2xl", lg: "2xl"};
export const SONGSTAT_ICON_BOXSIZE = { base: 5, sm: 5, md: 6, lg: 6};
export const BLUE_SHADOW_MODAL = "0 0 12px var(--chakra-colors-blue-500)";
export const DATA_BTN_FONTSIZES = { base: "13px", sm: "15px", md: "20px", lg: "23px"};
export const DATA_BTN_PX = { base: 2, sm: 4, md: 5, lg: 6};
export const DATA_BTN_TRANS = "background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.2s ease-in-out, boxShadow 0.2s ease-in-out"
export const DATA_BTN_SHADOW = "0 0 12px var(--chakra-colors-blue-500)";
export const LARA_HEADER_SIZES = { base: "26px", sm: "6xl", md: "65px", lg: "7xl"};
export const SLIDER_SIZES = { base: "230px", sm: "230px", md: "275px", lg:"300px"};
export const LARA_OPT_SIZES = { base: "300px", sm: "300px", md: "330px", lg: "345px" };
export const SEGMENT_BTN_W = { base: "70px", sm:"70px", md: "85px", lg: "90px"};
export const SEGMENT_FONTSIZE = { base: "12px", sm: "12px", md: "13px", lg:"14px"};
export const SWITCH_BTN_TRANSITION = "box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out";
export const LEFT_SWITCH_PX = { base: 3, sm: 3, md: 3, lg: 4};
export const RIGHT_SWITCH_PX = { base: 3, sm: 3, md: 4, lg: 4 };
export const SLIDER_TAGS_PX_SIZES = { base: 1, sm: 2, md: 3, lg: 3 };
export const SLIDER_TAGS_GAP_SIZES = { base: 5, sm: 5, md: 7, lg: 7 };
export const COUNTBOX_SIZES = { base: "75px", sm: "100px", md: "180px", lg: "180px"};

export const tagRBG = (label: SwitchLabelType) => {
    if (label === "Instrumental") return "colors.cyan.500";
    if (label === "Sad") return "colors.blue.500";
    if (label === "Acoustic") return "colors.green.500";
    return "colors.gray.400";
};

export const tagLBG = (label: SwitchLabelType) => {
    if (label === "Vocals") return "colors.pink.400";
    if (label === "Happy") return "colors.purple.400";
    if (label === "Electronic") return "colors.orange.400";
    return "colors.gray.400";
};

export const leftTagSet = new Set<SwitchLabelType>(["Vocals", "Happy", "Electronic"]);