import { createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";
import { genreList } from "../genreIconList";
import { GenreListFormat } from "@/types/genreTypes";

const useGenreCollection = (searchValue: string, selectedGenres: string[]) => {
    return useMemo(() => {
        const filteredItems =  genreList.filter((item: GenreListFormat) => 
                item.name.toLowerCase().includes(searchValue.toLowerCase()) && !selectedGenres.includes(item.name));

        return createListCollection({ items: filteredItems,
            itemToValue: (item) => item.name,
            itemToString: (item) => item.name,
    });    
    }, [searchValue, selectedGenres]);
};

export default useGenreCollection;