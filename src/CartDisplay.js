import { useContext, useState } from "react";
import { CartContext } from "./Cart";

export default function CartDisplay() {
	const [showing, setShowing] = useState(false);
	const cartObj = useContext(CartContext);
	const items = cartObj.items;
	console.log(cartObj, items);

	return (
		<div
			style={{
				width: "100%",
				borderBottom: "1px solid black",
				marginBottom: 25,
			}}
		>
			<button onClick={() => setShowing(!showing)}>Toggle Cart</button>
			<p>
				{items.length} Item{items.length > 1 ? "s" : ""} in Cart
			</p>
			{showing ? (
				<ul>
					{items.map((item, index) => (
						<li key={index}>
							{item.quantity} x {item.value.title} = $
							{(item.value.price * item.quantity).toFixed(2)}
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
