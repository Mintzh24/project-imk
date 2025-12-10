document.addEventListener('DOMContentLoaded', () => {
    const shopContainer = document.querySelector('.shop-container');
    if (!shopContainer) {
        return; 
    }

    // --- LOGIKA MOBILE TOGGLE FILTER ---
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const sidebarFilter = document.getElementById('sidebar-filter');

    if (filterToggleBtn && sidebarFilter) {
        filterToggleBtn.addEventListener('click', () => {
            sidebarFilter.classList.toggle('open');
            if (sidebarFilter.classList.contains('open')) {
                filterToggleBtn.innerHTML = '<i class="fas fa-times"></i> Tutup Filter';
            } else {
                filterToggleBtn.innerHTML = '<i class="fas fa-filter"></i> Tampilkan Filter';
            }
        });
    }

    // --- FUNGSI UTAMA: MENERAPKAN SEMUA FILTER ---

    function applyFilters() {
        const productCards = document.querySelectorAll('.shop-product-grid .product-card');
        
        // 1. Ambil Nilai Filter Checkbox
        const activeCategories = Array.from(document.querySelectorAll('.sidebar-filter input[name="category"]:checked')).map(cb => cb.value);
        const activeRoasts = Array.from(document.querySelectorAll('.sidebar-filter input[name="roast"]:checked')).map(cb => cb.value);
        
        // 2. Ambil Nilai Filter Harga (dari <select>)
        const priceFilterValue = document.getElementById('price-filter').value;

        // DEBUGGING: Cek apakah filter terdeteksi
        // console.log("Fungsi Filter Dipanggil!");
        // console.log("Kategori Aktif:", activeCategories);
        // console.log("Sangrai Aktif:", activeRoasts);
        // console.log("Filter Harga:", priceFilterValue);

        productCards.forEach(card => {
            // Ambil data dari atribut HTML produk
            const cardCategory = card.getAttribute('data-kategori');
            const cardRoast = card.getAttribute('data-sangrai');
            const cardPrice = parseFloat(card.getAttribute('data-price-value')); 

            // --- Cek Kecocokan Filter ---
            
            // Kategori dan Sangrai: True jika (tidak ada filter dipilih) ATAU (nilai kartu ada di filter yang dipilih)
            const categoryMatch = activeCategories.length === 0 || activeCategories.includes(cardCategory);
            const roastMatch = activeRoasts.length === 0 || activeRoasts.includes(cardRoast);
            
            // Harga
            let priceMatch = true;
            if (priceFilterValue === 'low') {
                // Di bawah Rp 100.000
                priceMatch = cardPrice < 100000; 
            } else if (priceFilterValue === 'high') {
                // Rp 100.000 ke Atas
                priceMatch = cardPrice >= 100000; 
            }

            // Tampilkan/Sembunyikan kartu: Hanya tampil jika SEMUA kondisi cocok
            if (categoryMatch && roastMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // --- EVENT LISTENERS ---

    // 1. Listener untuk Checkbox dan Select Harga (Agar perubahan terlihat real-time)
    document.querySelectorAll('.sidebar-filter input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }

    // 2. Listener untuk Tombol "Terapkan Filter"
    const filterButton = document.querySelector('.filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah refresh
            applyFilters();
            
            // Tutup sidebar di mobile setelah filter diterapkan
            if (window.innerWidth <= 992 && sidebarFilter.classList.contains('open')) {
                 sidebarFilter.classList.remove('open');
                 filterToggleBtn.innerHTML = '<i class="fas fa-filter"></i> Tampilkan Filter';
            }
        });
    }

    // Jalankan filter sekali saat halaman dimuat
    applyFilters(); 
});