import { CloseButton } from "@chakra-ui/react";

const CloseSearchBtn = ({ clearSearch } : { clearSearch: () => void }) => {
    return(
        <CloseButton size="xs" rounded="full" aria-label="Cancel Search" onClick={clearSearch} />
    );
};

export default CloseSearchBtn;