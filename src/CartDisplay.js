import { useContext, useState } from "react";
import { CartContext } from "./Cart";

function CartDisplay() {
	const [cartIsShowing, setCartIsShowing] = useState(false);
	const { cart, removeFromCart, clearCart } = useContext(CartContext);

	return (
		<div>
			<h3>Items In Your Cart: {cart.length}</h3>
			<button onClick={() => setCartIsShowing(!cartIsShowing)}>
				Toggle Cart
			</button>

			{cartIsShowing && (
				<div>
					<ul>
						{cart.map((product) => {
							return (
								<li key={product.id}>
									<p>
										{product.title} (${product.price})
									</p>
									<button
										onClick={() => removeFromCart(product)}
									>
										Remove
									</button>
								</li>
							);
						})}
					</ul>
					<button onClick={clearCart}>Clear Cart</button>
				</div>
			)}
		</div>
	);
}

export default CartDisplay;
