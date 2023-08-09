import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import ProductTable from "../components/ProductTable";
import axios from "axios";
import { getRandomDiscount, getRandomName } from "../utils/randoms";

// {
// 	id: 0,
// 	title: "Widows Laptop",
// 	seller: "Elijah Smith",
// 	url: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LJcl?ver=3fd0&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true",
// 	price: 499.99,
// 	discount: 0.1,
// 	description: "The best money can buy",
// },

function normalizeString(originalString) {
	return originalString.toLowerCase().replace(/ /g, "");
}

const ListingsPage = () => {
	const [currentText, setCurrentText] = useState("");
	const [products, setProducts] = useState([]);

	async function getAllProducts() {
		try {
			const res = await axios.get("https://fakestoreapi.com/products");
			if (res.status !== 200)
				throw Error("Received error code " + res.status, res.data);

			const productsList = res.data.map((product) => {
				return {
					id: product.id,
					title: product.title,
					description: product.description,
					seller: getRandomName(),
					url: product.image,
					price: product.price,
					discount: getRandomDiscount(),
					category: product.category,
				};
			});

			setProducts(productsList);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		getAllProducts();
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
			<SearchBar onSearch={setCurrentText} />
			<ProductTable productData={filteredProducts} />
		</div>
	);
};

export default ListingsPage;
