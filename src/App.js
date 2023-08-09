import React from "react";
import ListingsPage from "./page/ListingsPage";
import { CartProvider } from "./utils/Cart";
import CartDisplay from "./components/CartDisplay";

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
