import { products as sampleProducts, categories } from './products.js';

import { CONFIG, money } from './config.js';

import { fetchProducts, submitOrder, subscribeNewsletter, submitContact } from './api.js';

import { initNavigation } from './navigation.js';


const CART = 'ember-cart';
const WISH = 'ember-wishlist';
let products = sampleProducts;

const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const price = (product) => product.salePrice || product.price;

const esc = (value) => {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
};
const root = document.querySelector('#pageContent');
const page = document.body.dataset.page;

function toast(s) {
  let t=document.querySelector('.toast');
  t.textContent=s;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),
  2300)
}

function sync() {
  document.querySelectorAll('[data-cart-count]').forEach(x=>x.textContent=read(CART).reduce((n,
  i)=>n+i.qty,
  0))
}

function add(id,
n=1) {
  let c=read(CART),
  r=c.find(x=>x.id===id);
  r?r.qty+=n:c.push({
    id,
    qty:n
  });
  save(CART,
  c);
  sync();
  toast('Added to your bag')
}

function wish(id) {
  let w=read(WISH);
  w=w.includes(id)?w.filter(x=>x!==id):w.concat(id);
  save(WISH,
  w);
  toast(w.includes(id)?'Saved to your wishlist':'Removed from your wishlist');
  render()
}

function card(p) {
  let off=p.salePrice?Math.round((1-p.salePrice/p.price)*100):0;
  return '<article class="product-card"><a class="product-image" href="product.html?slug='+encodeURIComponent(p.slug)
  + '"><img loading="lazy" src="'+p.image
  + '" alt="'+esc(p.alt)
  + '">'+(off?'<span class="sale-badge">'+off
  + '% off</span>':'')+(!p.inStock?'<span class="stock-badge">Sold out</span>':'')
  + '</a><div class="card-actions"><button class="round-action '+(read(WISH).includes(p.id)?'active':'')
  + '" aria-label="Save '+esc(p.name)
  + '" data-wish="'+p.id
  + '">♡</button></div><div class="product-meta"><p class="product-category">'+esc(p.category.replaceAll('-',
  ' '))
  + '</p><a href="product.html?slug='+encodeURIComponent(p.slug)
  + '"><h3>'+esc(p.name)
  + '</h3></a><p class="product-description">'+esc(p.shortDescription)
  + '</p><div class="price">'+money(price(p))+(p.salePrice?'<span class="old-price">'+money(p.price)
  + '</span>':'')
  + '</div><button class="quick-add" data-add="'+p.id
  + '" '+(!p.inStock?'disabled':'')
  + '>＋ '+(p.inStock?'Add':'Sold out')
  + '</button><a class="enquire-btn" target="_blank" rel="noopener" href="https://wa.me/'+CONFIG.whatsappNumber
  + '?text='+encodeURIComponent('Hello, I am interested in '+p.name)
  + '">◉ Enquire Now</a></div></article>'
}

function grid(items) {
  return items.length?'<div class="product-grid">'+items.map(card).join('')
  + '</div>':'<div class="empty-state"><h3>No holders found</h3><p>Try a different style or clear your filters.</p></div>'
}

function home() {
  
  let best=products.filter(p=>p.bestseller).slice(0,
  4);
  
  root.innerHTML='<section class="hero">'
    + '<div class="hero-copy">'
    + '<span class="eyebrow">Hand-finished resin home accents</span>'
    + '<h1>Shape a little<br>moment of calm.</h1>'
    + '<p>Sculptural resin candle holders in considered colors and forms, made to bring a personal touch to your home.</p>'
    + '<a class="button" href="shop.html">Explore the holders →</a>'
    + '</div>'
    + '<div class="hero-image">'
    + '<img src="assets/images/resin-holder-studio.png" alt="Sage and ivory marbled resin candle holder styled on a pale stone table">'
    + '</div>'
    + '</section>'
    + '<section class="section">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Find your feeling</span>'
    + '<h2>Made for your moments</h2>'
    + '<p>Explore sculptural shapes, soft colors, and pieces chosen to make a space feel like yours.</p>'
    + '</div>'
    + '<div class="collection-grid">'
    + '<a class="collection" href="shop.html?category=tealight-holders">'
    + '<img src="'+products[1].image
  + '" alt="Resin candle holder styled in a home">'
    + '<span>Everyday rituals →</span>'
    + '</a>'
    + '<a class="collection" href="shop.html?category=luxury-holders">'
    + '<img src="'+products[2].image
  + '" alt="Decorative resin candle holder">'
    + '<span>Quiet indulgence →</span>'
    + '</a>'
    + '<a class="collection" href="shop.html?category=gift-sets">'
    + '<img src="'+products[5].image
  + '" alt="Gift set styling for decorative candle holders">'
    + '<span>Gifts with feeling →</span>'
    + '</a>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '<section class="section" style="background:var(--cream)">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">The ones you love</span>'
    + '<h2>Our best-loved holders</h2>'
    + '<p>Sculptural forms and thoughtful finishes for the spaces you love.</p>'
    + '</div>'+grid(best)
  + '</div>'
    + '</section>'
    + '<section class="section">'
    + '<div class="container">'
    + '<div class="split">'
    + '<img src="'+products[6].image
  + '" alt="Decorative holder styled in calm natural light">'
    + '<div>'
    + '<span class="eyebrow">A little more intention</span>'
    + '<h2>Made slowly.<br>Made to stay.</h2>'
    + '<p class="body-copy">Each holder brings together resin, color, and form to create a small accent with a little more personality. We focus on pieces that feel at home in everyday spaces.</p>'
    + '<a href="about.html" class="button outline">Our way of making</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '<section class="section" style="background:#f7faf7">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">The little details</span>'
    + '<h2>Find a holder for your space.</h2>'
    + '<p>Explore a favorite shape, find a thoughtful gift, or learn how to care for resin décor.</p>'
    + '</div>'
    + '<div class="product-grid three-up">'
    + '<div class="review">'
    + '<h3>Find your finish</h3>'
    + '<p>Browse colors and surface details to find a piece that suits your space.</p>'
    + '</div>'
    + '<div class="review">'
    + '<h3>Give a little glow</h3>'
    + '<p>Explore holder sets for celebrations, thank-yous, and everyday surprises.</p>'
    + '</div>'
    + '<div class="review">'
    + '<h3>Style with care</h3>'
    + '<p>Simple care guidance helps keep your resin décor looking its best.</p>'
    + '<a href="candle-care.html">Read holder care →</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '<section class="section" style="background:var(--cream)">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Just arrived</span>'
    + '<h2>New to the shelf</h2>'
    + '</div>'+grid(products.slice(8,
  12))
  + '</div>'
    + '</section>'
    + '<section class="section">'
    + '<div class="container">'
    + '<div class="promo">'
    + '<img src="'+products[5].image
  + '" alt="Decorative holder set styled as a thoughtful gift">'
    + '<div class="promo-copy">'
    + '<span class="eyebrow">A gift with a little character</span>'
    + '<h2>A thoughtful detail for their home.</h2>'
    + '<p class="body-copy">Discover resin holder sets for housewarmings, thank-yous, and just because.</p>'
    + '<a href="shop.html?category=gift-sets" class="button">Shop holder sets</a>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '<section class="section" style="background:var(--cream)">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Kind words</span>'
    + '<h2>Notes from home</h2>'
    + '<p>Sample testimonials for design demonstration only.</p>'
    + '</div>'
    + '<div class="product-grid three-up">'
    + '<blockquote class="review">“The shape and finish make my bookshelf feel considered.”<small>— Maya R. · Sample review</small>'
    + '</blockquote>'
    + '<blockquote class="review">“A lovely little accent, and the color is so easy to style.”<small>— Elise T. · Sample review</small>'
    + '</blockquote>'
    + '<blockquote class="review">“The holder set made such a thoughtful housewarming gift.”<small>— Jordan K. · Sample review</small>'
    + '</blockquote>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '<section class="section">'
    + '<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">A little inspiration</span>'
    + '<h2>At home with us</h2>'
    + '<p>Follow along @kayacandles</p>'
    + '</div>'
    + '<div class="social-grid">'+products.slice(0,
  5).map(p=>'<img loading="lazy" src="'+p.image
  + '" alt="Resin holder styling inspiration">').join('')
  + '</div>'
    + '</div>'
    + '</section>'
}

function shop() {
  
  let params=new URLSearchParams(location.search),
  cat=params.get('category')||'all',
  q=params.get('q')||'',
  sort=params.get('sort')==='new'?'new':(params.get('sort')||'popular'),
  min=0,
  max=5000,
  stockOnly=false;
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">The resin holder collection</span>'
    + '<h1>Shop candle holders</h1>'
    + '<p>Find a resin holder that feels right for your home, your table, or your next thoughtful gift.</p>'
    + '</div>'
    + '<div class="toolbar">'
    + '<input class="search" id="search" value="'+esc(q)
  + '" placeholder="Search candle holders" aria-label="Search candle holders">'
    + '<select id="sort" aria-label="Sort products">'
    + '<option value="popular">Sort: Popular</option>'
    + '<option value="new">Sort: New arrivals</option>'
    + '<option value="price-asc">Price: low to high</option>'
    + '<option value="price-desc">Price: high to low</option>'
    + '<option value="name">Name: A to Z</option>'
    + '</select>'
    + '</div>'
    + '<div class="shop-layout">'
    + '<aside class="shop-sidebar" aria-label="Product filters">'
    + '<div class="filter-block">'
    + '<h3>Categories</h3>'+categories.map(c=>'<label class="filter-category">'
    + '<input type="radio" name="category" value="'+c[0]
  + '" '+(cat===c[0]?'checked':'')
  + '>'
    + '<span>'+c[1]
  + '</span>'
    + '</label>').join('')
  + '</div>'
    + '<div class="filter-block">'
    + '<h3>Price range</h3>'
    + '<div class="price-filter">'
    + '<label>Min<input type="number" id="minPrice" value="0" min="0" max="5000" aria-label="Minimum price">'
    + '</label>'
    + '<label>Max<input type="number" id="maxPrice" value="5000" min="0" max="5000" aria-label="Maximum price">'
    + '</label>'
    + '<button id="applyPrice">Go</button>'
    + '</div>'
    + '</div>'
    + '<div class="filter-block">'
    + '<h3>Availability</h3>'
    + '<label class="filter-category">'
    + '<input type="checkbox" id="stockOnly">'
    + '<span>In stock only</span>'
    + '</label>'
    + '</div>'
    + '<div class="filter-block">'
    + '<button class="filter-clear" id="clearFilters">Clear all filters</button>'
    + '</div>'
    + '</aside>'
    + '<div id="shopGrid">'
    + '</div>'
    + '</div>'
    + '</div>';
  
  document.querySelector('#sort').value=sort;
  
  function update() {
    
    let a=products.filter(p=>(cat==='all'||p.category===cat)&&(p.name
    + ' '+p.shortDescription
    + ' '+(p.finish || '')+' '+(p.details || []).join(' ')).toLowerCase().includes(q.toLowerCase())&&price(p)>=min&&price(p)<=max&&(!stockOnly||p.inStock));
    
    a.sort((x,
    y)=>sort==='price-asc'?price(x)-price(y):sort==='price-desc'?price(y)-price(x):sort==='name'?x.name.localeCompare(y.name):sort==='new'?products.indexOf(y)-products.indexOf(x):y.popularity-x.popularity);
    
    document.querySelector('#shopGrid').innerHTML=grid(a)
  }

document.querySelectorAll('input[name="category"]').forEach(i=>i.onchange=()=> {
    
    cat=i.value;
    
    update()
  });
  
  document.querySelector('#search').oninput=e=> {
    
    q=e.target.value;
    
    update()
  };
  
  document.querySelector('#sort').onchange=e=> {
    
    sort=e.target.value;
    
    update()
  };
  
  document.querySelector('#applyPrice').onclick=()=> {
    
    min=Math.max(0,
    Number(document.querySelector('#minPrice').value)||0);
    
    max=Math.max(min,
    Number(document.querySelector('#maxPrice').value)||5000);
    
    update()
  };
  
  document.querySelector('#stockOnly').onchange=e=> {
    
    stockOnly=e.target.checked;
    
    update()
  };
  
  document.querySelector('#clearFilters').onclick=()=> {
    
    cat='all';
    
    q='';
    
    min=0;
    
    max=5000;
    
    sort='popular';
    
    stockOnly=false;
    
    document.querySelector('#search').value='';
    
    document.querySelector('#sort').value='popular';
    
    document.querySelector('#minPrice').value=0;
    
    document.querySelector('#maxPrice').value=5000;
    
    document.querySelector('#stockOnly').checked=false;
    
    document.querySelector('input[name="category"][value="all"]').checked=true;
    
    update()
  };
  
  update()
}

function productPage() {
  
  let key=new URLSearchParams(location.search),
  p=products.find(x=>x.slug===key.get('slug')||x.id===key.get('id'))||products[0];
  
  root.innerHTML='<div class="container">'
    + '<div class="product-detail">'
    + '<div>'
    + '<img id="mainImage" class="gallery-main" src="'+p.image
  + '" alt="'+esc(p.alt)
  + '">'
    + '<div class="thumbs">'
    + '<button aria-label="Product view">'
    + '<img src="'+p.image
  + '" alt="'+esc(p.alt)
  + '">'
    + '</button>'
    + '<button aria-label="Alternate product view">'
    + '<img src="'+products[(products.indexOf(p)+1)%products.length].image
  + '" alt="Alternate candle holder styling view">'
    + '</button>'
    + '</div>'
    + '</div>'
    + '<div class="detail-copy">'
    + '<span class="eyebrow">'+p.category.replaceAll('-',
  ' ')
  + '</span>'
    + '<h1>'+esc(p.name)
  + '</h1>'
    + '<p class="price">'+(p.salePrice?'<span class="old-price">'+money(p.price)
  + '</span>'+money(p.salePrice):money(p.price))
  + '</p>'
    + '<p>'+esc(p.description)
  + '</p>'
    + '<div class="detail-specs">'
    + '<div>Material<span>'+esc(p.material || 'Resin')
  + '</span>'
    + '</div>'
    + '<div>Finish<span>'+esc(p.finish || 'See product photos')
  + '</span>'
    + '</div>'
    + (p.size && !p.size.startsWith('Add verified') ? '<div>Dimensions<span>'+esc(p.size)+'</span></div>' : '')
    + '<div>Design details<span>'+esc((p.details || []).join(' · '))
  + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="qty-line">'
    + '<div class="qty">'
    + '<button id="minus" aria-label="Decrease quantity">−</button>'
    + '<span id="qtyVal">1</span>'
    + '<button id="plus" aria-label="Increase quantity">+</button>'
    + '</div>'
    + '<button class="button" id="addDetail" '+(!p.inStock?'disabled':'')
  + '>'+(p.inStock?'Add to bag':'Currently out of stock')
  + '</button>'
    + '<button class="round-action" id="detailWish" aria-label="Save to wishlist">♡</button>'
    + '</div>'
    + '<p class="notice">Complimentary shipping over '+money(CONFIG.freeShippingThreshold)
  + '. Delivery estimates require a backend.</p>'
    + '<p class="notice">This listing is for the resin holder. Check the product details to confirm whether a candle is included.</p>'
    + '</div>'
    + '</div>'
    + '<div class="section">'
    + '<div class="tabs">'
    + '<b>Details</b>'
    + '<a href="candle-care.html">Holder care</a>'
    + '</div>'
    + '<p class="body-copy">Use only with a candle size and style verified to fit the holder. Keep resin away from direct flame and excessive heat. Never leave a burning candle unattended.</p>'
    + '<div class="section-head">'
    + '<h2>You may also love</h2>'
    + '</div>'+grid(products.filter(x=>x.id!==p.id).slice(0,
  4))
  + '</div>'
    + '</div>';
  
  let n=1;
  
  document.querySelector('#minus').onclick=()=> {
    
    n=Math.max(1,
    n-1);
    
    document.querySelector('#qtyVal').textContent=n
  };
  
  document.querySelector('#plus').onclick=()=> {
    
    n++;
    
    document.querySelector('#qtyVal').textContent=n
  };
  
  document.querySelector('#addDetail').onclick=()=>add(p.id,
  n);
  
  document.querySelector('#detailWish').onclick=()=>wish(p.id);
  
  document.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>document.querySelector('#mainImage').src=b.querySelector('img').src)
}

function cart() {
  
  let c=read(CART),
  sub=c.reduce((n,
  x)=> {
    
    let p=products.find(y=>y.id===x.id);
    
    return n+(p?price(p)*x.qty:0)
  },
  0),
  ship=sub===0||sub>=CONFIG.freeShippingThreshold?0:CONFIG.shippingFlatRate;
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Your selection</span>'
    + '<h1 style="font-size:64px">Shopping bag</h1>'
    + '</div>'+(c.length?'<div class="checkout-layout">'
    + '<div>'+c.map(x=> {
    
    let p=products.find(y=>y.id===x.id);
    
    return p?'<div class="cart-row">'
      + '<a href="product.html?slug='+p.slug
    + '">'
      + '<img src="'+p.image
    + '" alt="'+esc(p.alt)
    + '">'
      + '</a>'
      + '<div>'
      + '<span class="eyebrow">'+p.category.replaceAll('-',
    ' ')
    + '</span>'
      + '<h3 style="font-size:25px;margin:7px 0">'+esc(p.name)
    + '</h3>'
      + '<span>'+money(price(p))
    + '</span>'
      + '<div style="margin-top:12px" class="qty">'
      + '<button data-dec="'+p.id
    + '" aria-label="Decrease">−</button>'
      + '<span>'+x.qty
    + '</span>'
      + '<button data-inc="'+p.id
    + '" aria-label="Increase">+</button>'
      + '</div> <button class="icon-btn" data-remove="'+p.id
    + '">Remove</button>'
      + '</div>'
      + '<b>'+money(price(p)*x.qty)
    + '</b>'
      + '</div>':''
  }).join('')
  + '<p>'
    + '<a class="button outline small" href="shop.html">Continue shopping</a>'
    + '</p>'
    + '</div>'
    + '<aside class="summary">'
    + '<h3>Order summary</h3>'
    + '<div class="summary-line">'
    + '<span>Subtotal</span>'
    + '<span>'+money(sub)
  + '</span>'
    + '</div>'
    + '<div class="summary-line">'
    + '<span>Shipping</span>'
    + '<span>'+(ship?money(ship):'Complimentary')
  + '</span>'
    + '</div>'
    + '<div class="summary-line summary-total">'
    + '<span>Total</span>'
    + '<span>'+money(sub+ship)
  + '</span>'
    + '</div>'
    + '<p class="body-copy">'+(sub>=CONFIG.freeShippingThreshold?'Complimentary shipping unlocked.':'Add '+money(CONFIG.freeShippingThreshold-sub)
  + ' for complimentary shipping.')
  + '</p>'
    + '<a class="button" style="width:100%" href="checkout.html">Continue to checkout</a>'
    + '<p class="notice">Product measurements and candle fit should be confirmed on each listing before purchase.</p>'
    + '</aside>'
    + '</div>':'<div class="empty-state">'
    + '<h3>Your bag is taking a quiet moment.</h3>'
    + '<p>When something catches your eye, you can find it here.</p>'
    + '<a href="shop.html" class="button">Explore holders</a>'
    + '</div>')
  + '</div>';
  
  root.querySelectorAll('[data-inc],[data-dec],[data-remove]').forEach(b=>b.onclick=()=> {
    
    let id=b.dataset.inc||b.dataset.dec||b.dataset.remove,
    a=read(CART);
    
    if (b.dataset.remove)a=a.filter(x=>x.id!==id);
    
    else{
      
      let r=a.find(x=>x.id===id);
      
      r.qty+=b.dataset.inc?1:-1;
      
      if (r.qty<1)a=a.filter(x=>x.id!==id)
    }save(CART,
    a);
    
    sync();
    
    cart()
  })
}

function wishlist() {
  
  let w=read(WISH);
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Saved for later</span>'
    + '<h1 style="font-size:64px">Your wishlist</h1>'
    + '</div>'+(w.length?grid(products.filter(p=>w.includes(p.id))):'<div class="empty-state">'
    + '<h3>A place for your maybes.</h3>'
    + '<p>Save the resin designs you love and return when the moment is right.</p>'
    + '<a class="button" href="shop.html">Browse holders</a>'
    + '</div>')
  + '</div>'
}

function checkout() {
  
  let c=read(CART),
  sub=c.reduce((n,
  x)=> {
    
    let p=products.find(y=>y.id===x.id);
    
    return n+(p?price(p)*x.qty:0)
  },
  0),
  ship=sub===0||sub>=CONFIG.freeShippingThreshold?0:CONFIG.shippingFlatRate;
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Almost home</span>'
    + '<h1 style="font-size:64px">Checkout</h1>'
    + '</div>'
    + '<div id="orderStatus">'
    + '</div>'
    + '<div class="checkout-layout">'
    + '<form id="checkoutForm" class="form" novalidate>'
    + '<h3>Your details</h3>'
    + '<div class="field">'
    + '<label>Full name</label>'
    + '<input required name="name" autocomplete="name">'
    + '</div>'
    + '<div class="field">'
    + '<label>Email address</label>'
    + '<input required type="email" name="email" autocomplete="email">'
    + '</div>'
    + '<div class="field">'
    + '<label>Phone</label>'
    + '<input required type="tel" name="phone" autocomplete="tel">'
    + '</div>'
    + '<h3>Delivery address</h3>'
    + '<div class="field">'
    + '<label>Street address</label>'
    + '<input required name="address" autocomplete="street-address">'
    + '</div>'
    + '<div class="field">'
    + '<label>City</label>'
    + '<input required name="city" autocomplete="address-level2">'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
    + '<div class="field">'
    + '<label>State / region</label>'
    + '<input required name="state" autocomplete="address-level1">'
    + '</div>'
    + '<div class="field">'
    + '<label>Postal code</label>'
    + '<input required name="pinCode" autocomplete="postal-code">'
    + '</div>'
    + '</div>'
    + '<div class="field">'
    + '<label>Delivery notes (optional)</label>'
    + '<textarea name="deliveryDetails">'
    + '</textarea>'
    + '</div>'
    + '<h3>Payment</h3>'
    + '<label class="check-row">'
    + '<input type="radio" name="payment" value="cod" checked> Cash on delivery</label>'
    + '<label class="check-row">'
    + '<input type="radio" name="payment" value="online"> Online payment (backend placeholder)</label>'
    + '<button class="button">Place order · '+money(sub+ship)
  + '</button>'
    + '<div class="notice">Demo checkout only. No order is submitted. Online payment is unavailable.</div>'
    + '</form>'
    + '<aside class="summary">'
    + '<h3>Your order</h3>'+c.map(x=> {
    
    let p=products.find(y=>y.id===x.id);
    
    return p?'<div class="summary-line">'
      + '<span>'+esc(p.name)
    + ' × '+x.qty
    + '</span>'
      + '<span>'+money(price(p)*x.qty)
    + '</span>'
      + '</div>':''
  }).join('')
  + '<div class="summary-line">'
    + '<span>Subtotal</span>'
    + '<span>'+money(sub)
  + '</span>'
    + '</div>'
    + '<div class="summary-line">'
    + '<span>Shipping</span>'
    + '<span>'+(ship?money(ship):'Complimentary')
  + '</span>'
    + '</div>'
    + '<div class="summary-line summary-total">'
    + '<span>Total</span>'
    + '<span>'+money(sub+ship)
  + '</span>'
    + '</div>'
    + '</aside>'
    + '</div>'
    + '</div>';
  
  document.querySelector('#checkoutForm').onsubmit=async e=> {
    
    e.preventDefault();
    
    let f=e.currentTarget;
    
    f.querySelectorAll('.form-error').forEach(x=>x.remove());
    
    let valid=true;
    
    f.querySelectorAll('[required]').forEach(i=> {
      
      if (!i.value.trim()||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value))) {
        
        valid=false;
        
        let z=document.createElement('small');
        
        z.className='form-error';
        
        z.textContent=i.value?'Enter a valid email address.':'This field is required.';
        
        i.after(z)
      }
    });
    
    if (!valid) {
      
      f.querySelector('.form-error')?.previousElementSibling?.focus();
      
      return
    }if (!c.length) {
      
      document.querySelector('#orderStatus').innerHTML='<div class="notice">Your bag is empty. <a href="shop.html">Browse holders</a>.</div>';
      
      return
    }let r;
    try { r=await submitOrder({
      
      customer:Object.fromEntries(new FormData(f)),
      items:c,
      payment:new FormData(f).get('payment'),
      total:sub+ship
    }); } catch (error) {
      document.querySelector('#orderStatus').innerHTML='<div class="notice">'+esc(error.message||'Order could not be placed. Please try again.')+'</div>';
      return;
    }
    
    document.querySelector('#orderStatus').innerHTML='<div class="success">'
      + '<b>'+(r.demo?'Demo order prepared · ':'Order received · ')+esc(r.reference)
    + '</b>'
      + '<br>'+esc(r.demo?'No order was submitted and no payment was processed.':(r.message||'Order saved. No payment was processed.'))+'</div>';
    
    save(CART,
    []);
    
    sync();
    
    f.reset()
  }
}

function about() {
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">A little about us</span>'
    + '<h1 style="font-size:68px">The beauty of<br>slowing down.</h1>'
    + '<p>KAYA CANDLES is a home décor brand focused on sculptural resin candle holders and thoughtful details.</p>'
    + '</div>'
    + '<div class="split">'
    + '<img src="'+products[0].image
  + '" alt="Decorative candle holder in warm evening light">'
    + '<div>'
    + '<span class="eyebrow">Our story</span>'
    + '<h2>Small forms. Personal spaces.</h2>'
    + '<p class="body-copy">We create decorative resin candle holders that bring color, shape, and a personal touch to the everyday spaces where life happens.</p>'
    + '<p class="body-copy">From softly marbled finishes to playful sculptural forms, each design is made to feel at home in your own style.</p>'
    + '</div>'
    + '</div>'
    + '<section class="section">'
    + '<div class="section-head">'
    + '<span class="eyebrow">Our approach</span>'
    + '<h2>Good things take their time.</h2>'
    + '</div>'
    + '<div class="product-grid three-up">'
    + '<div class="review">'
    + '<h3>Thoughtful forms</h3>'
    + '<p>We focus on shapes and colors that work as considered accents throughout the home.</p>'
    + '</div>'
    + '<div class="review">'
    + '<h3>Resin, color, detail</h3>'
    + '<p>Each design pairs resin material with a distinctive surface and silhouette.</p>'
    + '</div>'
    + '<div class="review">'
    + '<h3>Thoughtful details</h3>'
    + '<p>Decorative holders add a small point of interest to a table, shelf, or mantel.</p>'
    + '</div>'
    + '</div>'
    + '</section>'
    + '</div>'
}

function contact() {
  
  root.innerHTML='<div class="container">'
    + '<div class="section-head">'
    + '<span class="eyebrow">We are here to help</span>'
    + '<h1 style="font-size:68px">Say hello.</h1>'
    + '<p>Questions about a holder, its dimensions, candle fit, or a gift? Send a note.</p>'
    + '</div>'
    + '<div class="checkout-layout">'
    + '<form id="contactForm" class="form" novalidate>'
    + '<div class="field">'
    + '<label>Name</label>'
    + '<input required name="name">'
    + '</div>'
    + '<div class="field">'
    + '<label>Email</label>'
    + '<input required type="email" name="email">'
    + '</div>'
    + '<div class="field">'
    + '<label>Subject</label>'
    + '<input required name="subject">'
    + '</div>'
    + '<div class="field">'
    + '<label>Message</label>'
    + '<textarea required name="message">'
    + '</textarea>'
    + '</div>'
    + '<button class="button">Send message</button>'
    + '<p class="notice">Demo form only. Messages are not saved or sent.</p>'
    + '<div id="contactStatus">'
    + '</div>'
    + '</form>'
    + '<div>'
    + '<h3>Get in touch</h3>'
    + '<p class="body-copy">Email: <a href="mailto:hello@example.com">hello@example.com</a>'
    + '<br>Phone: <a href="tel:+15550102020">+1 (555) 010-2020</a>'
    + '<br>Studio: 123 Sample Street, Portland, OR</p>'
    + '<a class="button outline" target="_blank" rel="noopener" href="https://wa.me/'+CONFIG.whatsappNumber
  + '">Message on WhatsApp</a>'
    + '<div class="faq" style="padding:40px 0">'
    + '<h3>Frequently asked</h3>'
    + '<details>'
    + '<summary>How long does shipping take?</summary>'
    + '<p>Delivery estimates are placeholders. Carrier setup is required.</p>'
    + '</details>'
    + '<details>'
    + '<summary>Can I return a holder?</summary>'
    + '<p>See the sample returns page. Real return handling requires backend support.</p>'
    + '</details>'
    + '<details>'
    + '<summary>How should I care for a resin holder?</summary>'
    + '<p>Wipe gently with a soft, dry cloth. Keep resin away from direct flame and excessive heat. Use only with a candle that fits the holder as specified on its product listing.</p>'
    + '</details>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
  
  document.querySelector('#contactForm').onsubmit=async e=> {
    
    e.preventDefault();
    
    let f=e.currentTarget;
    
    f.querySelectorAll('.form-error').forEach(x=>x.remove());
    
    let ok=true;
    
    f.querySelectorAll('[required]').forEach(i=> {
      
      if (!i.value.trim()||(i.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value))) {
        
        ok=false;
        
        let s=document.createElement('small');
        
        s.className='form-error';
        
        s.textContent='Please check this field.';
        
        i.after(s)
      }
    });
    
    if (ok) {
      
      let r;
      try { r=await submitContact(Object.fromEntries(new FormData(f))); }
      catch (error) { document.querySelector('#contactStatus').innerHTML='<div class="notice">'+esc(error.message||'Message could not be submitted.')+'</div>'; return; }
      
      document.querySelector('#contactStatus').innerHTML='<div class="success">'+esc(r.message)
      + '</div>';
      
      f.reset()
    }
  }
}

function policy() {
  
  let data={
    
    'shipping-policy':['Shipping policy',
    'Shipping timing, carrier options, and tracking are sample content. Actual delivery requires backend and fulfillment setup.',
    'Demo shipping is complimentary on orders of '+money(CONFIG.freeShippingThreshold)
    + ' or more. Orders below use the configurable flat rate of '+money(CONFIG.shippingFlatRate)
    + '. No parcel is dispatched.'],
    'return-policy':['Returns & refunds',
    'This sample policy is for layout demonstration and should be replaced with business terms before launch.',
    'For real purchases, define eligibility, return labels, refunds, and processing times with your business. No purchases can be made in this demo.'],
    'privacy-policy':['Privacy policy',
    'This demo stores cart and wishlist selections in local storage on your device. Newsletter and contact forms do not transmit or store submissions.',
    'A production policy should explain collected data, purpose, retention, processors, and customer rights. Review it for your jurisdiction.'],
    'terms':['Terms & conditions',
    'This demo storefront is not an offer to sell. Products, prices, and testimonials are sample content.',
    'No checkout, payment, inventory reservation, fulfillment, or tracking is available. Replace with business-approved terms.'],
    'candle-care':['Resin holder care',
    'Resin candle holders are decorative accessories. Care for the holder separately from the candle and follow the candle maker’s safety directions.',
    'Wipe the holder with a soft, dry cloth. Keep resin away from direct flame and excessive heat. Use only with a candle type and size confirmed to fit the individual product. Place the candle on a stable surface, keep it away from flammable items, children, and pets, and never leave a burning candle unattended.']
  },
  d=data[page]||data['shipping-policy'];
  
  root.innerHTML='<div class="policy-content">'
    + '<span class="eyebrow">KAYA CANDLES · INFORMATION</span>'
    + '<h1 style="font-size:67px">'+d[0]
  + '</h1>'
    + '<p>'+d[1]
  + '</p>'
    + '<h2>What to expect</h2>'
    + '<p>'+d[2]
  + '</p>'
    + '<h2>Need help?</h2>'
    + '<p>Contact <a href="mailto:hello@example.com">hello@example.com</a>.</p>'
    + '<p style="font-size:11px">Sample policy content. Replace with approved terms before launch.</p>'
    + '</div>'
}

function render() {
  
  if (page==='home')home();
  
  else if (page==='shop')shop();
  
  else if (page==='product')productPage();
  
  else if (page==='cart')cart();
  
  else if (page==='wishlist')wishlist();
  
  else if (page==='checkout')checkout();
  
  else if (page==='about')about();
  
  else if (page==='contact')contact();
  
  else policy()
}

try {
  const remoteProducts = await fetchProducts();
  if (Array.isArray(remoteProducts) && remoteProducts.length) products = remoteProducts;
} catch (error) {
  console.error('Product service unavailable; using sample catalog.', error);
}

render();

initNavigation();

document.addEventListener('error',
e=> {
  
  if (e.target.tagName==='IMG'&&!e.target.dataset.fallback) {
    
    e.target.dataset.fallback='1';
    
    e.target.src='assets/images/fallback.svg'
  }
},
true);

document.addEventListener('click',
e=> {
  
  let a=e.target.closest('[data-add]'),
  w=e.target.closest('[data-wish]');
  
  if (a) {
    
    e.preventDefault();
    
    add(a.dataset.add)
  }if (w) {
    
    e.preventDefault();
    
    wish(w.dataset.wish)
  }
});

document.querySelectorAll('[data-newsletter]').forEach(f=>f.onsubmit=async e=> {
  
  e.preventDefault();
  
  let i=f.querySelector('input'),
  s=f.querySelector('[data-status]');
  
  if (!i.checkValidity()) {
    
    i.reportValidity();
    
    return
  }let r;
  try { r=await subscribeNewsletter({
    
    email:i.value
  }); } catch (error) { s.textContent=error.message||'Subscription could not be saved.'; return; }
  
  s.textContent=r.message;
  
  f.reset()
});

sync();
