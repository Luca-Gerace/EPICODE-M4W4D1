/* -------------------- COSTANTI PER CHIAMATE API -------------------- */
const url = 'https://striveschool-api.herokuapp.com/api/product/';
const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNmU2OTBiM2IyNTAwMTUxYjU1NzYiLCJpYXQiOjE3MTUxMDUzODUsImV4cCI6MTcxNjMxNDk4NX0.6rSok5ltaSTN0pFVS7x0E4BVPRa23_EzW9D_6SHvorQ"
}

/* ---------------------------- PUNTATORI ---------------------------- */
// Container prodotto
const productContainer = document.getElementById('productContainer');

// Spinner
const spinner = document.getElementById('spinner');

// Title pagina
const pageTitle = document.querySelector('title');

// Link per tornare indietro
const goBack = document.getElementById('goBack');

/* ------------------------ URL SEARCH PARAMS ------------------------ */
const params = new URLSearchParams(window.location.search);

// Get id prodotto dalla url
const productId = params.get('q');


/* ---------------------------- FUNZIONI ----------------------------- */
// Creazione prodotto
function createProduct(product) {

    // Creo il contenitore del prodotto
    let productInfo = document.createElement('div');

    // Aggiungo le classi tailwind
    productInfo.classList.add('w-full', 'flex', 'flex-col', 'md:flex-row', 'gap-4');

    // Aggiungo i contenuti del prodotto
    productInfo.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="w-full md:w-1/2 aspect-[1/1] object-cover rounded-xl" />
        <div class="w-full md:w-1/2 flex flex-col gap-4 p-4">
            <h1 class="text-[32px] md:text-[56px] text-black capitalize">${product.name}</h1>
            <span class="text-gray-400 uppercase text-xs">${product.brand}</span>
            <p class="text-gray-400">${product.description}</p>
            <p class="text-lg font-semibold text-black pt-3">$${product.price}</p>
        </div>
    `
    
    // Rimuovo lo spinner
    spinner.remove();

    // Aggiungo il prodotto al container
    productContainer.appendChild(productInfo);
}

/* ------------------------- CRUD OPERATIONS ------------------------- */
// GET
const fetchProduct = async () => {
    
    try {
        const request = {
            headers: headers,
        }

        const response = await fetch(`${url}/${productId}`, request);
        const product = await response.json();

        // Riscrivo il title della pagina
        pageTitle.innerHTML = `Phone Deals | ${product.brand} ${product.name}`;

        // Parte la fuzione che crea i contenuti della pagina prodotto
        createProduct(product)

    } catch(error) {
        console.error('error:', error)
    }
}

/* -------------------------- EVENT LISTNER -------------------------- */
// Lancio la funzione di fetch product al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => fetchProduct());

// Al click torno nella pagina navigata in precedenza
goBack.addEventListener("click", () => window.history.back());