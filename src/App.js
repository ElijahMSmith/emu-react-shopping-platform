import React from "react";
import ListingsPage from "./ListingsPage";
import { CartProvider } from "./Cart";
import CartDisplay from "./CartDisplay";

function App() {
	return (
		<CartProvider>
			<CartDisplay />
			<ListingsPage />
		</CartProvider>
	);
}

export default App;
