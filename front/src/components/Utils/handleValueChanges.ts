import { setRecommendedGenres } from "@/reducers/recommendReducer";
import { AppDispatch } from "@/store";
import { Combobox } from "@chakra-ui/react";

const handleValueChange = (details: Combobox.ValueChangeDetails, 
    setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>,
    setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>,) => {
    return (dispatch: AppDispatch) => {
        setIsNavigating(false);
        setSelectedGenres(details.value);
        dispatch(setRecommendedGenres(details.value));
    };
};

export default handleValueChange;