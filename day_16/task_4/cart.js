const CartModule = (function () {
    const items = [];

    function addItem(item) {
        items.push({ ...item });
    }

    function removeItem(id) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items.splice(index, 1);
        }
    }

    function updateQuantity(id, quantity) {
        const item = items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
        }
    }

    function getItems() {
        return items.map(item => ({ ...item }));
    }

    function getTotal() {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function clear() {
        items.length = 0;
    }
    return {addItem, removeItem, updateQuantity, getItems, getTotal, clear};
})();


console.log("CART MODULE:");
CartModule.addItem({id: 1, name: "Laptop", price: 50000, quantity: 1});
CartModule.addItem({id: 2, name: "Mouse", price: 1000, quantity: 2});
console.log("Items:", CartModule.getItems());
console.log("Total:", CartModule.getTotal());

const externalItems = CartModule.getItems();
externalItems[0].name = "Changed";
console.log("After external modification:", CartModule.getItems());

CartModule.updateQuantity(1, 2);
console.log("After quantity update:", CartModule.getItems());
console.log("Updated total:", CartModule.getTotal());

CartModule.removeItem(2);
console.log("After removing mouse:", CartModule.getItems());
console.log("Private items:", CartModule.items);
console.log("Available methods:", Object.keys(CartModule));

CartModule.clear();
console.log("After clearing:", CartModule.getItems());
