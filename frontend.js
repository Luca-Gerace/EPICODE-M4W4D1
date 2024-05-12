/* -------------------- COSTANTI PER CHIAMATE API -------------------- */
const url = 'https://striveschool-api.herokuapp.com/api/product/';
const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNmU2OTBiM2IyNTAwMTUxYjU1NzYiLCJpYXQiOjE3MTUxMDUzODUsImV4cCI6MTcxNjMxNDk4NX0.6rSok5ltaSTN0pFVS7x0E4BVPRa23_EzW9D_6SHvorQ"
}

/* ---------------------------- PUNTATORI ---------------------------- */
// Container card prodotti
const productsContainer = document.getElementById('productContainer');

/* ---------------------------- FUNZIONI ----------------------------- */
// Creazione card prodotto
function createProductCard(product) {
    let card = document.createElement('div');
    card.classList.add('w-full', 'bg-white', 'shadow-md', 'rounded-xl', 'duration-500', 'hover:scale-105', 'hover:shadow-xl');
    card.innerHTML = `
        <a href="#">
            <img src="${product.imageUrl}" alt="${product.name}" class="h-40 w-40 object-cover rounded-t-xl" />
            <div class="p-3">
                <span class="text-gray-400 uppercase text-xs">${product.brand}</span>
                <p class="text-lg font-bold text-black truncate block capitalize">${product.name}</p>
                <p class="text-gray-400">${product.description}</p>
                <p class="text-lg font-semibold text-black cursor-auto pt-3">$${product.price}</p>
            </div>
        </a>
    `
    productsContainer.appendChild(card);
}

/* ------------------------- CRUD OPERATIONS ------------------------- */
// GET
const fetchProducts = () => {

    const request = {
        headers: headers,
    }

    fetch(url, request)
        .then((response) => response.json())
        .then((products) => {
            // Ciclo l'array dei prodotti e per ognuno di questi lancio la funzione di creazione card prodotto
            products.forEach((product) => createProductCard(product));
        })
        // Gestisco eventuali errori durante la richiesta
        .catch((error) => console.error("Errore:", error));
}

/* -------------------------- EVENT LISTNER -------------------------- */
// Lancio la fetch che recupera i prodotti al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts();
});
