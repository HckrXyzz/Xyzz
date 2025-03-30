const CLIENT_ID = localStorage.getItem('CLIENT_ID'); 
const API_KEY = localStorage.getItem('API_KEY'); 
const SCOPES = 'https://www.googleapis.com/auth/documents';

function saveData() {
            const dataInput = document.getElementById('dataInput').value;
            localStorage.setItem('xdata', dataInput);
        }

function handleClientLoad() {
            gapi.load('client:auth2', initClient);
        }

function initClient() {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
                scope: SCOPES
            }).then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        }

function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                postData();
            } else {
                gapi.auth2.getAuthInstance().signIn();
            }
        }

function postData() {
 const xdata = localStorage.getItem('xdata');
            if (xdata) {
                gapi.client.docs.documents.create({
                    title: 'xdata Document',
                    body: {
                        content: [
                            {
                                textRun: {
                                    content: xdata
                                }
                            }
                        ]
                    }
                }).then(function(response) {
                    console.log('Success:', response);
                }, function(error) {
                    console.error('Error:', error);
                });
            }
        }

setInterval(function() {
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                postData();
            }
        }, 100000);
handleClientLoad();
