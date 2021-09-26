//Integración de array con objetos
const productsArr = [{
		title: "Producto 1",
		price: "$1200",
		img: "url",
		description: "descripción"
	},
	{
		title: "Producto 2",
		price: "$1200",
		img: "url",
		description: "descripción"
	},
	{
		title: "Producto 3",
		price: "$1200",
		img: "url",
		description: "descripción"
	},
	{
		title: "Producto 4",
		price: "$1200",
		img: "url",
		description: "descripcion"
	},
	{
		title: "Producto 5",
		price: "$1200",
		img: "url",
		description: "descripción"
	}
]

const zipCodes = {
	1234: {
		price: "$200"
	},
	8963: {
		price: "$500"
	},
	6309: {
		price: "$800"
	}
}

window.onload = function () {
	addProducts();
	setTimeout(() => {
		askZipCode()
	}, 2000);
}

function askZipCode() {
	toggleModal();
	const currentZipCode = getFromLocalStorage("userZipCode");
	const input = document.getElementById("modalZipInput");
	const prompText = document.getElementById("modalPromptText")
	if (currentZipCode) {
		document.getElementById("modalPromptText").innerHTML=(askZipCode) = (`El valor del envio sera ${currentZipCode.price}`);
	}
	document.getElementById("modalZipInput").addEventListener("change", (e) => {
		const userZipCode = e.target.value;
		const zipCodeData = zipCodes[userZipCode];
		if (zipCodeData) {
			document.getElementById("modalPromptText").innerHTML = (`El valor del envio sera ${zipCodeData.price}`);
			addToLocalStorage("userZipCode", zipCodeData)
			return // toggleModal(false);
		}
		document.getElementById("modalPromptText").innerHTML = ('Código postal no disponilble');
	})
}

function toggleModal(show = true) {
	const modal = document.getElementById("my-modal");
	const backdrop = document.getElementById("myModalBackdrop")
	modal.style.visibility = show ? "visible" : "hidden";


	document.getElementById("my-modal").click(function() {
		document.getElementById( "myModalBackdrop" ).hide(function() {
			show && backdrop.addEventListener("click", () => toggleModal(false))
		});
	  });


	modal.style.visibility = show ? "visible" : "hidden";
	modal.style.opacity = show ? "1" : "0";
	show && backdrop.addEventListener("click", () => toggleModal(false));
}

function addToLocalStorage(key, val) {
	window.localStorage.setItem(key, JSON.stringify(val))
}

function getFromLocalStorage(key) {
	return JSON.parse(window.localStorage.getItem(key))
}

function addProducts() {
	const productListEl = document.getElementById("product-list")
	//transformación de array de objetos a elementos
	const productsElArr = productsArr.map(product => {
		const productEl = document.createElement("div");
		productEl.innerHTML =
			`
			<h1>${product.title}</h1>
			<p>${product.description}</p>
			<h2>${product.price}</h2>
		`;
		return productEl
	})
	for (const element of productsElArr) {
		productListEl.append(element)
	}
	return productListEl;
}