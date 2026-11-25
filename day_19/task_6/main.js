const TOTAL_ITEMS = 100000;
const heartbeatElement = document.getElementById("heartbeat");
const uiStatus = document.getElementById("ui-status");
const mainButton = document.getElementById("main-sort");
const workerButton = document.getElementById("worker-sort");
const mainStatus = document.getElementById("main-status");
const workerStatus = document.getElementById("worker-status");
const resultsElement = document.getElementById("results");

// Generate 100,000 objects
const data = Array.from({ length: TOTAL_ITEMS }, (_, index) => ({
    id: index + 1,
    value: Math.floor(Math.random() * 1000000)
}));

// Update the heartbeat to demonstrate UI responsiveness
let heartbeatCount = 0;

setInterval(() => {
    heartbeatCount++;
    heartbeatElement.textContent = heartbeatCount;
}, 100);

// Create the Web Worker
const worker = new Worker("worker.js");
let workerStartTime = 0;

// Receive the sorted data from the worker
worker.onmessage = event => {
    const { sortedData, duration } = event.data;
    const totalDuration = performance.now() - workerStartTime;

    workerStatus.textContent = `Worker sorting time: ${duration.toFixed(2)} ms. ` + 
    `Total time including communication: ${totalDuration.toFixed(2)} ms.`;

    displayResults(sortedData);
    workerButton.disabled = false;
    mainButton.disabled = false;
    uiStatus.textContent = "UI remained responsive during worker sorting.";
};

// Handle worker errors
worker.onerror = event => {
    workerStatus.textContent = `Worker error: ${event.message}`;
    workerButton.disabled = false;
    mainButton.disabled = false;
};

// Display the first 10 sorted objects
function displayResults(sortedData) {
    const preview = sortedData.slice(0, 10);
    resultsElement.textContent = `Total sorted objects: ${sortedData.length}\n\n` + 
    `First 10 sorted objects:\n` + JSON.stringify(preview, null, 2);
}

// Sort on the main thread
mainButton.addEventListener("click", () => {
    mainButton.disabled = true;
    workerButton.disabled = true;
    mainStatus.textContent = "Sorting on the main thread...";
    uiStatus.textContent = "Main-thread sorting is about to start.";

    // Allow the browser to update the status before blocking the main thread
    setTimeout(() => {
        const sortableData = data.map(item => ({ ...item }));
        const startTime = performance.now();
        sortableData.sort((a, b) => a.value - b.value);
        const duration = performance.now() - startTime;
        mainStatus.textContent = `Main-thread sorting completed in ${duration.toFixed(2)} ms.`;
        displayResults(sortableData);
        uiStatus.textContent = "Main-thread sorting blocked UI updates while it was running.";
        mainButton.disabled = false;
        workerButton.disabled = false;
    }, 50);
});

// Sort using the Web Worker
workerButton.addEventListener("click", () => {
    mainButton.disabled = true;
    workerButton.disabled = true;
    workerStatus.textContent = "Sorting in the Web Worker...";
    uiStatus.textContent = "UI should remain responsive during worker sorting.";
    const sortableData = data.map(item => ({ ...item }));
    workerStartTime = performance.now();
    worker.postMessage(sortableData);
});
