import React, { useState } from 'react'
import dataFetch from '../modules/dataFetch';
import { useDispatch, useSelector } from 'react-redux';
function EmailScraper() {

    const [weblinks, setWebLinks] = useState('');
    const [isTextValid, setTextValid] = useState(true);
    const [listError, setListError] = useState("");
    const port=""
  
    const user = useSelector((state) => state.user.userData);
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

    }





    
    const handleSubmit = (event) => {
        event.preventDefault();
        function extractDomain(link) {
            const parsedUrl = new URL(link);
            let domain = parsedUrl.hostname;
            // Remove 'www.' if it exists
            domain = domain.replace(/^www\./, '');
          
            return domain;
          }
        if (verifyLinks()) {
            let linkDomains=[]
           for (let i=0; i<verifiedLinks.length; i++){
                
                linkDomains.push(extractDomain(verifiedLinks[i]))
           }
           
          let requestData={
                ownerAccount:user.email,
                domains:linkDomains,
          }

          let url= port+"/scrapEmails"
          dataFetch(url, requestData)
          .then(result=>{
            console.log(result.message)
          })
          .catch(err=>console.log(err))

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