import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    isLoginModalOpen: false,
    notificationDataLength: 0,
    showNotification: false,
    isLangChange: false,
    rssFeedViewCategory: null
}

export const helperSlice = createSlice({
    name: "helper",
    initialState,
    reducers: {
        setLoginModal: (state, action) => {
            const { openModal } = action.payload.data
            state.isLoginModalOpen = openModal;
        },
        setNotificationData: (state, action) => {
            const { length } = action.payload.data
            state.notificationDataLength = length;
        },
        showNotification: (state, action) => {
            const { show } = action.payload.data
            state.showNotification = show;
        },
        isLangChange: (state, action) => {
            const { change } = action.payload.data
            state.isLangChange = change;
        },
        setRssFeedViewCategory: (state, action) => {
            const { data } = action.payload.data
            state.rssFeedViewCategory = data;
        }

    }
});

export const { setLoginModal, setNotificationData, showNotification, isLangChange, setRssFeedViewCategory } = helperSlice.actions;
export default helperSlice.reducer;

export const setLoginModalState = data => {
    store.dispatch(setLoginModal({ data }))
}

export const setNotificationDataLength = data => {
    store.dispatch(setNotificationData({ data }))
}

export const showNotificationState = data => {
    store.dispatch(showNotification({ data }))
}

export const isLangChangeState = data => {
    store.dispatch(isLangChange({ data }))
}

export const setRssFeedViewCategoryState = data => {
    store.dispatch(setRssFeedViewCategory({ data }))
}


export const selectHelperState = (state) => state.helper;

export const checkIsLoginModalOpen = createSelector(
    [selectHelperState],
    (helper) => helper.isLoginModalOpen
);

export const notificationDataLength = createSelector(
    [selectHelperState],
    (helper) => helper.notificationDataLength
);

export const checkShowNotification = createSelector(
    [selectHelperState],
    (helper) => helper.showNotification
);

export const checkIsLangChange = createSelector(
    [selectHelperState],
    (helper) => helper.isLangChange
);

export const rssFeedViewAllCateIds = createSelector(
    [selectHelperState],
    (helper) => helper.rssFeedViewCategory
);
