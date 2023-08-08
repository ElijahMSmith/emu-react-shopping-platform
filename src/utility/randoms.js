const RandomFirstNames = [
	"Tommy",
	"John",
	"Ishaan",
	"Kristen",
	"Alexandra",
	"Christopher",
	"Emmanuel",
];
const RandomLastNames = [
	"Smith",
	"Jackson",
	"Schmidt",
	"O'Connell",
	"Patel",
	"Aguilar",
];

export function getRandomName() {
	const firstNameIndex = Math.floor(Math.random() * RandomFirstNames.length);
	const lastNameIndex = Math.floor(Math.random() * RandomLastNames.length);

	return (
		RandomFirstNames[firstNameIndex] + " " + RandomLastNames[lastNameIndex]
	);
}

export function getRandomDigit() {
	return Math.floor(Math.random() * 10);
}

export function getRandomDiscount() {
	return getRandomDigit() / 10;
}
