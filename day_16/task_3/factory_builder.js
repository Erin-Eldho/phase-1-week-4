// 1. createUser factory
function createUser({name, email, role = "viewer", createdAt = Date.now()}) {
    if (!name || typeof name !== "string") {
        throw new Error("Name is required");
    }
    if (!email || !email.includes("@")) {
        throw new Error("Valid email is required");
    }
    if (!["viewer", "editor", "admin"].includes(role)) {
        throw new Error("Invalid role");
    }
    return Object.freeze({id: crypto.randomUUID(), name, email, role, createdAt});
}


// 2. QueryBuilder class
class QueryBuilder {
    constructor() {
        this.table = "";
        this.condition = "";
        this.fields = "*";
        this.rowLimit = null;
    }

    from(table) {
        this.table = table;
        return this;
    }

    where(condition) {
        this.condition = condition;
        return this;
    }

    select(fields) {
        this.fields = Array.isArray(fields) ? fields.join(", ") : fields;
        return this;
    }

    limit(n) {
        this.rowLimit = n;
        return this;
    }

    build() {
        let query = `SELECT ${this.fields} FROM ${this.table}`;
        if (this.condition) {
            query += ` WHERE ${this.condition}`;
        }
        if (this.rowLimit !== null) {
            query += ` LIMIT ${this.rowLimit}`;
        }
        return query;
    }
}


// 3. createNotification factory
function createNotification({type = "info", message = "", duration = 3000, dismissible = true} = {}) {
    return {
        type, message, duration, dismissible, show() { 
            console.log(`[${this.type.toUpperCase()}] ${this.message}`);
            console.log(`Duration: ${this.duration}ms`);
            console.log(`Dismissible: ${this.dismissible}`);
        }
    };
}


// 4. Demonstrate createUser
console.log("CREATE USER:");
const user1 = createUser({name: "Erin", email: "erin@example.com"});
const user2 = createUser({name: "Alee", email: "alee@example.com", role: "admin"});
console.log(user1);
console.log(user2);
console.log("Frozen:", Object.isFrozen(user1));


// 5. Demonstrate QueryBuilder
console.log("\nQUERY BUILDER:");
const query = new QueryBuilder().from("users").where("role = 'admin'").select(["name", "email"]).limit(5).build();
console.log(query);


// 6. Demonstrate createNotification
console.log("\nCREATE NOTIFICATION:");
const notification1 = createNotification({type: "success", message: "User created successfully", duration: 5000, dismissible: true});
notification1.show();
const notification2 = createNotification({message: "Welcome!"});
notification2.show();
