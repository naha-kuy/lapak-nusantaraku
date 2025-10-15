// Menu items definition with enhanced data structure
const menuItems = [
    {
        name: 'Risol',
        price: 4000,
        image: 'image/risol.jpg',
        description: 'Risol renyah yang dibuat khusus dengan cita rasa yang lezat. Hadir dengan dua pilihan isian premium: Pisang Cokelat/Keju yang manis dan gurih, atau Beef dan Saus Mayo yang kaya rasa dan cocok dijadikan lauk maupun camilan ringan.',
        category: 'snack'
    },
    {
        name: 'Nasi Bakar + Tahu/Tempe',
        price: 12000,
        image: 'image/nasi ayam.png',
        description: 'Nikmati Nasi Bakar Autentik dengan aroma daun pisang yang khas, menjanjikan rasa yang lezat, praktis, dan pasti mengenyangkan. Anda dapat memilih isian favorit dari varian spesial kami: Ayam Suwir, Ikan Teri, atau Ikan Tuna.',
        category: 'main'
    },
    {
        name: 'Es Teh',
        price: 4000,
        image: 'image/es teh.png',
        description: 'Es Teh yang diracik dari daun teh pilihan. Menghadirkan rasa manis yang pas dan sensasi kesegaran maksimal yang sangat cocok dinikmati untuk menemani hari-hari Anda.',
        category: 'drink'
    },
    {
        name: 'Paket Hemat 12k',
        price: 12000,
        image: 'image/2 menu.png',
        description: 'Ini adalah paket hemat dengan kombinasi menu pilihan yang menawarkan harga sangat terjangkau. Paket ini berisi Es Teh dan Nasi Bakar (Anda bebas memilih isian: Ayam Suwir, Ikan Teri, atau Ikan Tuna).',
        category: 'package'
    },
    {
        name: 'Paket Hemat 15k',
        price: 15000,
        image: 'image/3 menu.png',
        description: 'Nikmati Paket Hemat 15K kami yang merupakan kombinasi sempurna dari hidangan autentik Lapak Nusantara. Setiap paket berisi Nasi Bakar (Anda bebas memilih isian: Ayam Suwir, Ikan Teri, atau Ikan Tuna) ditambah Es Teh segar dan Risol (Anda juga bebas memilih isian: Pisang Cokelat/Keju atau Beef dan Saus Mayo). Kami menjamin cita rasa autentik, karena setiap hidangan diracik dengan penuh kasih sayang menggunakan bahan-bahan berkualitas tinggi.',
        category: 'package'
    },
];

// Cart functionality using Local Storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add item to cart with error handling
function addToCart(item, price) {
    try {
        if (!item || !price || isNaN(price) || price <= 0) {
            console.error('Invalid item or price:', { item, price });
            showAddToCartMessage('Terjadi kesalahan saat menambah item ke keranjang');
            return;
        }

        const existingItem = cart.find(cartItem => cartItem.item === item);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ item, price: parseInt(price), quantity: 1 });
        }
        saveCart();
        updateCartDisplay();
    } catch (error) {
        console.error('Error adding item to cart:', error);
        showAddToCartMessage('Terjadi kesalahan saat menambah item ke keranjang');
    }
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
                <button class="add-to-cart" data-item="${item.name}" data-price="${item.price}">🛒 Tambah ke Keranjang</button>
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

// Function to change quantity with validation
function changeQuantity(index, change) {
    try {
        if (index < 0 || index >= cart.length) {
            console.error('Invalid cart index:', index);
            return;
        }

        if (!Number.isInteger(change) || change === 0) {
            console.error('Invalid quantity change:', change);
            return;
        }

        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartDisplay();
    } catch (error) {
        console.error('Error changing quantity:', error);
        showAddToCartMessage('Terjadi kesalahan saat mengubah jumlah');
    }
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

// Function to clear all items from cart with better UX
function clearCart() {
    try {
        if (!cart || cart.length === 0) {
            showAddToCartMessage('Keranjang sudah kosong! 🛒');
            return;
        }

        // Show confirmation dialog with better messaging
        const confirmClear = confirm('🗑️ Yakin ingin menghapus semua pesanan dari keranjang? Tindakan ini tidak dapat dibatalkan.');
        if (confirmClear) {
            cart = [];
            saveCart();
            updateCartDisplay();
            showAddToCartMessage('Semua pesanan telah dihapus! 🗑️');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        showAddToCartMessage('Terjadi kesalahan saat menghapus keranjang', true);
    }
}

// Function to handle checkout with validation
function handleCheckout() {
    try {
        if (!cart || cart.length === 0) {
            alert('Keranjang kosong. Silakan kembali ke halaman menu untuk menambahkan item pesanan terlebih dahulu.');
            return;
        }

        // Validate cart items
        const invalidItems = cart.filter(item =>
            !item.item || !item.price || item.quantity <= 0
        );

        if (invalidItems.length > 0) {
            console.error('Invalid cart items found:', invalidItems);
            alert('Ada item tidak valid di keranjang. Silakan refresh halaman dan coba lagi.');
            return;
        }

        window.location.href = 'checkout.html';
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Terjadi kesalahan saat memproses checkout. Silakan coba lagi.');
    }
}

// Function to generate WhatsApp message with improved formatting and line breaks
function generateWhatsAppMessage(formData) {
    try {
        if (!formData || !cart || cart.length === 0) {
            throw new Error('Invalid form data or empty cart');
        }

        // Calculate total with validation
        let total = 0;
        cart.forEach(item => {
            if (item.price && item.quantity) {
                total += item.price * item.quantity;
            }
        });

        if (total <= 0) {
            throw new Error('Invalid total amount');
        }

        // Build item list with proper formatting
        let itemList = '';
        cart.forEach(item => {
            if (item.item && item.price && item.quantity) {
                itemList += `- ${item.item} (${item.quantity}x) - Rp ${item.price.toLocaleString('id-ID')}\n`;
            }
        });

        if (!itemList.trim()) {
            throw new Error('No valid items in cart');
        }

        // Create the message with proper WhatsApp formatting
        const message = `*LAPAK NUSANTARA - PESANAN BARU*

*Halo Kak ${formData.name}!*
Terima kasih banyak sudah pesan di Lapak Nusantara! Pesanan kamu sudah kami catat ya, berikut detail pesananmu:


> *DETAIL PESANAN*
${itemList}
━━━━━━━━━━━━━━━━
*TOTAL PEMBAYARAN:* Rp ${total.toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━

> *INFORMASI PENGIRIMAN*
*Nama:* ${formData.name}
*Nomor WA:* ${formData.whatsapp}
*Alamat Pengantaran:* ${formData.address}
*Metode Bayar:* ${formData.payment}
*Catatan:* ${formData.notes || 'Tidak ada'}

━━━━━━━━━━━━━━━━━━━━━━
*Mohon ditunggu sebentar ya Kak!*
Kami sedang menyiapkan hidangan terbaik. Kami akan segera konfirmasi setelah pesanan siap diantar/dijemput!

*Citarasa Lokal, Yang Tak Terlupakan!*
━━━━━━━━━━━━━━━━`;

        return message;
    } catch (error) {
        console.error('Error generating WhatsApp message:', error);
        return null;
    }
}

// Function to send WhatsApp message with improved error handling and user feedback
function sendWhatsAppMessage(formData) {
    try {
        if (!formData || typeof formData !== 'object') {
            throw new Error('Invalid form data provided');
        }

        const message = generateWhatsAppMessage(formData);
        if (!message) {
            throw new Error('Failed to generate WhatsApp message');
        }

        // Use proper URL encoding for WhatsApp
        const whatsappUrl = `https://wa.me/6285608934919?text=${encodeURIComponent(message)}`;

        console.log('Generated WhatsApp URL:', whatsappUrl); // For debugging

        // Open WhatsApp in new tab
        const whatsappWindow = window.open(whatsappUrl, '_blank');

        if (!whatsappWindow) {
            alert('Popup blocker mungkin aktif. Silakan izinkan popup untuk website ini dan coba lagi.');
            return;
        }

        // Show success message before clearing cart
        showAddToCartMessage('✅ Pesanan berhasil dikirim via WhatsApp!');

        // Clear cart after a short delay to allow user to see the success message
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartDisplay();
        }, 2000);

        console.log('Order sent successfully via WhatsApp');
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        showAddToCartMessage('❌ Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.', true);
    }
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

            // Show success message with item name
            showAddToCartMessage(`${item} sudah ditambahkan ke keranjang`);
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

    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
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

    // Checkout form with enhanced validation
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            try {
                // Get form elements
                const nameInput = document.getElementById('name');
                const whatsappInput = document.getElementById('whatsapp');
                const addressInput = document.getElementById('address');
                const paymentInput = document.getElementById('payment');

                if (!nameInput || !whatsappInput || !addressInput || !paymentInput) {
                    alert('Form tidak lengkap. Silakan refresh halaman dan coba lagi.');
                    return;
                }

                const name = nameInput.value.trim();
                const whatsappValue = whatsappInput.value.trim();
                const address = addressInput.value.trim();
                const payment = paymentInput.value;

                // Validation
                if (!name || name.length < 2) {
                    alert('Nama harus diisi minimal 2 karakter!');
                    nameInput.focus();
                    return;
                }

                if (!whatsappValue || !/^[0-9]+$/.test(whatsappValue)) {
                    alert('Nomor WhatsApp harus berupa angka saja tanpa karakter lain!');
                    whatsappInput.focus();
                    return;
                }

                if (whatsappValue.length < 10 || whatsappValue.length > 15) {
                    alert('Nomor WhatsApp harus antara 10-15 digit!');
                    whatsappInput.focus();
                    return;
                }

                if (!address || address.length < 1) {
                    alert('Alamat pengantaran harus diisi!');
                    addressInput.focus();
                    return;
                }

                if (!payment) {
                    alert('Silakan pilih metode pembayaran!');
                    paymentInput.focus();
                    return;
                }

                const formData = {
                    name: name,
                    whatsapp: whatsappValue,
                    address: address,
                    notes: document.getElementById('notes').value.trim(),
                    payment: payment
                };
    
                // Send WhatsApp message (this will handle success/error messages)
                sendWhatsAppMessage(formData);
    
                // Redirect after a delay to allow user to see the success message
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } catch (error) {
                console.error('Error processing checkout form:', error);
                alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
            }
        });
    }

    // Update cart display on page load
    updateCartDisplay();
});

// Function to show add to cart message with improved accessibility
function showAddToCartMessage(messageText, isError = false) {
    const message = document.createElement('div');
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 'linear-gradient(135deg, #ffbf00, #45a049)'};
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        z-index: 10000;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border: 2px solid #FFF;
        max-width: 300px;
        word-wrap: break-word;
    `;
    message.textContent = messageText;
    document.body.appendChild(message);

    setTimeout(() => message.style.transform = 'translateX(0)', 100);
    setTimeout(() => message.style.transform = 'translateX(100%)', 2500);
    setTimeout(() => {
        if (message.parentNode) {
            document.body.removeChild(message);
        }
    }, 3000);
}
