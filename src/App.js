import React from "react";
import ListingsPage from "./pages/ListingsPage";
import { CartProvider } from "./utility/Cart";
import CartDisplay from "./components/CartDisplay";

import "./globals.css";
import "./components/component-styles.css";

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
