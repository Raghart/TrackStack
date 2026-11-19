import { SwitchLabelType } from "@/types/RecDataTypes";
import { useState } from "react";
import { PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "@/store";
import { getSwitchValue } from "@/Utils/getSwitchValue";

const useSwitchValue = (title: string, leftTag: SwitchLabelType, rightTag: SwitchLabelType, 
    setValue: (value: number) => PayloadAction<number>) => {
    const [switchTagValue, setSwitchValueTag] = useState<SwitchLabelType>(leftTag);

    const toggleSwitchValue = () => {
        return (dispatch: AppDispatch) => {
            const newLabel = switchTagValue === leftTag ? rightTag : leftTag;
            const switchValue = getSwitchValue(title, newLabel);
            setSwitchValueTag(newLabel);
            dispatch(setValue(switchValue));
        };
    };

    return { switchTagValue, toggleSwitchValue };
};

export default useSwitchValue;