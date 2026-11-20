const storageManager = {
    prefix: "storageManager:",
    
    get(key) {
        const storedItem = localStorage.getItem(this.prefix + key);
        if (storedItem === null) {
            return null;
        }
        const item = JSON.parse(storedItem)
        if (item.expiresAt !== null && Date.now() >= item.expiresAt) {
            this.delete(key);
            return null;
        }
        return item.value;
    },

    set(key, value, ttl) {
        const item = {
            value: value,
            expiresAt: ttl === undefined ? null : Date.now() + ttl
        };
        localStorage.setItem(
            this.prefix + key,
            JSON.stringify(item)
        );
    },

    delete(key) {
        localStorage.removeItem(this.prefix + key);
    },

    clear() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix)) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    }
};

// Test storageManager
storageManager.set("username", "Erin");
storageManager.set("theme", "dark", 5000);

console.log("Username:", storageManager.get("username"));
console.log("Theme:", storageManager.get("theme"));

setTimeout(() => {
    console.log("Theme after 5 seconds:", storageManager.get("theme"));
}, 5500);

storageManager.delete("username");
console.log("Username after deletion:", storageManager.get("username"));

storageManager.set("city", "Coimbatore");
storageManager.clear();
console.log("City after clearing:", storageManager.get("city"));
