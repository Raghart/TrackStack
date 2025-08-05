import { Text } from "@chakra-ui/react";

const PlayingTime = ({ currentTime }: { currentTime: number }) => {
    return(
        <Text color="gray.300" fontSize="13px" hideBelow="md" userSelect="none" data-testid="currentTime">
            {`0:${currentTime < 10 ? "0" : ""}${Math.floor(currentTime)}`}
        </Text>
    );
};

export default PlayingTime;