// Menu Data
const menuData = [
    // Burgers
    { id: 1, name: 'Zinger Burger', price: 449, category: 'burgers', emoji: '🌶️', description: 'Spicy and crispy fried chicken burger' },
    { id: 2, name: 'Classic Cheeseburger', price: 399, category: 'burgers', emoji: '🧀', description: 'Juicy beef patty with melted cheese' },
    { id: 3, name: 'Double Beef Burger', price: 549, category: 'burgers', emoji: '🍖', description: 'Two beef patties, double the taste' },
    { id: 4, name: 'Spicy Chicken Burger', price: 429, category: 'burgers', emoji: '🔥', description: 'Grilled chicken with spicy mayo' },
    
    // Shawarma
    { id: 5, name: 'Chicken Shawarma', price: 299, category: 'shawarma', emoji: '🌮', description: 'Tender chicken shawarma with garlic sauce' },
    { id: 6, name: 'Beef Shawarma', price: 349, category: 'shawarma', emoji: '🌭', description: 'Succulent beef shawarma' },
    { id: 7, name: 'Mixed Shawarma', price: 399, category: 'shawarma', emoji: '🎭', description: 'Mix of chicken and beef' },
    { id: 8, name: 'Garlic Shawarma', price: 329, category: 'shawarma', emoji: '🧄', description: 'Special garlic flavored shawarma' },
    
    // Pizza
    { id: 9, name: 'Margherita', price: 499, category: 'pizza', emoji: '🍅', description: 'Classic tomato, cheese, and basil' },
    { id: 10, name: 'Pepperoni', price: 599, category: 'pizza', emoji: '🍕', description: 'Loaded with pepperoni slices' },
    { id: 11, name: 'Chicken Supreme', price: 649, category: 'pizza', emoji: '🍗', description: 'Grilled chicken with special toppings' },
    { id: 12, name: 'Vegetarian', price: 449, category: 'pizza', emoji: '🥕', description: 'Fresh veggies on crispy crust' },
    
    // Fried Chicken
    { id: 13, name: '2 Piece Fried Chicken', price: 249, category: 'chicken', emoji: '🍗', description: 'Crispy 2-piece combo' },
    { id: 14, name: '4 Piece Fried Chicken', price: 449, category: 'chicken', emoji: '🍗', description: 'Perfect 4-piece meal' },
    { id: 15, name: '6 Piece Fried Chicken', price: 649, category: 'chicken', emoji: '🍗', description: 'Family-size 6-piece' },
    { id: 16, name: 'Combo Pack (8 Piece)', price: 899, category: 'chicken', emoji: '🎉', description: 'Ultimate feast with 8 pieces' },
    
    // Deals
    { id: 17, name: 'Burger + Fries Combo', price: 599, category: 'deals', emoji: '🍟', description: 'Any burger with crispy fries' },
    { id: 18, name: 'Family Pack', price: 1299, category: 'deals', emoji: '👨‍👩‍👧‍👦', description: 'Complete meal for 4 people' },
    { id: 19, name: 'Student Special', price: 349, category: 'deals', emoji: '📚', description: 'Burger or shawarma with drink' },
    { id: 20, name: 'Late Night Bundle', price: 899, category: 'deals', emoji: '🌙', description: '2 burgers + 4 pieces chicken + fries' },
];

// State Management
let cart = [];
let currentCategory = 'all';
const DELIVERY_FEE = 50;
const RESTAURANT_PHONE = '923001234567'; // Without +92

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSummary = document.getElementById('cartSummary');
const subtotal = document.getElementById('subtotal');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutForm = document.getElementById('checkoutForm');
const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
const orderNowBtn = document.getElementById('orderNowBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const modalTotal = document.getElementById('modalTotal');

// Initialize
function init() {
    renderMenu();
    attachCategoryListeners();
    attachEventListeners();
    loadCartFromLocalStorage();
}

// Render Menu Items
function renderMenu() {
    const filteredItems = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-red-600">
            <div class="bg-gradient-to-r from-red-700 to-yellow-600 p-4 text-center">
                <p class="text-4xl mb-2">${item.emoji}</p>
                <h3 class="text-lg font-bold text-white">${item.name}</h3>
            </div>
            <div class="p-4">
                <p class="text-gray-400 text-sm mb-4">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="price-badge text-yellow-300 text-lg">₨${item.price}</span>
                    <button 
                        class="add-to-cart-btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded font-bold transition"
                        onclick="addToCart(${item.id})"
                    >
                        + Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Attach Category Filter Listeners
function attachCategoryListeners() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => {
                b.classList.remove('active', 'bg-yellow-400', 'text-gray-900');
                b.classList.add('bg-gray-700', 'text-white');
            });
            this.classList.add('active', 'bg-yellow-400', 'text-gray-900');
            this.classList.remove('bg-gray-700', 'text-white');
            
            currentCategory = this.dataset.category;
            renderMenu();
        });
    });
}

// Add to Cart
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    saveCartToLocalStorage();
    showCartNotification();
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    saveCartToLocalStorage();
}

// Update Quantity
function updateQuantity(itemId, quantity) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            updateCart();
            saveCartToLocalStorage();
        }
    }
}

// Update Cart Display
function updateCart() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartSummary.innerHTML = '<p class="text-gray-400 text-center py-8">Your cart is empty</p>';
        checkoutBtn.disabled = true;
        subtotal.textContent = '₨0';
        totalPrice.textContent = '₨50';
    } else {
        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotal.textContent = `₨${subtotalAmount}`;
        totalPrice.textContent = `₨${subtotalAmount + DELIVERY_FEE}`;
        modalTotal.textContent = `₨${subtotalAmount + DELIVERY_FEE}`;
        
        checkoutBtn.disabled = false;
        
        cartSummary.innerHTML = cart.map(item => `
            <div class="cart-item bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                <div class="flex-1">
                    <p class="font-semibold text-yellow-300">${item.emoji} ${item.name}</p>
                    <p class="text-sm text-gray-400">₨${item.price} × ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button 
                        onclick="updateQuantity(${item.id}, ${item.quantity - 1})"
                        class="bg-red-700 hover:bg-red-800 text-white w-6 h-6 rounded text-sm font-bold transition"
                    >
                        -
                    </button>
                    <span class="w-6 text-center">${item.quantity}</span>
                    <button 
                        onclick="updateQuantity(${item.id}, ${item.quantity + 1})"
                        class="bg-green-700 hover:bg-green-800 text-white w-6 h-6 rounded text-sm font-bold transition"
                    >
                        +
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Local Storage Management
function saveCartToLocalStorage() {
    localStorage.setItem('craveStationCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('craveStationCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Show Cart Notification
function showCartNotification() {
    const item = cart[cart.length - 1];
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg pop-in z-40';
    notification.textContent = `✓ ${item.name} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}

// Checkout
function openCheckout() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    checkoutModal.classList.remove('hidden');
}

function closeCheckout() {
    checkoutModal.classList.add('hidden');
}

// Submit Order via WhatsApp
function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const instructions = document.getElementById('specialInstructions').value.trim();
    
    if (!name || !phone || !address) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Build order message
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = subtotalAmount + DELIVERY_FEE;
    
    let orderDetails = `🍔 *NEW ORDER FROM CRAVE STATION*\n\n`;
    orderDetails += `*Customer Details:*\n`;
    orderDetails += `Name: ${name}\n`;
    orderDetails += `Phone: ${phone}\n`;
    orderDetails += `Address: ${address}\n\n`;
    
    orderDetails += `*Order Items:*\n`;
    cart.forEach(item => {
        orderDetails += `${item.emoji} ${item.name} (₨${item.price}) × ${item.quantity} = ₨${item.price * item.quantity}\n`;
    });
    
    orderDetails += `\n*Price Breakdown:*\n`;
    orderDetails += `Subtotal: ₨${subtotalAmount}\n`;
    orderDetails += `Delivery Fee: ₨${DELIVERY_FEE}\n`;
    orderDetails += `*Total: ₨${totalAmount}*\n\n`;
    
    if (instructions) {
        orderDetails += `*Special Instructions:*\n${instructions}\n\n`;
    }
    
    orderDetails += `⏰ Order Time: ${new Date().toLocaleString('en-PK')}`;
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(orderDetails)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear form and close modal
    checkoutForm.reset();
    closeCheckout();
    
    // Clear cart
    cart = [];
    updateCart();
    saveCartToLocalStorage();
    
    // Show success message
    showSuccessNotification();
}

// Success Notification
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg pop-in z-50';
    notification.innerHTML = `
        <p class="font-bold text-lg">🎉 Order Submitted!</p>
        <p class="text-sm mt-1">Your order has been sent via WhatsApp. Our team will confirm shortly!</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

// Event Listeners
function attachEventListeners() {
    cartBtn.addEventListener('click', () => {
        const summary = document.querySelector('aside');
        if (summary) {
            summary.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    checkoutBtn.addEventListener('click', openCheckout);
    cancelCheckoutBtn.addEventListener('click', closeCheckout);
    clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        if (confirm('Clear your entire cart?')) {
            cart = [];
            updateCart();
            saveCartToLocalStorage();
        }
    });
    checkoutForm.addEventListener('submit', submitOrder);
    orderNowBtn.addEventListener('click', openCheckout);
    
    // Close modal when clicking outside
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    });
}

// Initialize app
init();
