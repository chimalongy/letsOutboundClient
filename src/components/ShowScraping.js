import React from 'react'
import "../styles/ShowTasks.css"

import "../styles/ShowScraping.css"

function ShowScraping(props) {
    let data = props.data
    let dataArray = Object.keys(props.data[0])
    let dataValues = Object.values(props.data[0])
    return (
        <div className='show-scraping'>
            <button onClick={() => { console.log(dataArray) }}>click</button>
            <h2>Scraping Result</h2>
            <div className='copy-button'><button className='site-button-short-thin' onClick={() => {
                let scrapedEmails = ""
                for (let i = 0; i < dataValues.length; i++) {
                    if (!dataValues[i] == "") {
                        if (i != dataValues.length - 1) { scrapedEmails += dataValues[i] + "," }
                        else {
                            scrapedEmails += dataValues[i];
                        }
                    }
                }
                const stringWithNewlines = scrapedEmails.replace(/,/g, '\n');
                navigator.clipboard.writeText(stringWithNewlines)
            }}><i class="fa-regular fa-copy"></i>  Copy Emails</button></div>
            <div>{
                dataArray.map((scrapeLink, index) => (
                    <div className='scraped-item'>
                        <div className='scrapedLink'>{scrapeLink}</div>
                        <div className='scrapedemails'>{dataValues[index]}</div>
                    </div>
                ))
            }</div>

        </div>
    )
}

export default ShowScraping