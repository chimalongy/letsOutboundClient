import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dataFetch from "../modules/dataFetch";
import useDataUpdater from '../modules/useDataUpdater';

function AddScraping(props) {
    const port = ""
    const { refreshUserOutbounds } = useDataUpdater()
    const { refreshUserEmails } = useDataUpdater()
    const { refreshUserTasks } = useDataUpdater()
    const { refreshUserScraping } = useDataUpdater()
    const user = useSelector((state) => state.user.userData);
    const [errorMessage, setErrorMessage] = useState("")
    const [sucessMessage, setSucessMessage] = useState("")
    const [loadingAddScrape, setLoadingAddScrape] = useState(false)

    const [formData, setformData] = useState({
        scrapeName: "",
        scrapeLinks: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value,
        });
    };


    function verifyInputs() {

        const lines = formData.scrapeLinks.split('\n');
        const validLinksArray = [];
        const urlRegex = /(http(s)?:\/\/[^\s]+)/g;
        let invalidLinks = lines.filter(line => !line.match(urlRegex))
        console.log(invalidLinks)
        if (!formData.scrapeName.trim()) {
            setErrorMessage("Please add a name")
            return false
        }
        else if (!formData.scrapeLinks.trim()) {
            setErrorMessage("Please add a links")
            return false
        }
        if (invalidLinks.length > 0) {
            setErrorMessage(`Some links are invalid\n ${invalidLinks}`)
            return false
        }
        else {
            return true
        }
    }

    async function handleSubmit() {
        if (verifyInputs()) {
            setLoadingAddScrape(true)

            const links = formData.scrapeLinks.split('\n')


            let requestData = {
                ownerAccount: user.email,
                scrapeName: formData.scrapeName.trim().toLowerCase(),
                scrapeLinks: links
            }
            let url = port + "/registerscrape"
            let result = await dataFetch(url, requestData)

            if (result === "scraping-registered") {
                setSucessMessage("We have added your scrapping request in the scrapping queue.\nResults will be available on your dashboard soon.")
                setTimeout(() => {
                    refreshUserOutbounds({ ownerAccount: user.email })
                    refreshUserTasks({ ownerAccount: user.email })
                    refreshUserEmails({ ownerAccount: user.email })
                    refreshUserScraping({ ownerAccount: user.email })
                    props.openModal(false);
                }, 2500)
            }
            else if (result === "scraping-exist") {
                setLoadingAddScrape(false)
                setErrorMessage("This scrapping name is registered")
            }
            else {
                setLoadingAddScrape(false)
                setErrorMessage("An error occured")
            }




        }
    }
    return (
        <div className='form-holder'>
            <h2>Add Scrape</h2>
            <form onSubmit={(e) => { e.preventDefault() }}>
                {errorMessage && <div className='form-error-container'><p className='error'><i class="fa-solid fa-circle-exclamation"></i> {errorMessage}</p></div>}
                {sucessMessage && <div className='form-error-container'><p className='sucess'><i class="fa-solid fa-circle-exclamation"></i> {sucessMessage}</p></div>}

                <div>
                    <input
                        type="text"
                        id="scrapeName"
                        name="scrapeName"
                        value={formData.scrapeName}
                        onChange={handleChange}
                        placeholder="Scrape name"
                    />
                </div>
                <div>
                    <textarea
                        id="scrapeLinks"
                        name="scrapeLinks"
                        value={formData.scrapeLinks}
                        onChange={handleChange}
                        rows={8}
                        placeholder="links (one email per line)"
                    />
                </div>
                <button onClick={() => { if (!loadingAddScrape) { handleSubmit() } }}>{loadingAddScrape ? <i className="fa-solid fa-spinner fa-spin spinner"></i> : <p>Add Oubound</p>}</button>
            </form>
        </div>
    )
}

export default AddScraping