//Inicialización de carro de compras, carga de productos en la ui, carga de código postal para que el usuario pueda interactuar
window.onload = function () {
	initCart();
	addProducts(productsArr);
	addZipCodes();
	syncCartWithUI();
	setTimeout(() => {
		askZipCode()
	}, 2000);
}

//Chequear si hay un carrito y sincronizar productos, en caso de que un producto este en el carrito de compras pero no en stock
function initCart() {
	let cart = [];
	const cartListArr = getFromLocalStorage("cart-list")
	if (cartListArr && cartListArr.length) {
		cart = cart.concat(cartListArr).filter(cartItem => {
			return productsArr.some(prod => prod.id === cartItem.id)
		})
	};
	addToLocalStorage("cart-list", cart)
}

//Sincronización de UI con el carrito, para poder mostrar/ocultar info sobre lo que el usuario tiene en su carrito
function syncCartWithUI() {
	const cartItemsArr = getFromLocalStorage("cart-list");
	cartItemsArr.forEach(item => {
		if (item.ammount > 0) {
			$(`#product-ammount-${item.id}`).html(item.ammount).attr("hidden", false)
			$(`#del-${item.id}`).attr("hidden", false)
			$(`#add-${item.id}`).removeClass('btn-primary').addClass('btn-dark')
			$(`#add-${item.id}`).find(".fa-plus").attr("hidden", false)
		} else {
			$(`#product-ammount-${item.id}`).attr("hidden", true)
			$(`#del-${item.id}`).attr("hidden", true)
			$(`#add-${item.id}`).removeClass('btn-dark').addClass('btn-primary')
			$(`#add-${item.id}`).find(".fa-plus").attr("hidden", true)
		}
	})
}

//Cargar los códigos postales disponibles en el select del modal
function addZipCodes() {
	Object.entries(zipCodes).forEach(([zipCode, val]) => {
		$("#modalZipInput").append($('<option>', {
			value: zipCode,
			text: zipCode
		}));
	})
}

//Escuchar cambios del select de códigos postales y guardarlos en el local storage, así como devolver feedback del valor seleccionado
function askZipCode() {
	toggleModal();
	const currentZipCode = getFromLocalStorage("userZipCode");
	if (currentZipCode) {
		const zipCodeIndx = Object.keys(zipCodes).indexOf(currentZipCode.zipCode)
		$(`#modalZipInput option:eq(${zipCodeIndx+1})`).prop('selected', true)
		document.getElementById("modalPromptText").innerHTML = (askZipCode) = (`Actualmente el valor del envío será ${currentZipCode.price}`);
	}
	document.getElementById("modalZipInput").addEventListener("change", (e) => {
		const userZipCode = e.target.value;
		if (zipCodes[userZipCode]) {
			const zipCodeData = {
				zipCode: userZipCode,
				price: zipCodes[userZipCode].price
			};
			document.getElementById("modalPromptText").innerHTML = (`Actualmente el valor del envío será ${zipCodeData.price}`);
			addToLocalStorage("userZipCode", zipCodeData)
			return
		}
		document.getElementById("modalPromptText").innerHTML = ('Código postal no disponilble');
	})
}

//Mostrar/ocultar modal
function toggleModal(show = true) {
	const modal = document.getElementById("my-modal");
	const backdrop = document.getElementById("myModalBackdrop")
	modal.style.visibility = show ? "visible" : "hidden";


	document.getElementById("my-modal").click(function () {
		document.getElementById("myModalBackdrop").hide(function () {
			show && backdrop.addEventListener("click", () => toggleModal(false))
		});
	});

	modal.style.visibility = show ? "visible" : "hidden";
	modal.style.opacity = show ? "1" : "0";
	show && backdrop.addEventListener("click", () => toggleModal(false));
}

//Agregar valores al local storage
function addToLocalStorage(key, val) {
	window.localStorage.setItem(key, JSON.stringify(val))
}

//Devolver valores del local storage
function getFromLocalStorage(key) {
	return JSON.parse(window.localStorage.getItem(key))
}

//Actualizar carrito de compras 
function updateCart({
	dataset: {
		prodid
	}
}) {
	const productId = parseInt(prodid)
	let updatedCart = [];
	const itemData = productsArr.find(item => item.id === productId);
	const currentCartArr = getFromLocalStorage("cart-list")
	const cartItem = currentCartArr.find(item => item.id === productId);
	if (cartItem) {
		updatedCart = currentCartArr.map(cartItem => {
			if (cartItem.id !== productId) return cartItem;
			return {
				...itemData,
				ammount: isNaN(cartItem.ammount) ? 0 : cartItem.ammount + 1
			}
		})
	} else {
		updatedCart = currentCartArr.concat({
			...itemData,
			ammount: 1
		})
	}
	addToLocalStorage("cart-list", updatedCart)
	syncCartWithUI()
}

//Remover items del carrito del local storage actualizando la cantidad a 0
function removeFromCart({
	dataset: {
		prodid
	}
}) {
	const productId = parseInt(prodid)
	const currentCartArr = getFromLocalStorage("cart-list")
	const filteredCart = currentCartArr.map(cartItem => {
		if (cartItem.id !== productId) return cartItem;
		return {
			...cartItem,
			ammount: 0
		}
	})
	addToLocalStorage("cart-list", filteredCart)
	syncCartWithUI()
}

//Cargar productos de manera programática, esta función utiliza products json
function addProducts(productsListArr) {
	const productListEl = document.getElementById("product-list")
	//Transformación de array de objetos a elementos
	const productsElArr = productsListArr.map(product => {
		const productEl = document.createElement("div");
		productEl.innerHTML =
			`
			<h1 class="product-title">${product.title}</h1>
			<img src="${product.img}"/>
			<p class="product-description">${product.description}</p>
			<div class="product-price-btn-container">
			<h2 class="product-price">${product.price}</h2>
			<h5 id="product-ammount-${product.id}" data-prodId="${product.id}" style="margin: auto 0"></h5>
			<button id="del-${product.id}" data-prodId="${product.id}" onClick="removeFromCart(this)" hidden class="product-comprar-btn btn btn-danger"><i class="fa fa-trash"></i></button>
			<button id="add-${product.id}" data-prodId="${product.id}" onClick="updateCart(this)" class="product-comprar-btn btn btn-primary"><i hidden class="fa fa-plus"></i>  <i class="fa fa-shopping-cart"></i></button>
			</div>
			`;
		return productEl
	})
	for (const element of productsElArr) {
		productListEl.append(element)
	}
	return productListEl;
}