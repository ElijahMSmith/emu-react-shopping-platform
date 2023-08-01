import React, { useEffect, useMemo, useReducer, useState } from "react";
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

	// All these options are dependent on each other, and we have to be careful not to have a currentPage > maxPage
	// When you notice a similar dependence or scary impossible state, think about useReducer!
	const [paginationOptions, paginationDispatcher] = useReducer(
		(state, action) => {
			switch (action.type) {
				// When the search criteria and filteredResults change
				case "UPDATE_FOR_NEW_SEARCH":
					// First get the last page we can go to with the new amount of results
					const maxPage = Math.ceil(
						filteredProducts.length / state.numShowing
					);
					return {
						...state,
						maxPage,
						// Reset to avoid impossible state currentPage > maxPage
						currentPage: 1,
					};
				case "UPDATE_NUM_SHOWING":
					return {
						...state,
						numShowing: action.payload.numShowing,
						// Calculate our new max page with showing the new amount on each page
						maxPage: Math.ceil(
							filteredProducts.length / action.payload.numShowing
						),
						// Reset to avoid impossible state currentPage > maxPage
						currentPage: 1,
					};
				case "SET_PAGE":
					// Don't set to an invalid page - hopefully this never happens
					if (
						!action.payload.newPage ||
						action.payload.newPage <= 0 ||
						action.payload.newPage > state.maxPage
					)
						// Error handling, mostly for our own benefit when debugging!
						throw Error(
							"Invalid payload.newPage provided: " +
								action.payload.newPage
						);
					return {
						...state,
						currentPage: action.payload.newPage,
					};
				default:
					// For our own benefit while writing/debugging
					throw Error(
						"Invalid action passed to pagination dispatcher: " +
							action.type
					);
			}
		},
		{ numShowing: 10, currentPage: 1, maxPage: 1 }
	);

	// Further cut down our products based on current paginationOptions
	const currentPageProducts = useMemo(() => {
		// Get first product on current page
		const firstIndex =
			(paginationOptions.currentPage - 1) * paginationOptions.numShowing;

		// Get last product on current page
		const lastIndex = Math.min(
			firstIndex + paginationOptions.numShowing - 1,
			filteredProducts.length - 1
		);

		console.log(paginationOptions);
		console.log(
			`Showing products ${firstIndex} - ${lastIndex} (length ${filteredProducts.length})`
		);

		// Return a new array that is a subsection of the filteredProducts array
		return filteredProducts.slice(firstIndex, lastIndex);

		// React will tell you that filteredProducts should be in the dependency array
		// This is scary - we want paginationOptions to update first, then force this to run after
		// Be careful listening to dependency array warnings in React. Use your brain to make sure it's correct!
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginationOptions]);

	// When our search changes, THEN update paginationOptions, THEN update the currentPageProducts
	useEffect(
		() => paginationDispatcher({ type: "UPDATE_FOR_NEW_SEARCH" }),
		[filteredProducts]
	);

	function changePage(newPage) {
		paginationDispatcher({ type: "SET_PAGE", payload: { newPage } });
	}

	return (
		<div>
			<SearchBar onSearch={setCurrentText} />
			<div id="productsGrid">
				{currentPageProducts.map((productObj) => {
					return (
						<ProductListing
							key={productObj.id}
							product={productObj}
						/>
					);
				})}
			</div>
			<div id="productsGridOptions">
				<div
					id="paginationContainer"
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<div id="pageSizeControls">
						<label htmlFor="paginationTitle">
							Products Per Page:
						</label>
						<select
							name="pagination"
							id="paginationTitle"
							onChange={(event) =>
								paginationDispatcher({
									type: "UPDATE_NUM_SHOWING",
									payload: {
										// event.target.value is a string because that's what we gave the <option> tags
										// But for calculations to work in the dispatcher, we need to convert it to a Number
										numShowing: Number(event.target.value),
									},
								})
							}
						>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
						</select>
					</div>

					<div id="pageControls">
						<button
							id="previousPage"
							onClick={() =>
								changePage(paginationOptions.currentPage - 1)
							}
							// Make sure we can't go to an invalid page
							disabled={paginationOptions.currentPage === 1}
						>
							Previous
						</button>

						{paginationOptions.currentPage >= 4 && (
							// Don't show the first page if it's already going
							// to be shown in twoPrevious or onePrevious
							<>
								<button
									id="firstPage"
									onClick={() => changePage(1)}
								>
									1
								</button>
								<button className="filler" disabled>
									...
								</button>
							</>
						)}

						{paginationOptions.currentPage >= 3 && (
							// Don't show if two pages previous doesn't exist (i.e. currently on 2)
							<button
								id="twoPrevious"
								onClick={() =>
									changePage(
										paginationOptions.currentPage - 2
									)
								}
							>
								{paginationOptions.currentPage - 2}
							</button>
						)}

						{paginationOptions.currentPage >= 2 && (
							// Don't show if one page previous doesn't exist (i.e. currently on 1)
							<button
								id="onePrevious"
								onClick={() =>
									changePage(
										paginationOptions.currentPage - 1
									)
								}
							>
								{paginationOptions.currentPage - 1}
							</button>
						)}

						<button
							id="current"
							// Highlight the current page a bit better
							style={{ color: "blue", fontSize: "1.1em" }}
						>
							{paginationOptions.currentPage}
						</button>

						{paginationOptions.currentPage <=
							paginationOptions.maxPage - 1 && (
							// Don't show if the next page doesn't exist (i.e. currently on last page)
							<button
								id="oneNext"
								onClick={() =>
									changePage(
										paginationOptions.currentPage + 1
									)
								}
							>
								{paginationOptions.currentPage + 1}
							</button>
						)}

						{paginationOptions.currentPage <=
							paginationOptions.maxPage - 2 && (
							// Don't show if two pages forward doesn't exist (i.e. on second to last page)
							<button
								id="twoNext"
								onClick={() =>
									changePage(
										paginationOptions.currentPage + 2
									)
								}
							>
								{paginationOptions.currentPage + 2}
							</button>
						)}

						{paginationOptions.currentPage <=
							paginationOptions.maxPage - 3 && (
							// Don't show if last page is already shown in oneNext or twoNext
							<>
								<button className="filler" disabled>
									...
								</button>
								<button
									id="lastPage"
									onClick={() =>
										changePage(paginationOptions.maxPage)
									}
								>
									{paginationOptions.maxPage}
								</button>
							</>
						)}

						<button
							id="nextPage"
							onClick={() =>
								changePage(paginationOptions.currentPage + 1)
							}
							// Make sure we can't go to an invalid page
							disabled={
								paginationOptions.currentPage ===
								paginationOptions.maxPage
							}
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListingsPage;
