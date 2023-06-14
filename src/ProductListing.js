const ProductListing = ({ product }) => {
	return (
		<div>
			<img src={product.url} alt="Product" />
			<div>
				<h3>{product.title}</h3>
				<h6>{product.price}</h6>
				<h6>{product.seller}</h6>
			</div>
			<p>{product.description}</p>
		</div>
	);
};

export default ProductListing;
