import { createContext, useEffect, useState } from "react";

export const CartContext = createContext([]);

export function CartProvider({ children }) {
	const [items, setItems] = useState(
		JSON.parse(localStorage.getItem("cart") ?? "[]")
	);

	useEffect(() => {
		console.log(items.length, items);
		localStorage.setItem("cart", JSON.stringify(items));
	}, [items]);

	function addItem(newItem) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.value.id === newItem.id) {
				item.quantity++;
				setItems([...items]);
				return;
			}
		}

		const newList = [{ quantity: 1, value: { ...newItem } }, ...items];
		console.log(newList);
		setItems(newList);
	}

	function removeItem(id) {
		const newItems = items.filter((thisItem) => thisItem.value.id !== id);
		setItems(newItems);
	}

	function clearCart() {
		setItems([]);
	}

	function updateQuantity(id, newQuantity) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.value.id === id) {
				item.quantity = newQuantity;
				return;
			}
		}
		setItems(items);
	}

	return (
		<CartContext.Provider
			value={{ items, addItem, removeItem, clearCart, updateQuantity }}
		>
			{children}
		</CartContext.Provider>
	);
}
