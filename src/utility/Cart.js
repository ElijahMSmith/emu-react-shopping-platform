import { createContext, useEffect, useState } from "react";

export const CartContext = createContext([]);

export function CartProvider({ children }) {
	/*
    Cart structure:
    [
        {
            value: productObject, 
            quantity: integer
        },
        ...
    ]
    */
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem("cart") ?? "[]")
	);

	// You've seen this before! When we update our cart, persist it to local storage.
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(items));
	}, [items]);

	function addItem(newItem) {
		// If the item already exists in our cart, just add to the quantity instead
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.value.id === newItem.id) {
				// Once we find a matching ID, we change the quantity, force our page to re-render, and exit the function
				item.quantity++;

				// This looks weird, but objects and arrays in state variables only force a re-render of the page
				// When we assign a completely new object or array using the setter function.
				// Here, we spread all the items from the original into an identical, but new array and React will re-render properly!
				setItems([...items]);
				return;
			}
		}

		// Only if we don't already find the item in the cart do we append it.
		const newList = [{ quantity: 1, value: { ...newItem } }, ...items];
		setItems(newList);
	}

	function removeItem(oldItem) {
		// Only keeps items that do not have a matching ID to the one we want to remove
		// During our session, we mentioned that we could also use .splice() to do this.
		const newItems = items.filter(
			(thisItem) => thisItem.value.id !== oldItem.value.id
		);
		setItems(newItems);
	}

	function clearCart() {
		setItems([]);
	}

	function updateQuantity(oldItem, newQuantity) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.value.id === oldItem.id) {
				item.quantity = newQuantity;
				// We don't need to look through any more products, so break out of this for loop early
				break;
			}
		}

		// Once again, we have to create a new array to force a re-render. See note further up in this file.
		setItems([...items]);
	}

	return (
		// Pass only things that you want child components to be able to access
		// Ex: DON'T pass setItems because you could accidentally call it and pass something invalid!
		// Instead, pass functions that define the exact ways you can interact with the cart and do the logic for you
		<CartContext.Provider
			value={{ items, addItem, removeItem, clearCart, updateQuantity }}
		>
			{/* Allows us to pass in child components when we declare CartProvider in another file - see App.js */}
			{children}
		</CartContext.Provider>
	);
}
