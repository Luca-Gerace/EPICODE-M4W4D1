/* -------------------- COSTANTI PER CHIAMATE API -------------------- */
const url = 'https://striveschool-api.herokuapp.com/api/product';
const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNhNmU2OTBiM2IyNTAwMTUxYjU1NzYiLCJpYXQiOjE3MTUxMDUzODUsImV4cCI6MTcxNjMxNDk4NX0.6rSok5ltaSTN0pFVS7x0E4BVPRa23_EzW9D_6SHvorQ"
}

/* ---------------------------- PUNTATORI ---------------------------- */
// Container card prodotti
const productsContainer = document.getElementById('productsContainer');

// Spinner
const spinner = document.getElementById('spinner');

// Form di creazione prodotto
const createProductForm = document.getElementById('createProductForm');

// Modale di creazione prodotto
const modal = document.getElementById('modal');
const openModalButton = document.getElementById('openModal-button');
const closeModalButton = document.getElementById('closeModal-button');

/* ---------------------------- FUNZIONI ----------------------------- */
// Apri modale
function openModal() {
    modal.classList.remove('hidden');
    openModalButton.classList.add('hidden');
}

// Chiudi modale
function closeModal() {
    modal.classList.add('hidden');
    openModalButton.classList.remove('hidden');
}

// Creazione card prodotto
function createProductCard(product) {
    
    // Creo la card
    let card = document.createElement('div');

    // Aggiungo le classi tailwind
    card.classList.add('w-full', 'bg-white', 'shadow-lg', 'rounded-xl', 'lg:duration-500', 'lg:hover:scale-105', 'lg:hover:shadow-xl');
    
    // Aggiungo i contenuti del prodotto alla card
    card.innerHTML = `
        <div id="card-${product._id}">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image aspect-[1/1] object-cover rounded-t-xl" />
            <div class="flex flex-col gap-3 p-4">
                <span class="product-brand text-gray-400 uppercase text-xs">${product.brand}</span>
                <strong class="product-name text-lg text-black truncate capitalize">${product.name}</strong>
                <p class="product-description text-gray-400 truncate text-xs">${product.description}</p>
                <p class="text-lg font-semibold text-black">$<span class="product-price">${product.price}</span></p>
                <button onclick="openUpdateModal('${product._id}')" class="flex justify-center gap-1 text-white bg-yellow-400 hover:bg-yellow-600 rounded-lg p-3 w-full">
                    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></svg>
                    Edit product
                </button>
                <button onclick="deleteProduct('${product._id}')" class="flex justify-center gap-1 text-white bg-red-400 hover:bg-red-600 rounded-lg p-3 w-full">
                    <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg>
                    Delete product
                </button>
                <span class="text-gray-400 truncate text-[10px] text-center">Last update: ${updateTime(product.updatedAt)}</span>
            </div>
        </div>
    `

    // Aggiungo la card nel container
    productsContainer.appendChild(card);
}

// Formatta la data di update prodotto
function updateTime(data) {
    const dataObj = new Date(data);
    
    // Formatta il dato nel formato IT
    const updateTime = dataObj.toLocaleString('it-IT');
    
    return updateTime;
}

// Editare i dati di un prodotto esistente tramite form - TODO: rinominare funzione
function openUpdateModal(id) {

    // Punto la card con uno specifico id (passato dalla funzione stessa)
    const card = document.getElementById(`card-${id}`);

    // Chiedo all'utente di inserire i nuovi dati tramite prompt
    const updateName = prompt(
        "Nuovo nome:",
        card.querySelector(".product-name").innerText
    );

    const updateDescription = prompt(
        "Nuova Descrizione:",
        card.querySelector(".product-description").innerText
    );

    const updateBrand = prompt(
        "Nuovo Brand:",
        card.querySelector(".product-brand").innerText
    );

    const updateImage = prompt(
        "Nuova immagine:",
        card.querySelector(".product-image").getAttribute('src')
    );

    const updatePrice = prompt(
        "Nuovo prezzo:",
        card.querySelector(".product-price").innerText
    );
  
    // Utilizzo i dati inseriti dall'utente per aggiornare i dati del prodotto
    const newData = {
        name: updateName,
        description: updateDescription,
        brand: updateBrand,
        imageUrl: updateImage,
        price: updatePrice,
    }

    // Chiamo la funzione di update del prodotto passandogli l'id prodotto ed i nuovi dati
    updateProduct(id, newData)

}

/* ------------------------- CRUD OPERATIONS ------------------------- */
// GET
const fetchProducts = () => {

    // Rendo visibile  lo spinner fino all'arrivo dei dati
    spinner.classList.remove('hidden');

    // Pulisco il container delle card prima di ripopolarlo
    productsContainer.innerHTML = '';

    // Definisco la tipologia di request
    const request = {
        headers: headers,
    }

    // Faccio una fetch per recuperare i prodotti
    fetch(url, request)
        .then((response) => response.json())
        .then((products) => {
            spinner.classList.add('hidden');
            // Ciclo l'array dei prodotti e per ognuno di questi lancio la funzione di creazione card prodotto
            products.forEach((product) => createProductCard(product));
        })
        // Gestisco eventuali errori durante la richiesta
        .catch((error) => console.error("Errore:", error));
}

// POST
function createProduct(newProduct) {

    // Definisco la tipologia di request
    const request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newProduct),
    };

    // Faccio una fetch per creare un nuovo prodotto
    fetch(url, request)
        .then((response) => response.json())
        .then((newProduct) => {
            // Funzione per creare una card con il nuovo prodotto
            createProductCard(newProduct);
        })
        // Gestisco eventuali errori durante la richiesta
        .catch((error) => console.error("Errore:", error));
}

// PUT - Ho cambiato approccio rispetto a GET e POST
const updateProduct = async (id, newData) => {
    try {
        const request = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(newData),
        }

        await fetch(`${url}/${id}`, request);
        createProductCard(newData);

    } catch(error) {
        console.error('error:', error)
    }

    fetchProducts();
}

// DELETE - Ho cambiato approccio rispetto a GET e POST
const deleteProduct = async (id) => {
    try {
        const request = {
            method: 'DELETE',
            headers: headers,
        }

        await fetch(`${url}/${id}`, request);

    } catch(error) {
        console.error('error:', error)
    }

    fetchProducts();
}

/* -------------------------- EVENT LISTNER -------------------------- */
// Listener alla compilazione del form di creazione prodotto
createProductForm.addEventListener("submit", function (event) {

    // Evito il comportamento predefinito del form
    event.preventDefault();

    // Puntatatori agli input del form
    const productName = document.getElementById('name');
    const productDescription = document.getElementById('description');
    const productBrand = document.getElementById('brand');
    const productImage = document.getElementById('image');
    const productPrice = document.getElementById('price');

    // Definisco il dati del nuovo prodotto con i valori inseriti negli input del form
    const newProduct = {
        name: productName.value,
        description: productDescription.value,
        brand: productBrand.value,
        imageUrl: productImage.value,
        price: productPrice.value,
    };

    // Chiamata in POST per creare il prodotto
    createProduct(newProduct);

    // Resetto il form dopo l'invio
    createProductForm.reset();
    
    // Chiudo la modale
    closeModal();
});

// Lancio la funzione di fetch product al caricamento della pagina
document.addEventListener("DOMContentLoaded", fetchProducts());