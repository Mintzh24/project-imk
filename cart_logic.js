document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) {
        return;
    }

    const cartBody = document.getElementById('cart-body');
    const emptyMessage = document.getElementById('empty-cart-message');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const cartCountElement = document.getElementById('cart-count'); // Ambil count di header

    // Mengambil data keranjang dari Local Storage
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // Fungsi untuk mengupdate cart count di header (duplikasi dari global.js agar selalu sinkron)
    function updateHeaderCartCount() {
        const totalUniqueItems = cart.length; 
        cartCountElement.textContent = totalUniqueItems;
        cartCountElement.style.display = totalUniqueItems > 0 ? 'block' : 'none';
    }

    // --- FUNGSI UTAMA: MENAMPILKAN KERANJANG ---
    function renderCart() {
        cartBody.innerHTML = ''; 
        let subtotal = 0;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            document.querySelector('.cart-content-wrapper').style.display = 'none';
            document.querySelector('#cart-table').style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            document.querySelector('.cart-content-wrapper').style.display = 'flex';
            document.querySelector('#cart-table').style.display = 'table';
            
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="product-info" data-label="Produk">
                        <img src="${item.image}" alt="${item.name}">
                        <span>${item.name}</span>
                    </td>
                    <td data-label="Harga">${formatRupiah(item.price)}</td>
                    <td data-label="Jumlah">
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                    </td>
                    <td data-label="Subtotal">${formatRupiah(itemSubtotal)}</td>
                    <td data-label="Hapus">
                        <i class="fas fa-trash-alt remove-item" data-id="${item.id}"></i>
                    </td>
                `;
                cartBody.appendChild(row);
            });
        }
        
        // Update Ringkasan
        summarySubtotal.textContent = formatRupiah(subtotal);
        summaryTotal.textContent = formatRupiah(subtotal); 

        // Update count di header
        updateHeaderCartCount();
        
        addEventListeners();
    }

    // --- FUNGSI UNTUK MENGHAPUS/UPDATE ITEM ---
    function addEventListeners() {
        // Hapus listener lama (jika ada) sebelum menambahkan yang baru
        
        // 1. Event Listener Hapus Item
        document.querySelectorAll('.remove-item').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                cart = cart.filter(item => item.id !== itemId);
                updateCartStorage();
            });
        });

        // 2. Event Listener Ubah Jumlah
        document.querySelectorAll('.item-quantity').forEach(input => {
            // Pastikan listener hanya ditambahkan sekali
            input.removeEventListener('change', handleQuantityChange);
            input.addEventListener('change', handleQuantityChange);
        });
    }

    function handleQuantityChange(e) {
        const itemId = parseInt(e.target.getAttribute('data-id'));
        let newQuantity = parseInt(e.target.value);

        if (newQuantity < 1 || isNaN(newQuantity)) {
            newQuantity = 1;
            e.target.value = 1;
        }

        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
        }
        updateCartStorage();
    }


    // --- FUNGSI UNTUK MENYIMPAN DAN MERENDER ULANG ---
    function updateCartStorage() {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        renderCart();
    }

    // Mulai saat halaman dimuat
    renderCart();
});document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) {
        return;
    }

    const cartBody = document.getElementById('cart-body');
    const emptyMessage = document.getElementById('empty-cart-message');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const cartCountElement = document.getElementById('cart-count'); // Ambil count di header

    // Mengambil data keranjang dari Local Storage
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // Fungsi untuk mengupdate cart count di header (duplikasi dari global.js agar selalu sinkron)
    function updateHeaderCartCount() {
        const totalUniqueItems = cart.length; 
        cartCountElement.textContent = totalUniqueItems;
        cartCountElement.style.display = totalUniqueItems > 0 ? 'block' : 'none';
    }

    // --- FUNGSI UTAMA: MENAMPILKAN KERANJANG ---
    function renderCart() {
        cartBody.innerHTML = ''; 
        let subtotal = 0;

        if (cart.length === 0) {
            emptyMessage.style.display = 'block';
            document.querySelector('.cart-content-wrapper').style.display = 'none';
            document.querySelector('#cart-table').style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            document.querySelector('.cart-content-wrapper').style.display = 'flex';
            document.querySelector('#cart-table').style.display = 'table';
            
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="product-info" data-label="Produk">
                        <img src="${item.image}" alt="${item.name}">
                        <span>${item.name}</span>
                    </td>
                    <td data-label="Harga">${formatRupiah(item.price)}</td>
                    <td data-label="Jumlah">
                        <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                    </td>
                    <td data-label="Subtotal">${formatRupiah(itemSubtotal)}</td>
                    <td data-label="Hapus">
                        <i class="fas fa-trash-alt remove-item" data-id="${item.id}"></i>
                    </td>
                `;
                cartBody.appendChild(row);
            });
        }
        
        // Update Ringkasan
        summarySubtotal.textContent = formatRupiah(subtotal);
        summaryTotal.textContent = formatRupiah(subtotal); 

        // Update count di header
        updateHeaderCartCount();
        
        addEventListeners();
    }

    // --- FUNGSI UNTUK MENGHAPUS/UPDATE ITEM ---
    function addEventListeners() {
        // Hapus listener lama (jika ada) sebelum menambahkan yang baru
        
        // 1. Event Listener Hapus Item
        document.querySelectorAll('.remove-item').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                cart = cart.filter(item => item.id !== itemId);
                updateCartStorage();
            });
        });

        // 2. Event Listener Ubah Jumlah
        document.querySelectorAll('.item-quantity').forEach(input => {
            // Pastikan listener hanya ditambahkan sekali
            input.removeEventListener('change', handleQuantityChange);
            input.addEventListener('change', handleQuantityChange);
        });
    }

    function handleQuantityChange(e) {
        const itemId = parseInt(e.target.getAttribute('data-id'));
        let newQuantity = parseInt(e.target.value);

        if (newQuantity < 1 || isNaN(newQuantity)) {
            newQuantity = 1;
            e.target.value = 1;
        }

        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
        }
        updateCartStorage();
    }


    // --- FUNGSI UNTUK MENYIMPAN DAN MERENDER ULANG ---
    function updateCartStorage() {
        localStorage.setItem('coffeeCart', JSON.stringify(cart));
        renderCart();
    }

    // Mulai saat halaman dimuat
    renderCart();
});