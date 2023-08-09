const firstNamesList = ["Bob", "Fred", "Joe"];
const lastNamesList = ["Phillips", "Smith", "O'Connell"];

export function getRandomName() {
	const firstName = Math.floor(Math.random() * firstNamesList.length);
	const lastName = Math.floor(Math.random() * lastNamesList.length);
	return `${firstNamesList[firstName]} ${lastNamesList[lastName]}`;
}

export function getRandomDiscount() {
	return Math.floor(Math.random() * 20) * 5;
}
