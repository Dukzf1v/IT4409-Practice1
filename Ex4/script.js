let productItems = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    productItems = document.querySelectorAll('.product-item');
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    addProductBtn.addEventListener('click', toggleProductForm);
    cancelBtn.addEventListener('click', function() {
        toggleProductForm();
        resetAddProductForm();
    });
    
    addProductForm.addEventListener('submit', handleAddProduct);
    
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
}

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

function toggleProductForm() {
    const form = document.getElementById('addProductForm');
    
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.classList.add('hidden');
    }
}

function resetAddProductForm() {
    document.getElementById('addProductForm').reset();
    document.getElementById('errorMsg').textContent = '';
}

function handleAddProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('newName').value.trim();
    const price = document.getElementById('newPrice').value.trim();
    const image = document.getElementById('newImage').value.trim();
    const desc = document.getElementById('newDesc').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    
    if (!validateProductData(name, price, image, desc, errorMsg)) {
        return;
    }
    
    createNewProduct(name, price, image, desc);
    
    resetAddProductForm();
    toggleProductForm();
    
    alert('Product added successfully!');
}

function validateProductData(name, price, image, desc, errorMsg) {
    if (!name) {
        errorMsg.textContent = 'Please enter product name!';
        return false;
    }
    
    if (!price) {
        errorMsg.textContent = 'Please enter product price!';
        return false;
    }
    
    if (isNaN(price) || Number(price) <= 0) {
        errorMsg.textContent = 'Price must be a valid positive number!';
        return false;
    }
    
    if (!image) {
        errorMsg.textContent = 'Please enter product image URL!';
        return false;
    }
    
    try {
        new URL(image);
    } catch {
        errorMsg.textContent = 'Please enter a valid image URL!';
        return false;
    }
    
    if (!desc) {
        errorMsg.textContent = 'Please enter product description!';
        return false;
    }
    
    if (desc.length < 10) {
        errorMsg.textContent = 'Description must be at least 10 characters!';
        return false;
    }
    
    errorMsg.textContent = '';
    return true;
}

function createNewProduct(name, price, image, desc) {
    const productList = document.getElementById('product-list');
    
    const newItem = document.createElement('article');
    newItem.className = 'product-item';
    
    newItem.innerHTML = `
        <h3 class="product-name">${name}</h3>
        <img src="${image}" alt="${name} Book Cover" width="150">
        <p class="product-desc">${desc}</p>
        <p class="product-price">Price: $${Number(price).toLocaleString()}</p>
    `;
    
    productList.prepend(newItem);
    
    productItems = document.querySelectorAll('.product-item');
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert('Thank you for contacting us! We will respond as soon as possible.');
    
    event.target.reset();
}