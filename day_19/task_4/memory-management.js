const mapStore = new Map();
const weakMapStore = new WeakMap();
const mapStatus = document.querySelector("#map-status");
const weakMapStatus = document.querySelector("#weakmap-status");
const generalStatus = document.querySelector("#status");
const NODE_COUNT = 1000;

// 1. Demonstrate memory retention with Map.
function createMapNodes() {
    const container = document.querySelector("#map-container");
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= NODE_COUNT; i++) {
        const node = document.createElement("div");
        node.className = "test-node";
        node.textContent = `Map Node ${i}`;
        mapStore.set(node, {
            id: i,
            description: `Stored reference ${i}`
        });
        fragment.appendChild(node);
    }
    container.appendChild(fragment);
    container.replaceChildren();
    mapStatus.textContent = `Map entries: ${mapStore.size}`;
    generalStatus.textContent = "1000 DOM nodes removed, but Map still retains their references.";
}

// Remove retained references from Map.
function clearMap() {
    mapStore.clear();
    mapStatus.textContent = `Map entries: ${mapStore.size}`;
    generalStatus.textContent = "Map cleared. Its stored DOM references have been released.";
}

// 2. Demonstrate WeakMap.
function createWeakMapNodes() {
    const container = document.querySelector("#weakmap-container");
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= NODE_COUNT; i++) {
        const node = document.createElement("div");
        node.className = "test-node";
        node.textContent = `WeakMap Node ${i}`;
        weakMapStore.set(node, {
            id: i,
            description: `Weakly stored reference ${i}`
        });
        fragment.appendChild(node);
    }
    container.appendChild(fragment);

    // Remove nodes from the DOM.
    container.replaceChildren();
    weakMapStatus.textContent = `${NODE_COUNT} WeakMap entries created; keys are no longer strongly referenced.`;
    generalStatus.textContent = "WeakMap nodes removed. They are now eligible for garbage collection.";
}

// 3. Private class data using WeakMap.
const privateData = new WeakMap();
class User {
    constructor(name, email) {
        privateData.set(this, {
            name,
            email
        });
    }
    getDetails() {
        const data = privateData.get(this);
        return `Name: ${data.name}, Email: ${data.email}`;
    }
    updateName(newName) {
        const data = privateData.get(this);
        data.name = newName;
    }
}

let currentUser = null;

function createUser() {
    currentUser = new User("Erin", "erin@example.com");
    document.querySelector("#user-status").textContent = currentUser.getDetails();
    generalStatus.textContent = "User created. Its private data is stored in a WeakMap.";
}

function updateUser() {
    if (!currentUser) {
        generalStatus.textContent = "Create a user first.";
        return;
    }
    currentUser.updateName("Updated User");
    document.querySelector("#user-status").textContent = currentUser.getDetails();
    generalStatus.textContent = "Private user data updated through a class method.";
}

document.querySelector("#create-map-nodes").addEventListener("click", createMapNodes);
document.querySelector("#clear-map").addEventListener("click", clearMap);
document.querySelector("#create-weakmap-nodes").addEventListener("click", createWeakMapNodes);
document.querySelector("#create-user").addEventListener("click", createUser);
document.querySelector("#update-user").addEventListener("click", updateUser);
