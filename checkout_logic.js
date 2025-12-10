document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen DOM
    const orderItemsList = document.getElementById('order-items-list');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const shippingAmount = document.getElementById('shipping-amount');
    const totalAmount = document.getElementById('total-amount');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const shippingForm = document.getElementById('shipping-form'); 
    const cartContentWrapper = document.querySelector('.checkout-grid');

    let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
    let subtotal = 0;
    const SIMULATED_SHIPPING_COST = 25000; 

    // --- UTILITY ---
    function formatRupiah(number) {
        if (typeof number !== 'number' || isNaN(number)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // --- RENDERING PESANAN ---
    function renderOrderSummary() {
        // Cek semua elemen penting tersedia
        if (!orderItemsList || !subtotalAmount || !shippingAmount || !totalAmount) return;

        orderItemsList.innerHTML = '';
        subtotal = 0;
        
        if (cart.length === 0) {
            // Logika keranjang kosong
            orderItemsList.innerHTML = '<p style="text-align: center; padding: 20px;">Keranjang Anda kosong. Mohon kembali ke halaman Belanja.</p>';
            if (placeOrderBtn) placeOrderBtn.disabled = true;
            if (cartContentWrapper) cartContentWrapper.style.display = 'block'; 
            subtotalAmount.textContent = formatRupiah(0);
            shippingAmount.textContent = formatRupiah(0);
            totalAmount.textContent = formatRupiah(0);
            return;
        }

        if (cartContentWrapper) cartContentWrapper.style.display = 'grid'; 

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item-summary';
            itemDiv.innerHTML = `
                <p>
                    <span style="font-weight: 600;">${item.name}</span> 
                    <span style="font-size: 0.9em; margin-left: 10px;">(${item.quantity}x)</span>
                    <span style="float: right; color: var(--color-primary);">${formatRupiah(itemTotal)}</span>
                </p>
            `;
            orderItemsList.appendChild(itemDiv);
        });

        const total = subtotal + SIMULATED_SHIPPING_COST;

        subtotalAmount.textContent = formatRupiah(subtotal);
        shippingAmount.textContent = formatRupiah(SIMULATED_SHIPPING_COST);
        totalAmount.textContent = formatRupiah(total);
        if (placeOrderBtn) placeOrderBtn.disabled = false;
    }

    // --- FUNGSI SUBMIT DAN PENGALIHAN ---

    if (placeOrderBtn && shippingForm) {
        placeOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            try {
                // 1. Validasi Keranjang
                if (cart.length === 0) {
                    alert("Keranjang Anda kosong. Tidak dapat melanjutkan pembayaran.");
                    window.location.href = 'belanja.html';
                    return;
                }

                // 2. Validasi Formulir Pengiriman
                if (!shippingForm.checkValidity()) {
                    // Gunakan reportValidity() agar pesan error HTML5 muncul
                    shippingForm.reportValidity(); 
                    return;
                }

                // 3. Validasi Metode Pembayaran
                const paymentMethod = document.querySelector('input[name="payment"]:checked');
                if (!paymentMethod) {
                    alert("Mohon pilih salah satu metode pembayaran.");
                    return;
                }
                
                // --- PROSES SUKSES & PENGALIHAN ---
                
                const totalPesanan = subtotal + SIMULATED_SHIPPING_COST;

                // Debugging di Console
                console.log("Pesanan berhasil dibuat. Melakukan pengalihan...");
                
                // 4. Hapus keranjang
                localStorage.removeItem('coffeeCart');

                // 5. Notifikasi (Pop-up alert)
                alert(`Pembayaran Berhasil! Total: ${formatRupiah(totalPesanan)} telah diterima. Anda akan dialihkan ke Beranda.`);
                
                // 6. PENGALIHAN KRITIS KE INDEX.HTML
                // Jika baris ini tidak dieksekusi, berarti ada error di atasnya!
                window.location.href = 'index.html?order=success'; 
                
            } catch (error) {
                // Tangkap error jika ada masalah di JavaScript
                console.error("Kesalahan saat menyelesaikan checkout:", error);
                alert("Terjadi kesalahan sistem saat memproses pesanan. Silakan coba lagi. (Lihat console untuk detail error)");
            }
        });
    }

    // Jalankan render saat halaman dimuat
    renderOrderSummary();
});