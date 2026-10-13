"use client";
import { store } from "@/components/store/store";
import localeTranslations from './locale/en.json';

export const translate = (label) => {

    /*Set default Label only if you want custom label */
    let langLabel =
        store.getState().languages?.currentLanguageLabels.data &&
        store.getState().languages?.currentLanguageLabels.data[label];
    let enTranslation = localeTranslations


    if (langLabel) {
        return langLabel;
    } else {
        return enTranslation[label];
    }
};