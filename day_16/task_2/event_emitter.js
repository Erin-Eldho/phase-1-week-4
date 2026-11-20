// 1. EventEmitter class
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    // Register a listener
    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        return this;
    }

    // Remove a listener
    off(event, listener) {
        const listeners = this.events.get(event);
        if (!listeners) {
            return this;
        }
        for (const registeredListener of listeners) {
            if (registeredListener === listener || registeredListener.originalListener === listener) {
                listeners.delete(registeredListener);
            }
        }
        if (listeners.size === 0) {
            this.events.delete(event);
        }
        return this;
    }

    // Trigger an event
    emit(event, ...args) {
        const listeners = this.events.get(event) || [];
        for (const listener of [...listeners]) {
            listener(...args);
        }

        // Wildcard listeners receive every event
        if (event !== "*") {
            const wildcardListeners = this.events.get("*") || [];
            for (const listener of [...wildcardListeners]) {
                listener(event, ...args);
            }
        }
        return listeners.length > 0 || (event !== "*" && (this.events.get("*")?.size || 0) > 0);
    }

    // Register a listener that fires only once
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, onceListener);
            listener(...args);
        };
        onceListener.originalListener = listener;
        this.on(event, onceListener);
        return this;
    }
}


// 2. UserStore extends EventEmitter
class UserStore extends EventEmitter {
    constructor() {
        super();
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
        this.emit("userAdded", user);
    }

    removeUser(userId) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            const removedUser = this.users.splice(index, 1)[0];
            this.emit("userRemoved", removedUser);
        }
    }

    updateUser(userId, updates) {
        const user = this.users.find(user => user.id === userId);
        if (user) {
            Object.assign(user, updates);
            this.emit("userUpdated", user);
        }
    }
}


// 3. Demonstrate EventEmitter
const emitter = new EventEmitter();
console.log("EVENT EMITTER:");
function greet(name) {
    console.log(`Hello, ${name}!`);
}

// on()
emitter.on("greet", greet);
emitter.emit("greet", "Erin");

// off()
emitter.off("greet", greet);
emitter.emit("greet", "Erin");

// once()
emitter.once("welcome", name => {
    console.log(`Welcome, ${name}!`);
});

emitter.emit("welcome", "Erin");
emitter.emit("welcome", "Erin");

// Wildcard listener
emitter.on("*", (event, ...args) => {
    console.log(`Wildcard: ${event}`, ...args);
});
emitter.emit("login", "Erin");
emitter.emit("logout", "Erin");


// 4. Demonstrate UserStore
console.log("\nUSER STORE:");
const userStore = new UserStore();

userStore.on("userAdded", user => {
    console.log("User added:", user);
});

userStore.on("userRemoved", user => {
    console.log("User removed:", user);
});

userStore.on("userUpdated", user => {
    console.log("User updated:", user);
});

userStore.addUser({ id: 1, name: "Erin" });
userStore.updateUser(1, { name: "Erin Eldho" });
userStore.removeUser(1);
