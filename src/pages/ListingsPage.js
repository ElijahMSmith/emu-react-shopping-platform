import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import { getRandomDiscount, getRandomName } from "../utility/randoms";
import { normalizeString } from "../utility/strings";
import ProductModal from "../components/ProductModal";

const ListingsPage = () => {
	const [currentText, setCurrentText] = useState("");
	const [products, setProducts] = useState([]);
	const [expandedProduct, setExpandedProduct] = useState(null);

	function openInModal(product) {
		console.log("test");
		setExpandedProduct(product);
	}

	function closeModal() {
		setExpandedProduct(null);
	}

	useEffect(() => {
		axios
			.get("https://fakestoreapi.com/products")
			.then((res) => res.data)
			.then((resProducts) => {
				// The data that comes back doesn't have a seller or discount, so let's generate them randomly!
				// Data doesn't always come back in the best way for handling on your frontend, so it is a common occurrence
				// To modify it here before it gets used anywhere else
				const mappedProducts = resProducts.map((productRaw) => {
					return {
						...productRaw,
						seller: getRandomName(),
						discount: getRandomDiscount(),
					};
				});
				setProducts(mappedProducts);
			});
	}, []);

	const filteredProducts = useMemo(() => {
		return products.filter((currentProduct) => {
			const normalCurrentText = normalizeString(currentText);

			/*
            1. Does it match part of the title
                - All letters in currentText appear somewhere in product title
            2. Is it in the description
                - Just needs to appear SOMEWHERE in the description
            3. Is it the seller
                - Needs to match exactly
            */

			// Is it the same as the seller's name EXACTLY?
			let isSeller =
				normalizeString(currentProduct.seller) === normalCurrentText;

			// Does this text appear SOMEWHERE in the description?
			let inDescription = normalizeString(
				currentProduct.description
			).includes(normalCurrentText);

			// Does the title contain all the letters in the search?
			// Note: This may or may not be what you want, but it was a fun challenge to tackle together.
			// Further research: frequency arrays
			const letterFreq = [];
			for (let i = 0; i < 26; i++) letterFreq[i] = 0;

			let normalTitle = normalizeString(currentProduct.title);
			let aCode = "a".charCodeAt(0);

			for (let i = 0; i < normalCurrentText.length; i++)
				letterFreq[normalCurrentText.charCodeAt(i) - aCode]++;

			for (let i = 0; i < normalTitle.length; i++)
				letterFreq[normalTitle.charCodeAt(i) - aCode]--;

			let inTitle = true;
			for (let i = 0; i < 26; i++) {
				if (letterFreq[i] > 0) {
					inTitle = false;
					break;
				}
			}

			return isSeller || inDescription || inTitle;
		});
	}, [currentText, products]);

	return (
		<div>
			<ProductModal
				openProduct={expandedProduct}
				closeModal={closeModal}
			/>
			<SearchBar onSearch={setCurrentText} />
			<ProductTable
				productData={filteredProducts}
				openInModal={openInModal}
			/>
		</div>
	);
};

export default ListingsPage;
