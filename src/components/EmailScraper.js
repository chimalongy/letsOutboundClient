import React, { useState } from 'react'

function EmailScraper() {

    const [weblinks, setWebLinks] = useState('');
    const [isTextValid, setTextValid] = useState(true);
    const [listError, setListError] = useState("");


    let verifiedLinks = []

    const handleTextChange = (e) => {
        setWebLinks(e.target.value)
    };

    function verifyLinks() {
        let links = weblinks.split('\n')
        //    console.log(links)
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        let validList = true
        for (let i = 0; i < links.length; i++) {
            if (!urlPattern.test(links[i])) {
                validList = false
            }
        }

        if (validList) {
            verifiedLinks = links
            setListError("")
            return true
        }
        else {
            setListError("Some inputs are not valid links")
            return false
        }


        // const webAddress = 'https://anthonysylvan.com/locations/texas/katy/?adsrc=YEXT';
        // const url = new URL(webAddress);
        // const domainName = url.hostname;
        // console.log(domainName); // This will print 'anthonysylvan.com'




    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (verifyLinks()) {
            let linkDomains=[]
           for (let i=0; i<verifiedLinks.length; i++){
                const url = new URL(verifiedLinks[i]);
                linkDomains.push(url.hostname)
           }
           console.log(linkDomains)
        }

    };

    return (
        <div>
            <div className='form-holder'>

                <form onSubmit={handleSubmit}>
                    {listError && <p className='error'>{listError}</p>}
                    <label>
                        Web Addresses:
                        <textarea
                            value={weblinks}
                            onChange={handleTextChange}
                            rows={10}
                        />
                    </label>
                    {!isTextValid && <p style={{ color: 'red' }}>Text cannot be empty.</p>}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default EmailScraper