import { useContext } from "react";
import { CartContext } from "../utility/Cart";
import { capitalize } from "../utility/strings";
import { getPriceElement } from "../utility/product";

const ProductListing = ({ product, openInModal }) => {
	const { addItem } = useContext(CartContext);

	return (
		<div
			style={{
				margin: 10,
				paddingBottom: 50,
				paddingTop: 50,
				borderBottom: "2px solid black",
				display: "flex",
				alignItems: "center",
			}}
		>
			<img
				src={product.image}
				style={{
					maxWidth: 200,
					maxHeight: 200,
					flex: 1,
					margin: "0px 30px",
				}}
				alt="Product"
			/>
			<div style={{ flex: 3, margin: "0px 30px" }}>
				<button
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						textDecoration: "underline",
					}}
					onClick={(e) => {
						e.preventDefault();
						openInModal(product);
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: "1.6em",
							fontWeight: 700,
							textOverflow: "ellipsis",
						}}
					>
						{product.title}
					</h2>
				</button>
				<h4
					style={{
						fontWeight: 600,
						fontSize: "1.2em",
					}}
				>
					{product.seller} - {getPriceElement(product)}
				</h4>
				<p style={{ fontSize: "1.1em" }}>
					Category: {capitalize(product.category)}
				</p>
				<p>{product.description}</p>
				<button
					className="addToCartBtn"
					onClick={() => addItem(product)}
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductListing;
