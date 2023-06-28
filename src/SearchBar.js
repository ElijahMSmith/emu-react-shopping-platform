import { useState } from "react";

function SearchBar({onSearch}) {
	const [searchText, setSearchText] = useState("");

	function handleSubmit(event) {
		event.preventDefault();
        onSearch(searchText);
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="searchInput">Search for a Product</label>
			<input
				className="searchInput"
                value={searchText}
				onChange={(event) => setSearchText(event.target.value)}
			/>
			<button type="submit">Go!</button>
		</form>
	);
}

export default SearchBar;
