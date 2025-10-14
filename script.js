// Menu items definition
const menuItems = [
    { name: 'Risol', price: 4000, image: 'image/risol.jpg', description: 'Risol renyah yang dibuat khusus dengan cita rasa yang lezat. Hadir dengan dua pilihan isian premium: Pisang Cokelat/Keju yang manis dan gurih, atau Beef dan Saus Mayo yang kaya rasa dan cocok dijadikan lauk maupun camilan ringan.' },
    { name: 'Nasi Bakar & Tahu/Tempe', price: 12000, image: 'image/nasi ayam.png', description: 'Nikmati Nasi Bakar Autentik dengan aroma daun pisang yang khas, menjanjikan rasa yang lezat, praktis, dan pasti mengenyangkan. Anda dapat memilih isian favorit dari varian spesial kami: Ayam Suwir, Ikan Teri, atau Ikan Tuna.' },
    { name: 'Es Teh', price: 4000, image: 'image/es teh.png', description: 'Es Teh yang diracik dari daun teh pilihan. Menghadirkan rasa manis yang pas dan sensasi kesegaran maksimal yang sangat cocok dinikmati untuk menemani hari-hari Anda.' },
    { name: 'Paket Hemat 12k', price: 12000, image: 'image/2 menu.png', description: 'Ini adalah paket hemat dengan kombinasi menu pilihan yang menawarkan harga sangat terjangkau. Paket ini berisi Es Teh dan Nasi Bakar (Anda bebas memilih isian: Ayam Suwir, Ikan Teri, atau Ikan Tuna).' },
    { name: 'Paket Hemat 15k', price: 15000, image: 'image/3 menu.png', description: 'Nikmati Paket Hemat 15K kami yang merupakan kombinasi sempurna dari hidangan autentik Lapak Nusantara. Setiap paket berisi Nasi Bakar (Anda bebas memilih isian: Ayam Suwir, Ikan Teri, atau Ikan Tuna) ditambah Es Teh segar dan Risol (Anda juga bebas memilih isian: Pisang Cokelat/Keju atau Beef dan Saus Mayo). Kami menjamin cita rasa autentik, karena setiap hidangan diracik dengan penuh kasih sayang menggunakan bahan-bahan berkualitas tinggi.' },
];

// Cart functionality using Local Storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add item to cart
function addToCart(item, price) {
    const existingItem = cart.find(cartItem => cartItem.item === item);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ item, price: parseInt(price), quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
}

// Function to generate menu items
function generateMenuItems() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-image" loading="lazy">
            <h3>${item.name}</h3>
            <p>Rp ${item.price.toLocaleString()}</p>
            <div class="menu-item-buttons">
                <button class="description-btn" onclick="showDescription('${item.name}', '${item.description.replace(/'/g, "\\'")}', '${item.image}')">🔍 Keterangan Produk</button>
                <button class="add-to-cart" data-item="${item.name}" data-price="${item.price}">🛒 Tambahkan pesanan</button>
            </div>
        `;
        menuContainer.appendChild(menuItemDiv);
    });
}

// Function to show product description
function showDescription(name, description, image) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="product-modal-content">
            <span class="close-modal">&times;</span>
            <div class="product-modal-header">
                <h2>${name}</h2>
            </div>
            <div class="product-modal-body">
                <img src="${image}" alt="${name}" class="product-modal-image" loading="lazy">
                <div class="product-modal-description">
                    <p>${description}</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="close-btn">✅ Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal functions
    const closeModal = () => {
        document.body.removeChild(modal);
    };

    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((cartItem, index) => {
        const itemTotal = cartItem.price * cartItem.quantity;
        total += itemTotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div>${cartItem.item}</div>
                <div>Rp ${cartItem.price.toLocaleString()} x ${cartItem.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${cartItem.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    cartTotal.textContent = `Total: Rp ${total.toLocaleString()}`;
    updateCartIcon();
}

// Function to change quantity
function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartDisplay();
}

// Function to update cart icon
function updateCartIcon() {
    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.querySelector('.cart-icon-container');
    
    if (cartIcon && cartContainer) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
        
        // Show cart icon only on menu page and only if there are items
        const isMenuPage = window.location.pathname.includes('menu.html') ||
                          window.location.pathname.includes('checkout.html');
        
        if (isMenuPage && totalItems > 0) {
            cartContainer.style.display = 'block';
        } else {
            cartContainer.style.display = 'none';
        }
    }
}

// Function to toggle cart modal
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Function to handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Keranjang kosong. Silakan kembali ke halaman menu untuk menambahkan item pesanan terlebih dahulu.');
        return;
    }
    window.location.href = 'checkout.html';
}

// Function to generate WhatsApp message with new template
function generateWhatsAppMessage(formData) {
    // Calculate total
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    // Build item list
    let itemList = '';
    cart.forEach(item => {
        itemList += `- ${item.item} (${item.quantity}x) - Rp ${item.price.toLocaleString()}%0A`;
    });

    // Create the message with proper URL encoding
    let message = `*Halo kak ${formData.name}!* Terima kasih banyak sudah pesan di Lapak Nusantara! Pesanan kamu sudah kami catat dengan semangat. %0A%0ABerikut rincian pesanan yang akan kami siapkan:%0A--------------------------------------------------%0A> *DETAIL PESANAN*%0A${itemList}--------------------------------------------------%0A*TOTAL AKHIR:* Rp ${total.toLocaleString()}%0A--------------------------------------------------%0A%0A> *INFO PENGIRIMAN*%0ANama: ${formData.name}%0ANomor WA: ${formData.whatsapp}%0AAlamat: ${formData.address}%0AMetode Bayar: *${formData.payment}*%0ACatatan Khusus: ${formData.notes || 'Tidak ada'}%0A%0AMohon ditunggu sebentar ya Kak, kami sedang menyiapkan hidangan terbaik untukmu. Kami akan segera konfirmasi setelah pesanan siap dijemput/dikirim!%0A--------------------------------------------------%0A*Citarasa Lokal, Yang Tak Terlupakan!*`;

    return message;
}

// Function to send WhatsApp message
function sendWhatsAppMessage(formData) {
    const message = generateWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/6282334157792?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after sending order
    cart = [];
    saveCart();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Generate menu items
    generateMenuItems();

    // Add to cart buttons with cute animation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const item = e.target.getAttribute('data-item');
            const price = e.target.getAttribute('data-price');
            addToCart(item, price);
            
            // Add cute animation feedback
            e.target.style.transform = 'scale(0.95)';
            e.target.style.background = '#45a049';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = '#4CAF50';
            }, 150);
            
            // Show success message
            showAddToCartMessage(item);
        }
    });

    // Cart icon
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCartModal);
    }

    // Close cart modal
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartModal);
    }

    // Clear all cart items
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua pesanan?')) {
                cart = [];
                saveCart();
                updateCartDisplay();
                toggleCartModal(); // Close modal after clearing
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // WhatsApp number validation
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        // Allow only numeric input
        whatsappInput.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Prevent non-numeric characters from being typed
        whatsappInput.addEventListener('keypress', function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        // Additional validation on paste
        whatsappInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.replace(/[^0-9]/g, '');
            }, 10);
        });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Additional validation for WhatsApp number
            const whatsappValue = document.getElementById('whatsapp').value;
            if (!/^[0-9]+$/.test(whatsappValue)) {
                alert('Nomor WhatsApp harus berupa angka saja tanpa karakter lain!');
                return;
            }
            
            if (whatsappValue.length < 10 || whatsappValue.length > 15) {
                alert('Nomor WhatsApp harus antara 10-15 digit!');
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value,
                whatsapp: whatsappValue,
                address: document.getElementById('address').value,
                notes: document.getElementById('notes').value,
                payment: document.getElementById('payment').value
            };
            sendWhatsAppMessage(formData);
            alert('Pesanan telah dikirim via WhatsApp. Terima kasih!');
            window.location.href = 'index.html';
        });
    }

    // Update cart display on page load
    updateCartDisplay();
});

// Function to show add to cart message
function showAddToCartMessage(itemName) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border: 2px solid #FFF;
    `;
    message.textContent = `✅ ${itemName} ditambahkan ke keranjang!`;
    document.body.appendChild(message);
    
    setTimeout(() => message.style.transform = 'translateX(0)', 100);
    setTimeout(() => message.style.transform = 'translateX(100%)', 2500);
    setTimeout(() => document.body.removeChild(message), 3000);
}
