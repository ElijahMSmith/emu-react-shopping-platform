import { useMemo, useState } from "react";
import ProductListing from "./ProductListing";
import SearchBar from "./SearchBar";

const products = [
	{
		id: 0,
		title: "Windows Laptop",
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
	{
		id: 3,
		title: "Lamp",
		seller: "Elijah Smith",
		url: "https://www.ikea.com/us/en/images/products/blidvaeder-table-lamp-off-white-ceramic-beige__1059592_pe849717_s5.jpg",
		price: 75.0,
		discount: 0.1,
		description: "Also intensely bright!",
	},
];

const standardizeString = (str) => str.toLowerCase().trim().replace(/ /g, "");

// Precondition: searchStr and comparisonStr have been standardized
const containsAllLetters = (searchStr, comparisonStr) => {
	console.log("Comparing " + searchStr + " and " + comparisonStr);
	const frequencies = [];
	for (let i = 0; i < 26; i++) frequencies[i] = 0;

	const aCharCode = 97;
	for (let j = 0; j < searchStr.length; j++)
		frequencies[searchStr.charCodeAt(j) - aCharCode]++;

	console.log(frequencies);

	for (let k = 0; k < comparisonStr.length; k++) {
		const thisCode = comparisonStr.charCodeAt(k) - aCharCode;
		if (frequencies[thisCode] > 0) frequencies[thisCode]--;
	}

	for (let l = 0; l < 26; l++) {
		if (frequencies[l] > 0) return false;
	}

	// Question: Is this looping approach better than keeping index of last such character in comparisonStr?
	// Approach: move to next with indexOf and return false when -1 received
	// In what cases might this be faster? In what cases might this be slower? Does it matter?

	return true;
};

const ListingsPage = () => {
	const [searchText, setSearchText] = useState("");

	const filteredResults = useMemo(() => {
		const searchStandard = standardizeString(searchText);
		return products.filter((product) => {
			// Title contains all the right letters
			// Matches part of the seller
			// Matches a part of the description

			const inTitle = standardizeString(product.title).includes(
				searchStandard
			);

			const isSeller = standardizeString(product.seller).includes(
				searchStandard
			);

			const inDescription = containsAllLetters(
				searchStandard,
				standardizeString(product.description)
			);

			return inTitle || isSeller || inDescription;
		});
	}, [searchText]);

	console.log(filteredResults);

	return (
		<>
			<SearchBar onSearch={setSearchText} />
			<div id="productListingsContainer" className="listingGrid">
				{filteredResults.map((productObj) => {
					return (
						<ProductListing
							key={productObj.id}
							product={productObj}
						/>
					);
				})}
			</div>
		</>
	);
};

export default ListingsPage;
