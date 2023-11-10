// import React, {useState} from 'react'

// function UserScraping() {
//   const [inputText, setInputText] = useState('');
//   const [isValid, setIsValid] = useState(true);
//   const [validLinks, setValidLinks] = useState([]);
//   const [validDomains, setValidDomains] = useState([]);

//   const extractDomainName = (url) => {
//     try {
//       const parsedUrl = new URL(url);
//       return parsedUrl.hostname
//     } catch (error) {
//       return false
//     }
//   };
  

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const verifyLinks = () => {
//     const lines = inputText.split('\n');
//     const validLinksArray = [];

//     for (const line of lines) {
//       const urlRegex = /(http(s)?:\/\/[^\s]+)/g;
//       const links = line.match(urlRegex);

//       if (links && links.length > 0) {
//         validLinksArray.push(links[0]);
//       }
//     }

//     if (validLinksArray.length > 0) {
//       setIsValid(true);
//       setValidLinks(validLinksArray);

//       for (let i=0; i<validLinks.length; i++){
//         let domainName = extractDomainName(validLinks[i])
//         if (domainName!==false){
//           setValidDomains((previousState)=>[...previousState, domainName])
//         }
//       }
      
//     } else {
//       setIsValid(false);
//       setValidLinks([]);
//     }
//   };

//   return (
//     <div>
//       <p>List Websites</p>
//       <textarea
//         rows={5}
//         cols={30}
//         value={inputText}
//         onChange={handleInputChange}
//       />
//       <br />
//       <button onClick={verifyLinks}>Verify Links</button>
//       {isValid ? (
//         <div>
//           <p>Valid links found in the input:</p>
//           <ul>
//             {validDomains.map((link, index) => (
//               <li key={index}>
//                 <a href={link} target="_blank" rel="noopener noreferrer">
//                   {link}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No valid links found in the input.</p>
//       )}
//     </div>
//   )
// }

// export default UserScraping

import React from 'react'
import EmailScraper from './EmailScraper'

function UserScraping() {
  return (
    <div><EmailScraper/></div>
  )
}

export default UserScraping