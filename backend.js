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

// Form
const createProductForm = document.getElementById('createProductForm');
const updateProductForm = document.getElementById('updateProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

// Modali
const createProductModal = document.getElementById('createProductModal');
const updateProductModal = document.getElementById('updateProductModal');
const deleteProductModal = document.getElementById('deleteProductModal');

// Bottone apertura modale di creazione
const openModalButton = document.getElementById('openModal-button');

// Placeholder img
const placeholderImg = 'assets/placeholder.png';

/* ---------------------------- FUNZIONI ----------------------------- */
// Apri modale
function openModal(modal) {
    modal.classList.remove('hidden');
    openModalButton.classList.add('hidden');
}

// Chiudi modale
function closeModal(modal) {
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
                <button onclick="openDeleteModal('${product._id}')" class="flex justify-center gap-1 text-white bg-red-400 hover:bg-red-600 rounded-lg p-3 w-full">
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

// Gestione modale di update prodotto
function openUpdateModal(id) {

    // Apro la modale di modifica prodotto
    openModal(updateProductModal);

    // Punto la card con uno specifico id (passato dalla funzione stessa)
    const card = document.getElementById(`card-${id}`);

    // Puntatatori agli input del form
    let productNameInput = document.getElementById('updatedName');
    let productDescriptionInput = document.getElementById('updatedDescription');
    let productBrandInput = document.getElementById('updatedBrand');
    let productImageInput = document.getElementById('updatedImage');
    let productPriceInput = document.getElementById('updatedPrice');

    // Popolo gli input del form con i valori del prodotto selezionato
    productNameInput.value = card.querySelector(".product-name").innerText;
    productDescriptionInput.value = card.querySelector(".product-description").innerText;
    productBrandInput.value = card.querySelector(".product-brand").innerText;
    productImageInput.value = card.querySelector(".product-image").getAttribute('src');
    productPriceInput.value = card.querySelector(".product-price").innerText;

    // Al click sul bottone di conferma parte un listener per gestire l'aggiornamento del prodotto
    updateProductForm.addEventListener("submit", function (event) {

        // Evito il comportamento predefinito del form
        event.preventDefault();

        // Definisco i dati del prodotto da aggiornare con i valori inseriti negli input del form
        const updatedProduct = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            brand: productBrandInput.value,
            imageUrl: productImageInput.value,
            price: productPriceInput.value,
        };

        // Chiamo la funzione di aggiornamento del prodotto passandogli l'id prodotto ed il prodotto modificato
        updateProduct(id, updatedProduct);

        // Resetto il form dopo l'invio
        updateProductForm.reset();

        // Chiudo la modale
        closeModal(updateProductModal);
    });
}

// Gestione modale di update prodotto
function openDeleteModal(id) {

    // Apro la modale di cancellazione prodotto
    openModal(deleteProductModal);

    // Al click sul bottone di conferma parte un listener per gestire la cancellazione del prodotto
    deleteProductForm.addEventListener("submit", function (event) {

        // Evito il comportamento predefinito del form
        event.preventDefault();

        // Chiamo la funzione di cancellazione del prodotto passandogli l'id prodotto
        deleteProduct(id);

        // Chiudo la modale
        closeModal(deleteProductModal);
    });
}

// Formatta la data di update prodotto
function updateTime(data) {
    const dataObj = new Date(data);
    
    // Formatta il dato nel formato IT
    const updateTime = dataObj.toLocaleString('it-IT');
    
    return updateTime;
}

// Assegna un placeholder come immagine di prodotto
function usePlaceholderImg() {
    // Punto l'input dell'immagine di prodotto
    const image = document.getElementById('image');

    // Gli assegno come valore il path dell'immagine placeholder
    image.value = placeholderImg;
}

// Mostra messaggio esito azione
function messageResult(action, boolean) {

    // Costanti con valori variabili, in base al parametro booleano che riceve in input
    const bgColor = boolean ? 'bg-green-600' : 'bg-red-600'; // colore di sfondo del messaggio
    const message = boolean ? `${action} Product: operation completed successfully.` : `${action} Product: operation failed, please try again later.`; // testo del messaggio

    // Creo container messaggio
    const messageContainer = document.createElement('div');

    // Aggiungo classi tailwind
    messageContainer.classList.add( `${bgColor}`, 'p-4', 'fixed', 'z-50', 'left-[20px]', 'bottom-[20px]', 'lg:left-[40px]', 'lg:bottom-[40px]', 'text-white', 'font-semibold', 'rounded-lg', 'max-w-[280px]', 'shadow-xl');

    // Includo il testo del messaggio nel contenitore
    messageContainer.innerText = `${message}`

    // Includo il contenitore con il messaggio nella pagina
    productsContainer.appendChild(messageContainer);

    // Nascondo bottone della modale per non ingombrare il viewport mobile
    openModalButton.classList.add('hidden');

    // Imposto un timeout che allo scadere rimuove il messaggio
    setTimeout(() => {
        messageContainer.remove();
        openModalButton.classList.remove('hidden');
    }, '3000');
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

            // Mostro messaggio di successo
            messageResult('Create', true);
        })
        // Gestisco eventuali errori durante la richiesta
        .catch((error) => {
            console.error("Errore:", error);
            // Mostro messaggio di errore
            messageResult('Create', false);
        });
}

// PUT - Ho cambiato approccio rispetto a GET e POST
const updateProduct = async (id, updatedProduct) => {
    try {
        const request = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedProduct),
        }

        await fetch(`${url}/${id}`, request);

        // fetch dei prodotti
        fetchProducts();

        // Mostro messaggio di successo
        messageResult('Update', true);

    } catch(error) {
        // Gestisco eventuali errori durante la richiesta
        console.error('error:', error);

        // Mostro messaggio di errore
        messageResult('Update', false);
    }
}

// DELETE - Ho cambiato approccio rispetto a GET e POST
const deleteProduct = async (id) => {
    try {
        const request = {
            method: 'DELETE',
            headers: headers,
        }

        await fetch(`${url}/${id}`, request);

        // fetch dei prodotti
        fetchProducts();
        
        // Mostro messaggio di successo
        messageResult('Delete', true);

    } catch(error) {
        // Gestisco eventuali errori durante la richiesta
        console.error('error:', error);

        // Mostro messaggio di errore
        messageResult('Delete', false);
    }
}

/* -------------------------- EVENT LISTNER -------------------------- */
// Al click sul bottone si apre la modale di creazione prodotto
openModalButton.addEventListener("click",  () => openModal(createProductModal));

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
    closeModal(createProductModal);
});

// Lancio la funzione di fetch product al caricamento della pagina
document.addEventListener("DOMContentLoaded", () => fetchProducts());