/* script.js - cart + checkout logic for Roi Delights demo
   - edit BUSINESS_PHONE to the WhatsApp phone (in international format, no + or spaces) before using
   - this demo uses wa.me link to open a prefilled message on WhatsApp/web WhatsApp
*/

const BUSINESS_PHONE = "49XXXXXXXXX"; // <<< REPLACE with business number (e.g. 491760000000) without + sign
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const checkoutForm = document.getElementById('checkoutForm');
const clearCartBtn = document.getElementById('clearCartBtn');

// state
let cart = [];

// helpers
function formatPrice(n){ return '€' + Number(n).toFixed(2); }
function findInCart(id){ return cart.find(i => i.id === id); }
function updateCartCount(){ let qty = cart.reduce((s,i)=>s+i.qty,0); cartCount.textContent = qty; }
function calculateSubtotal(){ return cart.reduce((s,i)=> s + i.qty * i.price, 0); }

// UI: add event listeners for product buttons
document.querySelectorAll('.product').forEach(productEl => {
  const addBtn = productEl.querySelector('.add-cart');
  addBtn.addEventListener('click', () => {
    const id = productEl.dataset.id;
    const name = productEl.dataset.name;
    const price = parseFloat(productEl.dataset.price);
    const qtyInput = productEl.querySelector('.qty-input');
    let qty = parseInt(qtyInput.value) || 1;
    if (qty < 1) qty = 1;

    const existing = findInCart(id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, name, price, qty });
    }
    renderCart();
    openCart();
  });
});

// render cart items
function renderCart(){
  cartItemsEl.innerHTML = '';
  if (cart.length === 0){
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No items yet — add something delicious!';
    cartItemsEl.appendChild(p);
    subtotalEl.textContent = formatPrice(0);
    cartCount.textContent = 0;
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="meta">
        <div style="font-weight:700">${item.name}</div>
        <div class="muted" style="color:#777; font-size:.9rem">${item.qty} × ${formatPrice(item.price)}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700">${formatPrice(item.qty * item.price)}</div>
        <div style="margin-top:.35rem;">
          <button class="btn small dec">−</button>
          <button class="btn small inc">+</button>
          <button class="btn small rem">✕</button>
        </div>
      </div>
    `;
    // attach handlers
    row.querySelector('.inc').addEventListener('click', () => { item.qty++; renderCart(); });
    row.querySelector('.dec').addEventListener('click', () => { item.qty = Math.max(1, item.qty-1); renderCart(); });
    row.querySelector('.rem').addEventListener('click', () => { cart = cart.filter(c=>c.id !== item.id); renderCart(); });
    cartItemsEl.appendChild(row);
  });

  subtotalEl.textContent = formatPrice(calculateSubtotal());
  updateCartCount();
}

// cart open/close
function openCart(){ cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden','false'); }
function closeCartPanel(){ cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden','true'); }

cartToggle.addEventListener('click', () => {
  if (cartPanel.classList.contains('open')) closeCartPanel(); else openCart();
});
closeCart.addEventListener('click', () => closeCartPanel());
clearCartBtn.addEventListener('click', () => { cart = []; renderCart(); closeCartPanel(); });

// checkout: build message and open WhatsApp
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    alert('Your cart is empty — please add items first.');
    return;
  }
  const name = document.getElementById('custName').value.trim();
  const city = document.getElementById('custCity').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  if (!name || !city || !address || !phone) {
    alert('Please fill all required fields.');
    return;
  }

  // Compose order text
  let text = `Order from Roi Delights (%0A)`;
  text += `Name: ${encodeURIComponent(name)}%0A`;
  text += `Phone: ${encodeURIComponent(phone)}%0A`;
  text += `City: ${encodeURIComponent(city)}%0A`;
  text += `Address: ${encodeURIComponent(address)}%0A%0A`;
  text += `Items:%0A`;
  cart.forEach(it => {
    text += `- ${encodeURIComponent(it.name)} x ${it.qty} = ${encodeURIComponent(formatPrice(it.qty * it.price))}%0A`;
  });
  text += `%0ASubtotal: ${encodeURIComponent(formatPrice(calculateSubtotal()))}%0A`;
  text += `%0A(Please confirm pickup/delivery time)`;

  // Use WhatsApp web link. If BUSINESS_PHONE is empty, open generic share.
  if (BUSINESS_PHONE && BUSINESS_PHONE !== "49XXXXXXXXX") {
    const wa = `https://wa.me/${BUSINESS_PHONE}?text=${text}`;
    window.open(wa, '_blank');
  } else {
    // if phone not set, open generic web share (or show the text)
    if (navigator.share) {
      navigator.share({
        title: 'Roi Delights order',
        text: decodeURIComponent(text.replace(/%0A/g,"\n"))
      }).catch(()=>alert('Sharing canceled or not supported.'));
    } else {
      // fallback: copy to clipboard & show
      const humanText = decodeURIComponent(text.replace(/%0A/g,"\n"));
      navigator.clipboard?.writeText(humanText).then(()=> {
        alert('Order copied to clipboard. Paste it into WhatsApp/phone to send:\n\n' + humanText);
      }, ()=> {
        alert('Please copy and send this order manually:\n\n' + humanText);
      });
    }
  }
});

// misc
document.getElementById('year').textContent = new Date().getFullYear();
renderCart();
