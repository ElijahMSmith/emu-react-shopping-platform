import React from "react";
import ListingsPage from "./ListingsPage";
import { CartProvider } from "./Cart";
import CartDisplay from "./CartDisplay";

function App() {
	return (
		// Only children of a tree of a Provider can subscribe to their context
		// Therefore, we put our provider as high up as possible!
		<CartProvider>
			<CartDisplay />
			<ListingsPage />
		</CartProvider>
	);
}

export default App;
