import { deleteLastGenre } from "@/reducers/recommendReducer";
import { AppDispatch } from "@/store";

const handleDelLastGenre = (e: React.KeyboardEvent<HTMLInputElement>, selectedGenres: string[],
    setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>) => {
    return (dispatch: AppDispatch) => {
        if ((e.key === "Backspace" || e.key === "delete") && selectedGenres.length > 0 && !e.currentTarget.value) {
            setSelectedGenres((prev) => prev.slice(0, -1));
            dispatch(deleteLastGenre());
            e.preventDefault();
        };
    };
};

export default handleDelLastGenre;