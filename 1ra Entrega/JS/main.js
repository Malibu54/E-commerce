document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productImageInput = document.getElementById('productImage');

    const viewCartBtn = document.getElementById('viewCartBtn');
    const cartCountSpan = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeButtons = document.querySelectorAll('.close-button');

    const paymentModal = document.getElementById('paymentModal');
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');

    const confirmationModal = document.getElementById('confirmationModal');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');

    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: 'Smart TV 4K', description: 'Televisor de 55 pulgadas con resolución 4K y Smart TV.', price: 599.99, image: 'https://pixelstore.com.ar/wp-content/uploads/2021/09/smart-tv-samsung-.jpg' },
        { id: 2, name: 'Auriculares Bluetooth', description: 'Auriculares inalámbricos con cancelación de ruido.', price: 89.99, image: 'https://http2.mlstatic.com/D_NQ_NP_2X_726567-MLA82657750273_022025-F.webp' },
        { id: 3, name: 'Smartphone Pro X', description: 'Último modelo de smartphone con cámara de alta resolución.', price: 999.00, image: 'https://i.blogs.es/596967/pro1x2/1366_2000.jpg' },
        { id: 4, name: 'Laptop Ultrabook', description: 'Portátil ligero y potente para trabajo y estudio.', price: 1200.50, image: 'https://images-cdn.ubuy.co.in/633a9caab650634f7519663e-gpd-p2-max-2022-portable-ultrabook.jpg' },
        { id: 5, name: 'Reloj Inteligente', description: 'Monitor de actividad física y notificaciones.', price: 150.00, image: 'https://www.heavenimagenes.com/heavencommerce/68ac9d04-8767-4aca-9951-49f2fea1383b/images/v2/GENERICO/25098_medium.jpg' }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let carouselIndex = 0;

    // --- Funciones de Productos ---

    function renderProducts() {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=Producto'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button data-id="${product.id}">Agregar al Carrito</button>
            `;
            productsContainer.appendChild(productCard);
        });
        updateCarouselPosition(); // Ajusta la posición del carrusel después de renderizar
    }

    function addProduct(event) {
        event.preventDefault();
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: productNameInput.value,
            description: productDescriptionInput.value,
            price: parseFloat(productPriceInput.value),
            image: productImageInput.value
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        addProductForm.reset();
    }

    // --- Funciones de Carrito ---

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
            alert(`${product.name} ha sido agregado al carrito.`);
        }
    }

    function renderCart() {
        cartItemsDiv.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div class="item-quantity">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="item-quantity-input">
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">X</button>
                `;
                cartItemsDiv.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = total.toFixed(2);
    }

    function updateCartItemQuantity(productId, newQuantity) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = newQuantity;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
            }
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    }

    // --- Funciones de Modales ---

    function openModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // --- Funciones de Carrusel ---

    function updateCarouselPosition() {
        const productCardWidth = document.querySelector('.product-card') ? document.querySelector('.product-card').offsetWidth + 20 : 0; // Ancho de la tarjeta + margin-right
        carouselTrack.style.transform = `translateX(-${carouselIndex * productCardWidth}px)`;
    }

    function showNextProducts() {
        if (carouselIndex < products.length - (window.innerWidth > 900 ? 3 : 1) ) { // Muestra 3 en escritorio, 1 en móvil
            carouselIndex++;
            updateCarouselPosition();
        } else {
            carouselIndex = 0; // Vuelve al inicio
            updateCarouselPosition();
        }
    }

    function showPrevProducts() {
        if (carouselIndex > 0) {
            carouselIndex--;
            updateCarouselPosition();
        } else {
            carouselIndex = Math.max(0, products.length - (window.innerWidth > 900 ? 3 : 1) ); // Va al final
            updateCarouselPosition();
        }
    }

    // --- Event Listeners ---

    addProductForm.addEventListener('submit', addProduct);

    productsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.dataset.id) {
            addToCart(parseInt(event.target.dataset.id));
        }
    });

    viewCartBtn.addEventListener('click', () => {
        renderCart();
        openModal(cartModal);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            closeModal(cartModal);
        }
        if (event.target === paymentModal) {
            closeModal(paymentModal);
        }
        if (event.target === confirmationModal) {
            closeModal(confirmationModal);
        }
    });

    cartItemsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = parseInt(event.target.dataset.id);
            removeFromCart(productId);
        }
    });

    cartItemsDiv.addEventListener('change', (event) => {
        if (event.target.classList.contains('item-quantity-input')) {
            const productId = parseInt(event.target.dataset.id);
            const newQuantity = parseInt(event.target.value);
            updateCartItemQuantity(productId, newQuantity);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos para continuar.');
            return;
        }
        closeModal(cartModal);
        openModal(paymentModal);
    });

    confirmPurchaseBtn.addEventListener('click', () => {
        // Simulación de procesamiento de pago
        alert('Procesando tu pago (simulado)...');
        setTimeout(() => {
            closeModal(paymentModal);
            openModal(confirmationModal);
            cart = []; // Vaciar el carrito después de la compra
            saveCart();
        }, 1500); // Simula un retardo para el procesamiento
    });

    continueShoppingBtn.addEventListener('click', () => {
        closeModal(confirmationModal);
    });

    // Carousel buttons
    nextButton.addEventListener('click', showNextProducts);
    prevButton.addEventListener('click', showPrevProducts);

    // Initial renders
    renderProducts();
    updateCartCount();
    window.addEventListener('resize', updateCarouselPosition); // Ajusta el carrusel al redimensionar la ventana
});