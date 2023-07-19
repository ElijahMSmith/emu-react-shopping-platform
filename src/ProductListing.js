import { useContext } from "react";
import { CartContext } from "./Cart";

const ProductListing = ({ product }) => {
	const { addItem } = useContext(CartContext);

	return (
		<div style={{ marginBottom: 50 }}>
			<img
				src={product.url}
				style={{ maxWidth: 200, maxHeight: 200 }}
				alt="Product"
			/>
			<div>
				<h3>{product.title}</h3>
				<h6>{product.price}</h6>
				<h6>{product.seller}</h6>
			</div>
			<p>{product.description}</p>
			<button onClick={() => addItem(product)}>Add to Cart</button>
		</div>
	);
};

export default ProductListing;
