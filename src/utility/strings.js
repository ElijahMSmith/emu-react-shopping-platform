export function normalizeString(originalString) {
	return originalString.toLowerCase().replace(/ /g, "");
}

export function capitalize(origStr) {
	return origStr
		.split(" ")
		.map((str) => capitalizeHelper(str))
		.join(" ")
		.trim();
}

function capitalizeHelper(substr) {
	if (substr.length <= 1) return substr.toUpperCase();
	return substr.substring(0, 1).toUpperCase() + substr.substring(1);
}
