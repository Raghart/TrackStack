import { For, Tag } from "@chakra-ui/react";
import { motion } from "framer-motion";

const GenreTags = ({ selectedGenres } : { selectedGenres: string[] }) => {
    return(
        <For each={selectedGenres.slice(-3).reverse()}>
            {(genre: string) => (
                <motion.div key={genre} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <Tag.Root px={2} py={1} bg="blue.600" borderRadius="full" fontFamily="'Barlow', sans-serif" 
                        fontWeight="600" color="white" fontSize="8px" whiteSpace="nowrap" variant="solid">
                        <Tag.Label>{genre}</Tag.Label>
                    </Tag.Root>
                </motion.div>
            )}
        </For>
    );
};

export default GenreTags;