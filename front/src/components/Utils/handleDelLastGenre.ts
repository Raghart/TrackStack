import { deleteLastGenre } from "@/reducers/recommendReducer";
import { AppDispatch } from "@/store";
import { GenreListFormat } from "@/types/genreTypes";
import { ListCollection } from "@chakra-ui/react";

const handleDelLastGenre = (e: React.KeyboardEvent<HTMLInputElement>, selectedGenres: string[],
    setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>, collection: ListCollection<GenreListFormat>,
    isNavigating: boolean) => {
    return (dispatch: AppDispatch) => {
        if ((e.key === "Backspace" || e.key === "delete") && selectedGenres.length > 0 && !e.currentTarget.value) {
            setSelectedGenres((prev) => prev.slice(0, -1));
            dispatch(deleteLastGenre());
            e.preventDefault();
        };
        
        if (e.key === "Enter" && collection.items.length > 0 && !isNavigating) {
            setSelectedGenres((prev) => [...prev, collection.items[0].name]);
        };
    };
};

export default handleDelLastGenre;