import { useContext } from "react";
import { CartContext } from "../utils/Cart";

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
				<h2>{product.title}</h2>
				<h4>{product.seller}</h4>
				{product.discount === 0 ? (
					<h4>${product.price}</h4>
				) : (
					<>
						<h4>
							<span
								style={{
									textDecorationLine: "line-through",
								}}
							>
								${product.price}
							</span>{" "}
							$
							{(
								product.price -
								(product.price * product.discount) / 100
							).toFixed(2)}{" "}
							(-{product.discount}%)
						</h4>
					</>
				)}
				<h6>Product category: {product.category}</h6>
			</div>
			<p>{product.description}</p>
			<button onClick={() => addItem(product)}>Add to Cart</button>
		</div>
	);
};

export default ProductListing;
