// Khai báo biến toàn cục
let productItems = [];
let allProducts = [];

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Tải sản phẩm từ localStorage
    loadProductsFromLocalStorage();
    
    // Gắn sự kiện tìm kiếm
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Gắn sự kiện nút thêm sản phẩm
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    addProductBtn.addEventListener('click', toggleProductForm);
    cancelBtn.addEventListener('click', function() {
        toggleProductForm();
        resetAddProductForm();
    });
    
    // Gắn sự kiện submit form thêm sản phẩm
    addProductForm.addEventListener('submit', handleAddProduct);
    
    // Gắn sự kiện submit form liên hệ
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Gắn sự kiện xóa localStorage
    const clearStorageBtn = document.getElementById('clearStorage');
    clearStorageBtn.addEventListener('click', clearLocalStorage);
}

// ========== LOCALSTORAGE FUNCTIONS ==========

// Lưu sản phẩm vào localStorage
function saveProductsToLocalStorage() {
    try {
        const productsData = allProducts.map(product => ({
            name: product.name,
            price: product.price,
            desc: product.desc
        }));
        
        localStorage.setItem('products', JSON.stringify(productsData));
        console.log('Đã lưu sản phẩm vào localStorage:', productsData);
        updateStorageStatus();
    } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
        alert('Lỗi khi lưu dữ liệu!');
    }
}

// Tải sản phẩm từ localStorage
function loadProductsFromLocalStorage() {
    try {
        const savedProducts = localStorage.getItem('products');
        
        if (savedProducts) {
            // Có dữ liệu trong localStorage
            const products = JSON.parse(savedProducts);
            console.log('Đã tải sản phẩm từ localStorage:', products);
            renderProducts(products);
            allProducts = products;
            showNotification('Đã tải dữ liệu từ localStorage!', 'success');
        } else {
            // Không có dữ liệu, tạo sản phẩm mẫu
            const sampleProducts = [
                {
                    name: "Đắc Nhân Tâm",
                    price: 85000,
                    desc: "Nghệ thuật thu phục lòng người"
                },
                {
                    name: "Nhà Giả Kim",
                    price: 75000,
                    desc: "Hành trình tìm kiếm ước mơ"
                },
                {
                    name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                    price: 69000,
                    desc: "Sống hết mình khi còn trẻ"
                }
            ];
            
            console.log('Tạo sản phẩm mẫu:', sampleProducts);
            renderProducts(sampleProducts);
            allProducts = sampleProducts;
            saveProductsToLocalStorage(); // Lưu sản phẩm mẫu
            showNotification('Đã tạo dữ liệu mẫu và lưu vào localStorage!', 'success');
        }
        
        updateStorageStatus();
    } catch (error) {
        console.error('Lỗi khi tải từ localStorage:', error);
        alert('Lỗi khi tải dữ liệu!');
    }
}

// Xóa localStorage
function clearLocalStorage() {
    if (confirm('Bạn có chắc muốn xóa TẤT CẢ dữ liệu sản phẩm trong localStorage?')) {
        try {
            localStorage.removeItem('products');
            console.log('Đã xóa localStorage');
            
            // Tải lại sản phẩm mẫu
            const sampleProducts = [
                {
                    name: "Đắc Nhân Tâm",
                    price: 85000,
                    desc: "Nghệ thuật thu phục lòng người"
                },
                {
                    name: "Nhà Giả Kim",
                    price: 75000,
                    desc: "Hành trình tìm kiếm ước mơ"
                },
                {
                    name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                    price: 69000,
                    desc: "Sống hết mình khi còn trẻ"
                }
            ];
            
            renderProducts(sampleProducts);
            allProducts = sampleProducts;
            saveProductsToLocalStorage(); // Lưu lại sản phẩm mẫu
            
            showNotification('Đã xóa và khôi phục dữ liệu mẫu!', 'success');
            updateStorageStatus();
        } catch (error) {
            console.error('Lỗi khi xóa localStorage:', error);
            alert('Lỗi khi xóa dữ liệu!');
        }
    }
}

// Cập nhật trạng thái storage
function updateStorageStatus() {
    const savedProducts = localStorage.getItem('products');
    const statusText = savedProducts 
        ? `Đang lưu ${JSON.parse(savedProducts).length} sản phẩm` 
        : 'Chưa có dữ liệu';
    
    console.log('Trạng thái localStorage:', statusText);
}

// Hiển thị sản phẩm
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productElement = createProductElement(product);
        productList.appendChild(productElement);
    });
    
    // Cập nhật danh sách sản phẩm
    productItems = document.querySelectorAll('.product-item');
}

// Tạo phần tử sản phẩm
function createProductElement(product) {
    const article = document.createElement('article');
    article.className = 'product-item';
    
    article.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <p class="product-price">Giá: ${Number(product.price).toLocaleString()}đ</p>
        <div class="storage-indicator" style="font-size: 0.8rem; color: #27ae60; margin-top: 0.5rem;">
            ✓ Đã lưu trong localStorage
        </div>
    `;
    
    return article;
}

// ========== CÁC HÀM CHỨC NĂNG KHÁC ==========

// Xử lý tìm kiếm sản phẩm
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Hiển thị/ẩn form thêm sản phẩm
function toggleProductForm() {
    const form = document.getElementById('addProductForm');
    
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
}

// Reset form thêm sản phẩm
function resetAddProductForm() {
    document.getElementById('addProductForm').reset();
    document.getElementById('errorMsg').textContent = '';
}

// Xử lý thêm sản phẩm mới
function handleAddProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('newName').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const desc = document.getElementById('newDesc').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    
    if (!validateProductData(name, price, desc, errorMsg)) {
        return;
    }
    
    const newProduct = {
        name,
        price: Number(price),
        desc
    };
    
    // Thêm vào mảng và lưu vào localStorage
    allProducts.unshift(newProduct);
    saveProductsToLocalStorage();
    
    // Render lại sản phẩm
    renderProducts(allProducts);
    
    // Reset form và ẩn
    resetAddProductForm();
    toggleProductForm();
    
    // Hiển thị thông báo
    showNotification('Thêm sản phẩm thành công và đã lưu vào localStorage!', 'success');
}

// Validate dữ liệu sản phẩm
function validateProductData(name, price, desc, errorMsg) {
    if (!name) {
        errorMsg.textContent = 'Vui lòng nhập tên sản phẩm!';
        return false;
    }
    
    if (!price || isNaN(price) || Number(price) <= 0) {
        errorMsg.textContent = 'Giá phải là số dương hợp lệ!';
        return false;
    }
    
    if (!desc || desc.length < 10) {
        errorMsg.textContent = 'Mô tả phải có ít nhất 10 ký tự!';
        return false;
    }
    
    errorMsg.textContent = '';
    return true;
}

// Xử lý form liên hệ
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Giả lập gửi form thành công
    showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.', 'success');
    
    // Reset form
    event.target.reset();
}

// Hiển thị thông báo
function showNotification(message, type) {
    alert(message); // Sử dụng alert đơn giản cho Bài 5
}

// Kiểm tra localStorage khi load
console.log('Kiểm tra localStorage khi khởi động:');
console.log('LocalStorage có sẵn:', typeof(Storage) !== "undefined");
console.log('Dung lượng còn lại:', JSON.stringify(localStorage).length + ' bytes');