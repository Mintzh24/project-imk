document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dapatkan elemen counter keranjang
    const cartCountElement = document.getElementById('cart-count');
    
    // 2. Dapatkan semua tombol 'Tambah ke Keranjang'
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Inisialisasi keranjang (ambil dari local storage atau mulai dari array kosong)
    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

    // --- UTILITY: FUNGSI PATH GAMBAR ---
    
    function getImagePath(productName) {
        if (!productName) return 'assets/images/placeholder.jpg';
        
        const slug = productName.toLowerCase().replace(/\s/gg, '-');
        
        // Logika sederhana untuk menentukan path gambar berdasarkan nama produk
        if (slug.includes('gayo') || slug.includes('winey')) {
            return 'assets/images/arabika-gayo.jpg';
        } else if (slug.includes('lampung') || slug.includes('specialty')) {
            return 'assets/images/robusta-lampung.jpg';
        } else if (slug.includes('toraja') || slug.includes('sapan')) {
            return 'assets/images/toraja-sapan.jpg';
        } else if (slug.includes('kintamani') || slug.includes('bali')) {
            return 'assets/images/kintamani-bali.jpg';
        }
        return 'assets/images/placeholder.jpg';
    }

    // --- FUNGSI NOTIFIKASI VISUAL ---

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // Gaya notifikasi (Pastikan ini sesuai dengan style.css Anda)
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
    
    // --- FUNGSI PENTING: CEK NOTIFIKASI SETELAH PENGALIHAN (DARI CHECKOUT) ---

    function checkAndShowNotifications() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Cek notifikasi sukses order dari URL (?order=success)
        if (urlParams.get('order') === 'success') {
            const successMessage = '✅ Pembayaran Berhasil! Terima kasih, pesanan Anda sedang diproses.';
            showNotification(successMessage);
            
            // PENTING: Hapus parameter dari URL agar notifikasi tidak muncul lagi saat refresh
            history.replaceState(null, '', window.location.pathname);
        }
    }
    
    // --- FUNGSI KERANJANG UTAMA ---

    // Fungsi untuk memperbarui tampilan counter keranjang
    function updateCartCount() {
        // Hitung total item unik di keranjang
        const totalUniqueItems = cart.length; 
        if (cartCountElement) {
            cartCountElement.textContent = totalUniqueItems;
            // Tampilkan/Sembunyikan counter
            cartCountElement.style.display = totalUniqueItems > 0 ? 'block' : 'none';
        }
    }

    // Fungsi untuk menambahkan item ke keranjang
    function addToCart(productName, price) {
        const imagePath = getImagePath(productName);

        // Objek item baru yang disimulasikan
        const newItem = {
            id: Date.now(), 
            name: productName,
            price: price,
            quantity: 1,
            image: imagePath 
        };

        cart.push(newItem);
        localStorage.setItem('coffeeCart', JSON.stringify(cart)); // Simpan ke local storage
        
        updateCartCount();
        
        // Ganti alert() dengan notifikasi visual yang lebih modern
        showNotification(`${productName} berhasil ditambahkan ke keranjang.`);
        
        console.log(`Produk ditambahkan: ${productName}, Harga: ${price}`);
    }

    // 3. Tambahkan event listener ke setiap tombol
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah link pindah halaman

            const card = button.closest('.product-card');
            
            // Mengambil data dari elemen card
            const nameElement = card.querySelector('h3');
            const priceElement = card.querySelector('.price'); // Mengambil harga dari atribut data-price

            if (nameElement && priceElement) {
                const productName = nameElement.textContent.trim();
                // Mengambil harga dari atribut data-price
                const productPrice = parseFloat(priceElement.getAttribute('data-price')); 
                
                if (!isNaN(productPrice)) {
                    addToCart(productName, productPrice);
                } else {
                    console.error("Harga produk tidak valid. Periksa atribut data-price di HTML.");
                }
            }
        });
    });

    // Panggil saat halaman pertama kali dimuat
    updateCartCount(); 
    checkAndShowNotifications(); // Cek notifikasi dari checkout
});