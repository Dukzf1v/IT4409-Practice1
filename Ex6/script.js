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
    
    // Gắn sự kiện scroll cho header
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Gắn sự kiện tìm kiếm real-time
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Gắn sự kiện filter
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    priceFilter.addEventListener('change', handleFilter);
    sortFilter.addEventListener('change', handleFilter);
    
    // Gắn sự kiện nút thêm sản phẩm với ripple effect
    const addProductBtn = document.getElementById('addProductBtn');
    const searchBtn = document.getElementById('searchBtn');
    
    addProductBtn.addEventListener('click', function(e) {
        createRippleEffect(e);
        toggleProductForm();
    });
    
    searchBtn.addEventListener('click', function(e) {
        createRippleEffect(e);
        handleSearch();
    });
    
    // Gắn sự kiện form
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    addProductForm.addEventListener('submit', handleAddProduct);
    cancelBtn.addEventListener('click', function() {
        toggleProductForm();
        resetAddProductForm();
    });
    
    // Gắn sự kiện form liên hệ
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Gắn sự kiện xóa localStorage
    const clearStorageBtn = document.getElementById('clearStorage');
    clearStorageBtn.addEventListener('click', clearLocalStorage);
}

// ========== HIỆU ỨNG HEADER SCROLL ==========
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ========== HIỆU ỨNG RIPPLE ==========
function createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// ========== DEBOUNCE CHO TÌM KIẾM ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== HIỆU ỨNG FORM ==========
function toggleProductForm() {
    const form = document.getElementById('addProductForm');
    
    if (form.classList.contains('form-hidden')) {
        form.classList.remove('form-hidden');
        form.classList.add('form-visible');
    } else {
        form.classList.remove('form-visible');
        form.classList.add('form-hidden');
    }
}

// ========== HIỆU ỨNG SẢN PHẨM ==========
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    
    // Thêm hiệu ứng loading
    productList.classList.add('loading');
    
    setTimeout(() => {
        productList.innerHTML = '';
        
        if (products.length === 0) {
            productList.innerHTML = `
                <div style="text-align: center; padding: 2rem; width: 100%;">
                    <p style="color: #7f8c8d; font-style: italic;">Không tìm thấy sản phẩm nào</p>
                </div>
            `;
            productList.classList.remove('loading');
            return;
        }
        
        products.forEach((product, index) => {
            const productElement = createProductElement(product);
            
            // Thêm hiệu ứng xuất hiện tuần tự
            setTimeout(() => {
                productList.appendChild(productElement);
                setTimeout(() => {
                    productElement.classList.add('visible');
                }, 50);
            }, index * 100);
        });
        
        productItems = document.querySelectorAll('.product-item');
        productList.classList.remove('loading');
        
    }, 500);
}

function createProductElement(product) {
    const article = document.createElement('article');
    article.className = 'product-item';
    article.setAttribute('data-price', product.price);
    article.setAttribute('data-category', product.category || '');
    
    article.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <p class="product-price">Giá: ${Number(product.price).toLocaleString()}đ</p>
        ${product.category ? `<p class="product-category">${product.category}</p>` : ''}
        <div class="product-actions">
            <button class="delete-btn" onclick="deleteProductWithAnimation('${product.name}')">Xóa</button>
        </div>
        <div style="font-size: 0.8rem; color: #27ae60; margin-top: 0.5rem;">
            ✓ Đã lưu trong localStorage
        </div>
    `;
    
    // Thêm hiệu ứng click cho sản phẩm
    article.addEventListener('click', function(e) {
        if (!e.target.classList.contains('delete-btn')) {
            animateProductClick(this);
        }
    });
    
    return article;
}

function animateProductClick(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

// ========== HIỆU ỨNG XÓA SẢN PHẨM ==========
function deleteProductWithAnimation(productName) {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
        // Tìm phần tử DOM
        const productElement = Array.from(productItems).find(item => 
            item.querySelector('.product-name').textContent === productName
        );
        
        if (productElement) {
            // Thêm hiệu ứng fade out
            productElement.classList.add('fade-out');
            
            setTimeout(() => {
                // Xóa khỏi mảng
                allProducts = allProducts.filter(product => product.name !== productName);
                
                // Lưu vào localStorage
                saveProductsToLocalStorage();
                
                // Render lại
                renderProducts(allProducts);
                
                // Hiển thị thông báo
                showNotification('Đã xóa sản phẩm thành công!', 'success');
            }, 400);
        }
    }
}

// ========== TÌM KIẾM & LỌC NÂNG CAO ==========
function handleSearch() {
    applyFilters();
}

function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const priceFilter = document.getElementById('priceFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filteredProducts = [...allProducts];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.desc.toLowerCase().includes(searchTerm) ||
            (product.category && product.category.toLowerCase().includes(searchTerm))
        );
    }
    
    // Lọc theo giá
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product =>
            product.price >= min && product.price <= max
        );
    }
    
    // Sắp xếp
    filteredProducts.sort((a, b) => {
        switch (sortFilter) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
    
    renderProducts(filteredProducts);
}

// ========== NOTIFICATION TOAST ==========
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Hiệu ứng xuất hiện
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Tự động biến mất sau 3 giây
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== LOCALSTORAGE FUNCTIONS ==========
function saveProductsToLocalStorage() {
    try {
        const productsData = allProducts.map(product => ({
            name: product.name,
            price: product.price,
            desc: product.desc,
            category: product.category || ''
        }));
        
        localStorage.setItem('products', JSON.stringify(productsData));
    } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
        showNotification('Lỗi khi lưu dữ liệu!', 'error');
    }
}

function loadProductsFromLocalStorage() {
    try {
        const savedProducts = localStorage.getItem('products');
        
        if (savedProducts) {
            const products = JSON.parse(savedProducts);
            renderProducts(products);
            allProducts = products;
        } else {
            const sampleProducts = [
                {
                    name: "Đắc Nhân Tâm",
                    price: 85000,
                    desc: "Nghệ thuật thu phục lòng người",
                    category: "Kỹ năng"
                },
                {
                    name: "Nhà Giả Kim",
                    price: 75000,
                    desc: "Hành trình tìm kiếm ước mơ",
                    category: "Văn học"
                },
                {
                    name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                    price: 69000,
                    desc: "Sống hết mình khi còn trẻ",
                    category: "Kỹ năng"
                }
            ];
            
            renderProducts(sampleProducts);
            allProducts = sampleProducts;
            saveProductsToLocalStorage();
        }
    } catch (error) {
        console.error('Lỗi khi tải từ localStorage:', error);
        showNotification('Lỗi khi tải dữ liệu!', 'error');
    }
}

function clearLocalStorage() {
    if (confirm('Bạn có chắc muốn xóa TẤT CẢ dữ liệu sản phẩm?')) {
        try {
            localStorage.removeItem('products');
            
            const sampleProducts = [
                {
                    name: "Đắc Nhân Tâm",
                    price: 85000,
                    desc: "Nghệ thuật thu phục lòng người",
                    category: "Kỹ năng"
                },
                {
                    name: "Nhà Giả Kim",
                    price: 75000,
                    desc: "Hành trình tìm kiếm ước mơ",
                    category: "Văn học"
                }
            ];
            
            renderProducts(sampleProducts);
            allProducts = sampleProducts;
            saveProductsToLocalStorage();
            
            showNotification('Đã xóa và khôi phục dữ liệu mẫu!', 'success');
        } catch (error) {
            console.error('Lỗi khi xóa localStorage:', error);
            showNotification('Lỗi khi xóa dữ liệu!', 'error');
        }
    }
}

// ========== XỬ LÝ FORM VỚI ASYNC/AWAIT ==========
async function handleAddProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('newName').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const category = document.getElementById('newCategory').value;
    const desc = document.getElementById('newDesc').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    
    if (!validateProductData(name, price, desc, errorMsg)) {
        return;
    }
    
    // Hiệu ứng loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang thêm...';
    submitBtn.disabled = true;
    
    try {
        // Giả lập delay với async/await
        await simulateAPIRequest();
        
        const newProduct = {
            name,
            price: Number(price),
            category,
            desc
        };
        
        allProducts.unshift(newProduct);
        saveProductsToLocalStorage();
        applyFilters();
        
        resetAddProductForm();
        toggleProductForm();
        
        showNotification('Thêm sản phẩm thành công!', 'success');
        
    } catch (error) {
        showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    try {
        await simulateAPIRequest(1500);
        showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.', 'success');
        event.target.reset();
    } catch (error) {
        showNotification('Gửi thất bại, vui lòng thử lại!', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Giả lập API request
function simulateAPIRequest(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Giả lập 90% thành công
            Math.random() > 0.1 ? resolve() : reject();
        }, delay);
    });
}

// ========== CÁC HÀM PHỤ TRỢ ==========
function validateProductData(name, price, desc, errorMsg) {
    if (!name) {
        showError(errorMsg, 'Vui lòng nhập tên sản phẩm!');
        return false;
    }
    
    if (!price || isNaN(price) || Number(price) <= 0) {
        showError(errorMsg, 'Giá phải là số dương hợp lệ!');
        return false;
    }
    
    if (!desc || desc.length < 10) {
        showError(errorMsg, 'Mô tả phải có ít nhất 10 ký tự!');
        return false;
    }
    
    hideError(errorMsg);
    return true;
}

function showError(errorMsg, message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

function hideError(errorMsg) {
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
}

function resetAddProductForm() {
    document.getElementById('addProductForm').reset();
    hideError(document.getElementById('errorMsg'));
}