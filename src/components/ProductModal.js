import { useContext } from "react";
import { getPriceElement } from "../utility/product";
import { capitalize } from "../utility/strings";
import { CartContext } from "../utility/Cart";

function ProductModal({ openProduct, closeModal }) {
	const { addItem } = useContext(CartContext);

	if (!openProduct) return;
	return (
		<div className={`modalWrapper ${!openProduct ? "closed" : "open"}`}>
			<div className="modalContainer">
				<div className="modalTopRow">
					<h1>{openProduct.title ?? ""}</h1>
					<button onClick={closeModal}>X</button>
				</div>
				<div className="modalMiddleRow">
					<img
						src={openProduct.image}
						style={{
							maxWidth: 200,
							maxHeight: 200,
							flex: 1,
							margin: "0px 30px",
						}}
						alt="Product"
					/>
					<div className="modalProductDetails">
						<h4
							style={{
								fontWeight: 600,
								fontSize: "1.2em",
							}}
						>
							{openProduct.seller} -{" "}
							{getPriceElement(openProduct)}
						</h4>
						<p style={{ fontSize: "1.1em" }}>
							Category: {capitalize(openProduct.category)}
						</p>
					</div>
				</div>
				<div className="modalBottomRow">
					<p>{openProduct.description}</p>
					<button
						className="addToCartBtn"
						onClick={() => addItem(openProduct)}
					>
						Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProductModal;
