import { Text } from "@chakra-ui/react";

const SongDuration = ({ duration } : { duration: number }) => {
    return(
        <Text color="gray.300" fontSize="13px" hideBelow="md" userSelect="none">
            {`0:${Math.floor(duration)}`}
        </Text>
    );
};

export default SongDuration;