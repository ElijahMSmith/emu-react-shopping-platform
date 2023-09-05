import React, { useEffect, useMemo, useReducer } from "react";
import ProductListing from "./ProductListing";

const ProductTable = ({ productData, openInModal }) => {
	// All these options are dependent on each other, and we have to be careful not to have a currentPage > maxPage
	// When you notice a similar dependence or scary impossible state, think about useReducer!
	const [paginationOptions, paginationDispatcher] = useReducer(
		(state, action) => {
			switch (action.type) {
				// When the search criteria and filteredResults change
				case "UPDATE_FOR_NEW_SEARCH":
					// First get the last page we can go to with the new amount of results
					const maxPage = Math.ceil(
						productData.length / state.numShowing
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
							productData.length / action.payload.numShowing
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
			productData.length - 1
		);

		// Return a new array that is a subsection of the productData array
		return productData.slice(firstIndex, lastIndex);

		// React will tell you that productData should be in the dependency array
		// This is scary - we want paginationOptions to update first, then force this to run after
		// Be careful listening to dependency array warnings in React. Use your brain to make sure it's correct!
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginationOptions]);

	// When our search changes, THEN update paginationOptions, THEN update the currentPageProducts
	useEffect(
		() => paginationDispatcher({ type: "UPDATE_FOR_NEW_SEARCH" }),
		[productData]
	);

	function changePage(newPage) {
		paginationDispatcher({ type: "SET_PAGE", payload: { newPage } });
	}

	return (
		<div className="productsTableContainer">
			<div className="productsGrid">
				{currentPageProducts.map((productObj) => {
					return (
						<ProductListing
							key={productObj.id}
							product={productObj}
							openInModal={openInModal}
						/>
					);
				})}
			</div>
			<div className="productsGridOptions" style={{ margin: 20 }}>
				<div
					className="paginationContainer"
					style={{ display: "flex", justifyContent: "space-between" }}
				>
					<div className="pageSizeControls">
						<label className="paginationLabel">
							Products Per Page:
							<select
								name="pagination"
								className="paginationSelect"
								onChange={(event) =>
									paginationDispatcher({
										type: "UPDATE_NUM_SHOWING",
										payload: {
											// event.target.value is a string because that's what we gave the <option> tags
											// But for calculations to work in the dispatcher, we need to convert it to a Number
											numShowing: Number(
												event.target.value
											),
										},
									})
								}
							>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
							</select>
						</label>
					</div>

					<div className="pageControls">
						<button
							className="previousPage"
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
									className="firstPage"
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
								className="twoPrevious"
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
								className="onePrevious"
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
							className="current"
							// Highlight the current page a bit better
							style={{ color: "blue", fontSize: "1.1em" }}
						>
							{paginationOptions.currentPage}
						</button>

						{paginationOptions.currentPage <=
							paginationOptions.maxPage - 1 && (
							// Don't show if the next page doesn't exist (i.e. currently on last page)
							<button
								className="oneNext"
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
								className="twoNext"
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
									className="lastPage"
									onClick={() =>
										changePage(paginationOptions.maxPage)
									}
								>
									{paginationOptions.maxPage}
								</button>
							</>
						)}

						<button
							className="nextPage"
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

export default ProductTable;
