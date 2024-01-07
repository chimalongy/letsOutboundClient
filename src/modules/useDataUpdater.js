import { useState } from 'react';
import dataFetch from './dataFetch';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../modules/redux/userDataSlice';
import { setUserEmails } from '../modules/redux/userEmailsSlice';
import { setUserOutbounds } from '../modules/redux/userOutboundsSlice';
import { setUserTasks } from '../modules/redux/userTasksSlice';
import { setUserScrapings } from "../modules/redux/userScrapingsSlice"

const useDataUpdater = () => {

    const user = useSelector((state) => state.user.userData);
    const uEmails = useSelector((state) => state.userEmails.userEmails);
    const dispatch = useDispatch();
    const port = ""

    async function refreshUserOutbounds(requestData) {
        let url = port + '/getuseroutbounds'
        const result = await dataFetch(url, requestData)
        if (result.message === "outbounds-found") {
            const userOutbounds = result.data;
            dispatch(setUserOutbounds({
                outbounds: userOutbounds
            }))
            console.log("outbound refreeshed")
        }

    }
    async function refreshUserEmails(requestData) {
        let url = port + '/getuseroutboundemails'
        const result = await dataFetch(url, requestData)
        if (result.message === "emails-found") {
            const userEmails = result.data;
            dispatch(setUserEmails({
                emails: userEmails
            }))
        }

    }
    async function refreshUserTasks(requestData) {
        let url = port + '/getusertasks'
        const result = await dataFetch(url, requestData)
        if (result) {
            const userTasks = result.data
            dispatch(setUserTasks({
                task: userTasks
            }))
        }

    }
    async function refreshUserScraping(requestData) {
        let url = port + '/getuserscrapings'
        const result = await dataFetch(url, requestData)
        if (result) {
            const userScrapings = result.data
            console.log(result.data)
            dispatch(setUserScrapings({
                scrapings: userScrapings
            }))
        }

    }

    return {
        refreshUserOutbounds,
        refreshUserEmails,
        refreshUserTasks,
        refreshUserScraping
    }
}


export default useDataUpdater;