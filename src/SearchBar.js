import { useState } from "react";

const SearchBar = ({ onSearch }) => {
	const [currentText, setCurrentText] = useState("");

	const handleSearchSubmit = (event) => {
		event.preventDefault();
		onSearch(currentText);
	};

	return (
		<form onSubmit={handleSearchSubmit} className="searchForm">
			<div className="searchContainer">
				<input
					type="text"
					className="searchInput"
					value={currentText}
					onChange={(event) => setCurrentText(event.target.value)}
				/>
				<button type="submit" className="searchSubmit">
					Search
				</button>
			</div>
		</form>
	);
};

export default SearchBar;
