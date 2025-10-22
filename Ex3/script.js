let productItems = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get product list
    productItems = document.querySelectorAll('.product-item');
    
    // Add search event
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Add product events
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    addProductBtn.addEventListener('click', toggleProductForm);
    cancelBtn.addEventListener('click', toggleProductForm);
    
    // Add contact form event
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);
}

// Handle product search
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

// Handle show/hide product form
function toggleProductForm() {
    const form = document.getElementById('addProductForm');
    
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.classList.add('hidden');
    }
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    alert('Thank you for contacting us! We will respond as soon as possible.');
    
    // Reset form
    event.target.reset();
}