export function getPriceElement(product) {
	return product.discount > 0 ? (
		<span>
			<span style={{ textDecoration: "line-through", color: "#FF0000" }}>
				${product.price}
			</span>{" "}
			<span style={{ color: "#008221" }}>
				${(product.price - product.price * product.discount).toFixed(2)}{" "}
				(-{Math.round(product.discount * 100)}%)
			</span>
		</span>
	) : (
		<span>${product.price}</span>
	);
}
