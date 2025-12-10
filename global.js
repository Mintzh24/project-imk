document.addEventListener('DOMContentLoaded', () => {
    
    // Ambil elemen count keranjang dari header
    const cartCountElement = document.getElementById('cart-count');
    // Ambil semua tombol 'Tambah ke Keranjang'
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // 1. Inisialisasi Keranjang dari Local Storage
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    
    // --- UTILITY: FUNGSI PATH GAMBAR ---
    
    function getImagePath(productName) {
        if (!productName) return 'assets/images/placeholder.jpg';
        
        const slug = productName.toLowerCase().replace(/\s/g, '-');
        
        // Logika sederhana untuk menentukan path gambar berdasarkan nama produk
        if (slug.includes('gayo') || slug.includes('winey')) {
            return 'assets/images/arabika-gayo.jpg';
        } else if (slug.includes('lampung') || slug.includes('specialty')) {
            return 'assets/images/robusta-lampung.jpg';
        } else if (slug.includes('toraja') || slug.includes('wamena')) {
            return 'assets/images/toraja-sapan.jpg';
        } else if (slug.includes('kintamani') || slug.includes('blend')) {
            return 'assets/images/kintamani-bali.jpg';
        }
        return 'assets/images/placeholder.jpg';
    }


    // --- FUNGSI NOTIFIKASI VISUAL ---

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // Pastikan Anda memindahkan CSS ini ke style.css atau file CSS utama
        notification.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background-color: #4A3A2A; 
            color: #FFFFFF; 
            padding: 15px 25px; 
            border-radius: 5px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s, transform 0.5s;
            transform: translateY(-20px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(notification);
        
        // Animasi masuk
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Animasi keluar setelah 4 detik
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 500); 
        }, 4000); 
    }

    // --- FUNGSI PENTING: CEK NOTIFIKASI SETELAH PENGALIHAN ---

    function checkAndShowNotifications() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 1. Cek notifikasi sukses order dari URL (?order=success)
        if (urlParams.get('order') === 'success') {
            const successMessage = '✅ Pembayaran Berhasil! Terima kasih, pesanan Anda sedang diproses.';
            showNotification(successMessage);
            
            // PENTING: Hapus parameter dari URL agar notifikasi tidak muncul lagi saat refresh
            history.replaceState(null, '', window.location.pathname);
        }
        
        // 2. Cek notifikasi dari Local Storage (misal: notifikasi yang tertunda dari page lain)
        const storedNotification = localStorage.getItem('pendingNotification');
        if (storedNotification) {
            showNotification(storedNotification);
            // Hapus notifikasi setelah ditampilkan
            localStorage.removeItem('pendingNotification');
        }
    }
    
    // --- FUNGSI KERANJANG UTAMA ---

    function updateCartCount() {
        // Hitung total item unik di keranjang
        const totalUniqueItems = cart.length; 
        if (cartCountElement) {
            cartCountElement.textContent = totalUniqueItems;
            cartCountElement.style.display = totalUniqueItems > 0 ? 'block' : 'none';
        }
    }

    function addToCart(productName, price) {
        const newId = Date.now();
        const imagePath = getImagePath(productName);

        const newItem = {
            id: newId, 
            name: productName,
            price: price,
            quantity: 1, 
            image: imagePath 
        };

        // Tambahkan item baru
        cart.push(newItem);
        
        // 1. Simpan keranjang ke Local Storage
        localStorage.setItem('coffeeCart', JSON.stringify(cart)); 
        
        // 2. Update count di header segera
        updateCartCount();
        
        // 3. Tampilkan notifikasi penambahan item segera
        showNotification(`${productName} berhasil ditambahkan ke keranjang.`);
    }

    // Listener untuk semua tombol "Tambah ke Keranjang"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 

            const card = button.closest('.product-card');
            const nameElement = card.querySelector('h3');
            const priceElement = card.querySelector('.price');

            if (nameElement && priceElement) {
                const productName = nameElement.textContent.trim();
                const productPrice = parseFloat(priceElement.getAttribute('data-price')); 
                
                if (!isNaN(productPrice)) {
                    addToCart(productName, productPrice);
                } else {
                    console.error("Harga produk tidak valid.");
                }
            }
        });
    });

    // Panggil saat halaman pertama kali dimuat
    updateCartCount(); 
    checkAndShowNotifications(); // Memastikan notifikasi sukses order muncul di index.html
});