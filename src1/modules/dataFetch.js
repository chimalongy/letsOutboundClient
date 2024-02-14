
const dataFetch = async (url, requestData) => {
  const issUserLoggedin=!!localStorage.getItem("token");
  
  let token;
  try {
    if (issUserLoggedin){
      token=localStorage.getItem('token');
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: issUserLoggedin ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    };
   
    const response = await fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
        return response.json();
      })
      const data = await response;
      return data;

  } catch (error) {
   return error;
  }
};

export default dataFetch;