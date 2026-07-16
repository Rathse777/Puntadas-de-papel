// CONFIGURACIÓN DE PRODUCTOS CON MÚLTIPLES FOTOS Y DETALLES
const PRODUCTS = [
    {
        id: 1,
        name: "Planificador Semanal Flores",
        price: 8.00,
        category: "Papelería",
        description: "Organiza tus semanas de la forma más linda. Contiene 50 hojas de papel bond de alta calidad impresas a todo color, con espacios de notas, prioridades y tracker de hábitos.",
        images: [
            "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=500",
            "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
            "file:///C:/Users/Raths/.vscode/Puntadas%20de%20Papel/Fotos%20de%20los%20productos/escritorio-cuaderno-pluma-pluma_946757-4171.jpg"
        ]
    },
    {
        id: 2,
        name: "Cartera Lavanda",
        price: 22.50,
        category: "Bolsos y Accesorios",
        description: "Hecha 100% a mano con cuerina y forro de seda. Ideal para salidas casuales. Súper espaciosa, forrada por dentro y con broche imantado para máxima seguridad.",
        images: [
            "https://images.unsplash.com/photo-1590736704728-f4730bb3c3af?w=500",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500"
        ]
    },
    {
        id: 3,
        name: "Top Tejido Rosa Pastel",
        price: 30.00,
        category: "Atuendos",
        description: "Prenda de punto suave y elástica de excelente calce. Ajustable en la espalda, perfecta para climas frescos o looks veraniegos coquetos.",
        images: [
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
            "https://images.unsplash.com/photo-1517231922316-a9d8d510c44b?w=500",
            "https://images.unsplash.com/photo-1574169208507-84376144848b?w=500"
        ]
    },
    {
        id: 4,
        name: "Conejo Amigurumi",
        price: 15.00,
        category: "Peluches",
        description: "Un tierno compañero tejido con la técnica amigurumi. Relleno suave y esponjoso con ojos de seguridad. El regalo perfecto para cualquier edad.",
        images: [
            "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?w=500",
            "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=500",
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500"
        ]
    }
];

const WHATSAPP_PHONE = '+584147429116'; // Tu número de WhatsApp aquí

let cart = [];

// ELEMENTOS DOM
const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.getElementById('cart-count');
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');

// ELEMENTOS DEL MODAL DE DETALLES
const productDetailModal = document.getElementById('product-detail-modal');
const closeDetailBtn = document.getElementById('close-detail-btn');
const popoutMainImg = document.getElementById('popout-main-img');
const popoutThumbnails = document.getElementById('popout-thumbnails');
const popoutCategory = document.getElementById('popout-category');
const popoutName = document.getElementById('popout-name');
const popoutPrice = document.getElementById('popout-price');
const popoutDescription = document.getElementById('popout-description');
const popoutAddBtn = document.getElementById('popout-add-btn');

// ELEMENTOS DEL MODAL DE SEGURIDAD
const securityModal = document.getElementById('security-modal');
const securityConfirmBtn = document.getElementById('security-confirm-btn');
const securityCancelBtn = document.getElementById('security-cancel-btn');

// MODAL DE ÉXITO PAGO
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// RENDERIZAR PRODUCTOS EN LA TIENDA
function renderCatalog() {
    productsGrid.innerHTML = '';
    PRODUCTS.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="product-card-clickable" onclick="openProductDetails(${p.id})">
                <img src="${p.images[0]}" class="product-img">
                <span class="product-card-category">${p.category}</span>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-price">$${p.price.toFixed(2)}</p>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${p.id})">Añadir al carrito 🌸</button>
        `;
        productsGrid.appendChild(div);
    });
}

// ABRIR DETALLES DEL PRODUCTO (MODAL FLOTANTE)
function openProductDetails(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    // Poblar textos básicos
    popoutCategory.textContent = p.category;
    popoutName.textContent = p.name;
    popoutPrice.textContent = `$${p.price.toFixed(2)}`;
    popoutDescription.textContent = p.description;
    
    // Configurar imagen principal inicial
    popoutMainImg.src = p.images[0];

    // Limpiar y poblar miniaturas de fotos
    popoutThumbnails.innerHTML = '';
    p.images.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.className = `thumb-img ${index === 0 ? 'active' : ''}`;
        
        // Evento al dar clic a la miniatura
        img.onclick = () => {
            popoutMainImg.src = imgUrl;
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        };
        popoutThumbnails.appendChild(img);
    });

    // Vincular acción del botón del modal al carrito
    popoutAddBtn.onclick = () => {
        addToCart(p.id);
        closeProductDetails();
    };

    // Mostrar modal flotante
    productDetailModal.classList.remove('hidden');
}

function closeProductDetails() {
    productDetailModal.classList.add('hidden');
}

// CERRAR MODAL DETALLES AL TOCAR FUERA O LA X
closeDetailBtn.onclick = closeProductDetails;
productDetailModal.onclick = (e) => {
    if (e.target === productDetailModal) closeProductDetails();
};

// CARRITO DE COMPRAS LÓGICA
function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({...p, quantity: 1});
    updateUI();
}

// NUEVO: FUNCIÓN PARA ELIMINAR ELEMENTOS COMPLETAMENTE DEL CARRITO
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateUI();
}

function updateUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Aún no hay tesoros en tu carrito.</p>';
        checkoutSection.classList.add('hidden');
    } else {
        checkoutSection.classList.remove('hidden');
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item-row';
            div.innerHTML = `
                <div><b>${item.name}</b> x${item.quantity}</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn-delete-item" onclick="removeFromCart(${item.id})" title="Eliminar del pedido">🗑️</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
    }
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
}

// INTERCEPCIÓN DEL FORMULARIO: SE ABRE LA VENTANA DE SEGURIDAD PRIMERO
checkoutForm.onsubmit = (e) => {
    e.preventDefault();
    securityModal.classList.remove('hidden'); // Abre ventana de confirmación / seguridad
};

// ACCIÓN DEL BOTÓN CANCELAR EN EL MODAL DE SEGURIDAD
securityCancelBtn.onclick = () => {
    securityModal.classList.add('hidden'); // Cierra de forma segura para dejar al cliente revisar
};

// ACCIÓN DEL BOTÓN ACEPTAR EN EL MODAL DE SEGURIDAD
securityConfirmBtn.onclick = () => {
    securityModal.classList.add('hidden');
    successModal.classList.remove('hidden'); // Transiciona al modal de datos del receptor
};

// FINALIZAR HACIA WHATSAPP DESDE EL MODAL DE ÉXITO
closeModalBtn.onclick = () => {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const state = document.getElementById('shipping-state').value;
    const agency = document.getElementById('shipping-agency').value;
    const bank = document.getElementById('payment-bank').value;
    const ref = document.getElementById('payment-reference').value;

    let msg = `🌸 *NUEVO PEDIDO*\n\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `📞 *Tel:* ${phone}\n\n`;
    msg += `📦 *Agencia:* ${state} - ${agency}\n\n`;
    msg += `💳 *Pago:* ${bank} (Ref: ${ref})\n`;
    msg += `🖼️ *NOTA:* Adjunto captura de pago en el siguiente mensaje.\n\n`;
    msg += `🛒 *PRODUCTOS:*\n`;
    
    cart.forEach(item => {
        msg += `- ${item.name} (x${item.quantity})\n`;
    });
    
    msg += `\n💰 *TOTAL:* ${cartTotalAmount.textContent}`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    
    // Resetear Estado de la Tienda por completo
    cart = [];
    checkoutForm.reset();
    updateUI();
    successModal.classList.add('hidden');
};

document.addEventListener('DOMContentLoaded', renderCatalog);