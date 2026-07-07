 function copyText(text) {
          navigator.clipboard
            .writeText(text)
            .then(() => {
              alert("Copied: " + text);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        }

        // Modal triggers
        function showImage(src) {
          document.getElementById("modalImg").src = src;
          document.getElementById("imgModal").style.display = "flex";
        }

        const fileInput = document.getElementById("fileInput");
        const jsonTextarea = document.getElementById("jsonTextarea");
        const renderBtn = document.getElementById("renderBtn");
        const errorLog = document.getElementById("errorLog");
        const dataTable = document.getElementById("dataTable");

        // Function to handle fetching remote JSON and feeding it into the text environment
        async function fetchJsonAndBuildTable(url) {
          showError(""); // Clear prior messages
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP network error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            // Format layout natively to JSON raw presentation workspace
            jsonTextarea.value = JSON.stringify(data, null, 2);
            
            // Structural checking validation
            if (!Array.isArray(data) || data.length === 0) {
              showError("Invalid structural format: JSON data must be a non-empty Array of objects.");
              return;
            }
            buildTable(data);
          } catch (err) {
            showError("Fetch or Parsing Error: " + err.message);
          }
        }

        // Global event delegation for custom data-url fetch buttons elements
        document.addEventListener("click", function (e) {
          const targetLink = e.target.closest(".fetch-json-btn");
          if (targetLink) {
            e.preventDefault(); // Halt active anchor jumping operations
            const targetUrl = targetLink.getAttribute("data-url");
            if (targetUrl) {
              fetchJsonAndBuildTable(targetUrl);
            } else {
              showError("Configuration error: Missing 'data-url' parameter on target element.");
            }
          }
        });

        // Handle JSON File selection and read into textarea automatically
        fileInput.addEventListener("change", function (e) {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = function (evt) {
            jsonTextarea.value = evt.target.result;
            showError(""); // Reset any prior error message
          };
          reader.readAsText(file);
        });

        // Main action button click listener
        renderBtn.addEventListener("click", function () {
          const rawValue = jsonTextarea.value.trim();
          if (!rawValue) {
            showError("Please paste JSON data or upload a file first.");
            return;
          }

          try {
            const parsedData = JSON.parse(rawValue);
            if (!Array.isArray(parsedData) || parsedData.length === 0) {
              showError(
                "Invalid structural format: JSON data must be a non-empty Array of objects.",
              );
              return;
            }
            showError(""); // Clear errors if valid
            buildTable(parsedData);
          } catch (err) {
            showError("JSON Parsing Error: " + err.message);
          }
        });

        function showError(msg) {
          if (msg) {
            errorLog.innerText = msg;
            errorLog.style.display = "block";
          } else {
            errorLog.style.display = "none";
          }
        }

        function buildTable(data) {
          const thead = dataTable.querySelector("thead");
          const tbody = dataTable.querySelector("tbody");

          // Clear previous runs
          thead.innerHTML = "";
          tbody.innerHTML = "";

          // Establish the header mapping using the index: 1 object
          const headerObj = data.find((item) => item.index === 1);
          if (!headerObj || !headerObj.rowData) {
            showError(
              "Missing structure: Could not find object with index: 1 containing the column header list. Note: Fetched sample APIs may use a different JSON structure than your proprietary layout.",
            );
            return;
          }

          const columns = headerObj.rowData;

          // Trace dynamic action columns indexes
          const refColIdx = columns.findIndex(
            (col) => String(col).trim().toUpperCase() === "REFERENCE NO",
          );
          const imgColIdx = columns.findIndex(
            (col) => String(col).trim().toUpperCase() === "IMAGE LINK",
          );
          const statusColIdx = columns.findIndex(
            (col) => String(col).trim().toUpperCase() === "STATUS",
          );

          // 1. Render Table Head Row
          let headRowHtml = `<tr class="text-center divide-x divide-blue-400 text-lg font-bold"><th class="p-3 border-b border-slate-700">INDEX</th>`;
          columns.forEach((headerText) => {
            headRowHtml += `<th class='p-3 border-b border-slate-700'>${escapeHtml(headerText)}</th>`;
          });
          headRowHtml += "</tr>";
          thead.innerHTML = headRowHtml;

          // 2. Render Table Body Rows (skipping index 1 as it forms our header mapping)
          const rowDataObjects = data.filter((item) => item.index !== 1);

          rowDataObjects.forEach((item) => {
            const indexValue = item.index;
            const cells = item.rowData || [];

            // Validate row target status for selective "ALREADY FOLLOW UP" highlighting
            let rowModifierClass = "";
            if (statusColIdx !== -1 && cells[statusColIdx]) {
              if (
                String(cells[statusColIdx]).trim().toUpperCase() === "ALREADY FOLLOW UP"
              ) {
                rowModifierClass = ' class="status-highlight bg-blue-400 font-bold"';
              }
            }

            let rowHtml = `<tr${rowModifierClass} class="hover:bg-emerald-500"><td class="p-3 border-b border-gray-200 font-bold">${indexValue}</td>`;

            // Loop data values mapped against the explicit headers list length
            for (let i = 0; i < columns.length; i++) {
              const rawCellVal = cells[i] !== undefined ? String(cells[i]).trim() : "";

              // Rule 1: REFERENCE NO -> Text + Dynamic Onclick Clipboard Copy button
              if (i === refColIdx && rawCellVal) {
                rowHtml += `<td class="p-3 border-b border-gray-200 whitespace-nowrap">
                                <span class="font-mono text-slate-700">${escapeHtml(rawCellVal)}</span> 
                                <button type="button" class="ml-2 px-2 py-1 text-xs rounded transition bg-slate-900 text-gray-200 font-mono hover:bg-slate-800" onclick="copyValue(this, '${escapeJavaScriptString(rawCellVal)}')">▤ Copy</button>
                            </td>`;
              }
              // Rule 2: IMAGE LINK -> Clickable functional action button
              else if (i === imgColIdx && rawCellVal.startsWith("http")) {
                rowHtml += `<td class="p-3 border-b border-gray-200">
                                <button type="button" class="px-3 py-1 text-xs font-semibold rounded bg-slate-900 text-white shadow hover:bg-slate-800 transition" onclick="displayImageModal('${escapeJavaScriptString(rawCellVal)}')">📸 View Photo</button>
                            </td>`;
              }
              // Rule 3: Regular plaintext standard render fallback
              else {
                rowHtml += `<td class="p-3 border-b border-gray-200">${escapeHtml(rawCellVal)}</td>`;
              }
            }

            rowHtml += "</tr>";
            tbody.insertAdjacentHTML("beforeend", rowHtml);
          });
        }

        // Utility functions to prevent code execution injections (XSS mitigation safety)
        function escapeHtml(str) {
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

        function escapeJavaScriptString(str) {
          return str
            .replace(/\\/g, "\\\\") // Escapes backslashes
            .replace(/'/g, "\\'") // Escapes single quotes
            .replace(/"/g, '\\"'); // Escapes double quotes
        }

        // Interactive Clipboard copy operation
        function copyValue(buttonElement, payloadText) {
          navigator.clipboard
            .writeText(payloadText)
            .then(() => {
              const defaultText = buttonElement.innerText;
              buttonElement.innerText = "Copied!";
              buttonElement.style.backgroundColor = "#dcfce7";
              buttonElement.style.color = "#15803d";

              setTimeout(() => {
                buttonElement.innerText = defaultText;
                buttonElement.style.backgroundColor = "";
                buttonElement.style.color = "";
              }, 1200);
            })
            .catch((err) => {
              console.error("Could not copy string text value: ", err);
            });
        }

        // Interactive Image Modal handler logic
        function displayImageModal(imageSrcUrl) {
          document.getElementById("modalTargetImg").src = imageSrcUrl;
          document.getElementById("imageModal").style.display = "flex";
        }

        function closeModal() {
          document.getElementById("imageModal").style.display = "none";
        }
