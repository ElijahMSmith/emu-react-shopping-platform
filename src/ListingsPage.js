import { useMemo, useState } from "react";
import ProductListing from "./ProductListing";
import SearchBar from "./SearchBar";

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

			let isSeller =
				normalizeString(currentProduct.seller) === normalCurrentText;

			let inDescription = normalizeString(
				currentProduct.description
			).includes(normalCurrentText);

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
	}, [currentText]);

	return (
		<div>
			<SearchBar onSearch={setCurrentText} />
			{filteredProducts.map((productObj) => {
				return (
					<ProductListing key={productObj.id} product={productObj} />
				);
			})}
		</div>
	);
};

export default ListingsPage;
