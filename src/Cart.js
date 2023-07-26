import { createContext, useState } from "react";

/*

    {
		id: 0,
		title: "Widows Laptop",
		seller: "Elijah Smith",
		url: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LJcl?ver=3fd0&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true",
		price: 499.99,
		discount: 0.1,
		description: "The best money can buy",
	},  

*/

export const CartContext = createContext([]);

export function CartProvider({ children }) {
	const [cart, setCart] = useState(
		JSON.parse(localStorage.getItem("cart") ?? "[]")
	);

	function addToCart(newItem) {
		for (let i = 0; i < cart.length; i++) {
			const currentItem = cart[i];
			if (currentItem.id === newItem.id) return;
		}
		setCart([...cart, newItem]);
	}

	function clearCart() {
		setCart([]);
	}

	function removeFromCart(oldItem) {
		for (let i = 0; i < cart.length; i++) {
			const currentItem = cart[i];
			if (currentItem.id === oldItem.id) {
				cart.splice(i, 1);
				setCart([...cart]);
				return;
			}
		}
	}

	return (
		<CartContext.Provider
			value={{ cart, addToCart, clearCart, removeFromCart }}
		>
			{children}
		</CartContext.Provider>
	);
}
