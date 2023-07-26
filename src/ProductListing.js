import { useContext } from "react";
import { CartContext } from "./Cart";

const ProductListing = ({ product }) => {
	const { addToCart } = useContext(CartContext);

	return (
		<div>
			<img src={product.url} alt="Product" />
			<div>
				<h3>{product.title}</h3>
				<h6>{product.price}</h6>
				<h6>{product.seller}</h6>
			</div>
			<p>{product.description}</p>
			<button onClick={() => addToCart(product)}>Add to Cart</button>
		</div>
	);
};

export default ProductListing;
