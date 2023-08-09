import { useContext, useState } from "react";
import { CartContext } from "../utils/Cart";

export default function CartDisplay() {
	const [showing, setShowing] = useState(false);
	const { items, removeItem, clearCart } = useContext(CartContext);

	return (
		<div
			style={{
				// Puts a divider between cart and the listings page
				width: "100%",
				borderBottom: "1px solid black",
				marginBottom: 25,
			}}
		>
			<button onClick={() => setShowing(!showing)}>Toggle Cart</button>
			<p>
				{items.length} Item{items.length > 1 ? "s" : ""} in Cart
			</p>
			{showing && (
				<div>
					<ul>
						{items.map((item) => (
							<li key={item.value.id}>
								{item.quantity} x {item.value.title} = $
								{(item.value.price * item.quantity).toFixed(2)}
								<button onClick={() => removeItem(item)}>
									Remove from Cart
								</button>
							</li>
						))}
					</ul>
					<button onClick={clearCart}>Clear Cart</button>
				</div>
			)}
		</div>
	);
}
