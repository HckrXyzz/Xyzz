  function getOrCreateElementById(id, tag = "div") {
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement(tag);
                el.id = id;
                document.body.appendChild(el);
            }
            return el;
        }

        const textInput = document.getElementById("textInput");
        const wordListContainer = document.getElementById("wordListContainer");
        const wordStats = document.getElementById("wordStats");
        const memberStats = document.getElementById("memberStats");
        const copyBtn = document.getElementById("copyBtn");
        const fileInput = document.getElementById("fileInput");

        let processedWords = [];

        // Utility to remove duplicates
        function removeDuplicates(arr) {
            const seen = new Set();
            return arr.filter((item) => {
                const lowerItem = item.toLowerCase();
                if (!seen.has(lowerItem)) {
                    seen.add(lowerItem);
                    return true;
                }
                return false;
            });
        }

        // Display words
        function displayWordList(words) {
            wordListContainer.innerHTML = "";
            if (words.length === 0) {
                wordListContainer.innerHTML =
                    '<p class="text-gray-400">No valid words found.</p>';
                wordStats.textContent = "0";
                memberStats.textContent = "0";
                return;
            }

            wordStats.textContent = words.length;
            const list = document.createElement("div");
            list.className = "flex flex-wrap gap-2";

            words.forEach((word) => {
                const span = document.createElement("span");
                span.className =
                    "bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm";
                span.textContent = word;
                list.appendChild(span);
            });
            wordListContainer.appendChild(list);
        }

        // Main processing
        function processInput() {
            const text = textInput.value;

            if (typeof processInput.isProcessing === "undefined") {
                processInput.isProcessing = false;
            }
            if (processInput.isProcessing) return;
            processInput.isProcessing = true;

            if (!text.trim()) {
                document.getElementById("memberStats").textContent = "0";
                displayWordList([]);
                processInput.isProcessing = false;
                return;
            }

            const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, " ");
            let words = cleanedText
                .split(/\s+/)
                .map((w) => w.trim())
                .filter((w) => w.length >= 6 && w.length <= 14);

            words = removeDuplicates(words);
            words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

            textInput.value = cleanedText;
            displayWordList(words);
            processedWords = words;

            // Example pattern for member codes
            const memberCodes = words.filter(
                (word) =>
                    /^[a-zA-Z]+[\d_]+$/.test(word) ||
                    /^[\d_]+[a-zA-Z]+$/.test(word) ||
                    /^[a-zA-Z]+$/.test(word) ||
                    /^\d+$/.test(word),
            );
            document.getElementById("memberStats").textContent =
                memberCodes.length.toString();

            processInput.isProcessing = false;
        }

        // Event listener for textarea input
        textInput.addEventListener("input", processInput);

        // Handle file uploads
        document
            .getElementById("fileInput")
            .addEventListener("change", (event) => {
                const files = event.target.files;
                if (!files.length) return;

                Array.from(files).forEach((file) => {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        const content = e.target.result;
                        // Append file content to existing textarea input
                        textInput.value += "\n" + content;
                        // Trigger processing
                        processInput();
                    };

                    // Read text files, or fallback to read as text regardless of type
                    reader.readAsText(file);
                });
            });

        // Copy button handler
        document.getElementById("copyBtn").addEventListener("click", () => {
            if (processedWords.length === 0) {
                alert("No words to copy!");
                return;
            }
            const textToCopy = processedWords.join("\n");
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    alert("Copied to clipboard!");
                })
                .catch((err) => {
                    alert("Failed to copy: " + err);
                });
        });