import React from "react";
import ListingsPage from "./ListingsPage";
import CartDisplay from "./CartDisplay";
import { CartProvider } from "./Cart";

function App() {
	return (
		<CartProvider>
			<CartDisplay />
			<ListingsPage />
		</CartProvider>
	);
}

export default App;
