import { useMediaQuery } from "@chakra-ui/react";

const TINY_SCREEN_QUERY = ["(max-width: 359px)"];

const useTinyScreen = () => {
    const [isTinyScreen] = useMediaQuery(TINY_SCREEN_QUERY);
    return Boolean(isTinyScreen);
};

export default useTinyScreen;
