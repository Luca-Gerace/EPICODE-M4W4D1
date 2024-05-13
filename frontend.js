/* -------------------- COSTANTI PER CHIAMATE API -------------------- */
const url = 'https://striveschool-api.herokuapp.com/api/product/';
const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNmU2OTBiM2IyNTAwMTUxYjU1NzYiLCJpYXQiOjE3MTUxMDUzODUsImV4cCI6MTcxNjMxNDk4NX0.6rSok5ltaSTN0pFVS7x0E4BVPRa23_EzW9D_6SHvorQ"
}

/* ---------------------------- PUNTATORI ---------------------------- */
// Container card prodotti
const productsContainer = document.getElementById('productsContainer');

// Spinner
const spinner = document.getElementById('spinner');

/* ---------------------------- FUNZIONI ----------------------------- */
// Creazione card prodotto
function createProductCard(product) {

    // Creo la card
    let card = document.createElement('div');
    
    // Aggiungo le classi tailwind
    card.classList.add('w-full', 'bg-white', 'shadow-lg', 'rounded-xl', 'lg:duration-500', 'lg:hover:scale-105', 'lg:hover:shadow-xl');
    
    // Aggiungo i contenuti del prodotto alla card
    card.innerHTML = `
        <a href="product.html?q=${product._id}">
            <img src="${product.imageUrl}" alt="${product.name}" class="aspect-[1/1] object-cover rounded-t-xl" />
            <div class="flex flex-col gap-3 p-4">
                <span class="text-gray-400 uppercase text-xs block pb-3">${product.brand}</span>
                <h3 class="text-lg text-black font-bold truncate capitalize pb-3">${product.name}</h3>
                <p class="text-gray-400 truncate text-xs pb-3">${product.description}</p>
                <p class="text-lg font-semibold text-black pb-3">$${product.price}</p>
                <a href="product.html?q=${product._id}" class="flex justify-center gap-1 text-white bg-green-600 hover:bg-green-700 rounded-lg p-3 w-full">
                    Discover more
                    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
                </a>
            </div>
        </a>
    `

    // Aggiungo la card nel container
    productsContainer.appendChild(card);
}

/* ------------------------- CRUD OPERATIONS ------------------------- */
// GET
const fetchProducts = () => {
    
    // Definisco la tipologia di request
    const request = {
        headers: headers,
    }

    // Faccio una fetch per recuperare i prodotti
    fetch(url, request)
        .then((response) => response.json())
        .then((products) => {
            // Rimuovo lo spinner
            spinner.remove();
            // Ciclo l'array dei prodotti e per ognuno di questi lancio la funzione di creazione card prodotto
            products.forEach((product) => createProductCard(product));
        })
        // Gestisco eventuali errori durante la richiesta
        .catch((error) => console.error("Errore:", error));
}

/* -------------------------- EVENT LISTNER -------------------------- */
// Lancio la funzione di fetch product al caricamento della pagina
document.addEventListener("DOMContentLoaded", fetchProducts());