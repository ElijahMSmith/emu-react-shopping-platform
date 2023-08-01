import React, { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import ProductTable from "./ProductTable";

const products = [
	{
		id: 0,
		title: "Widows Laptop",
		seller: "Elijah Smith",
		url: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LJcl?ver=3fd0&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&p=140&aim=true",
		price: 499.99,
		discount: 0.1,
		description: "The best money can buy",
	},
	{
		id: 1,
		title: "Suitcase",
		seller: "Isaiah Smith",
		url: "https://i5.walmartimages.com/asr/f7f78756-9dd8-47f2-b7f1-6db17484e661.35d3bcac524972f738c8f8e13743f0b0.jpeg",
		price: 250.0,
		discount: 0.0,
		description: "Big enough for any journey",
	},
	{
		id: 2,
		title: "Lamp",
		seller: "Sheryl Smith",
		url: "https://www.ikea.com/us/en/images/products/blidvaeder-table-lamp-off-white-ceramic-beige__1059592_pe849717_s5.jpg",
		price: 80.0,
		discount: 0.2,
		description: "Intensely bright",
	},
];

function normalizeString(originalString) {
	return originalString.toLowerCase().replace(/ /g, "");
}

const ListingsPage = () => {
	const [currentText, setCurrentText] = useState("");

	// Until we have an API to work with, we need to fake having lots of data
	// Here, we (only once, hence useMemo) duplicate each of our items 75 times
	// Now, instead of three items, we have 225 and can more easily test our pagination
	const duplicatedProducts = useMemo(() => {
		const newProducts = [];

		// Because each item still needs to have a unique id, we count up from 0 as we are duplicating
		let idCounter = 0;
		for (let item of products) {
			for (let i = 0; i < 75; i++) {
				newProducts.push({ ...item, id: idCounter++ });
			}
		}
		return newProducts;
	}, []);

	const filteredProducts = useMemo(() => {
		return duplicatedProducts.filter((currentProduct) => {
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
	}, [currentText, duplicatedProducts]);

	return (
		<div>
			<SearchBar onSearch={setCurrentText} />
			<ProductTable productData={filteredProducts} />
		</div>
	);
};

export default ListingsPage;
