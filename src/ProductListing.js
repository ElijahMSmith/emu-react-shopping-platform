import { useContext } from "react";
import { CartContext } from "./Cart";

const ProductListing = ({ product }) => {
	const { addItem } = useContext(CartContext);

	return (
		<div
			style={{
				margin: 10,
				paddingBottom: 50,
				paddingTop: 50,
				borderBottom: "2px solid black",
			}}
		>
			<img
				src={product.image}
				style={{ maxWidth: 200, maxHeight: 200 }}
				alt="Product"
			/>
			<div>
				<h2>{product.title}</h2>
				<h4>{product.seller}</h4>
				{product.discount > 0 ? (
					<h4>
						<span style={{ textDecoration: "line-through" }}>
							${product.price}
						</span>{" "}
						$
						{(
							product.price -
							product.price * product.discount
						).toFixed(2)}{" "}
						(-{Math.round(product.discount * 100)}%)
					</h4>
				) : (
					<h4>${product.price}</h4>
				)}
			</div>
			<p>{product.description}</p>
			<p>{product.category}</p>
			<button onClick={() => addItem(product)}>Add to Cart</button>
		</div>
	);
};

export default ProductListing;
