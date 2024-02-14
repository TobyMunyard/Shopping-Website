let cartIcon = document.querySelector('.cart-icon'); 
let closeButton = document.querySelector('.close');
let body = document.querySelector('body');
let productListHTML = document.querySelector('.productList');
let cartListHTML = document.querySelector('.cartItems');
let cartIconSpan = document.querySelector('.cart-icon span');

let productList = [];
let carts = [];

cartIcon.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeButton.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

productListHTML.addEventListener('click', (event) => {
    let clickPosition = event.target;
    if(clickPosition.classList.contains('addToCart')){
        let product_id = clickPosition.parentElement.dataset.id;
        addToCart(product_id);
    }
});

cartListHTML.addEventListener('click', (event) => {
    let clickPosition = event.target;
    if(clickPosition.classList.contains('minus')){
        let product_id = clickPosition.parentElement.parentElement.dataset.id;
        changeQuantity(product_id, 'minus');
    }else if(clickPosition.classList.contains('plus')){
        let product_id = clickPosition.parentElement.parentElement.dataset.id;
        changeQuantity(product_id, 'plus');
    }
});

const changeQuantity = (product_id, type) => {
    let positionOfProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionOfProductInCart >= 0){
        switch(type){
            case 'minus':  
                let valueChange = carts[positionOfProductInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionOfProductInCart].quantity -= 1;
                }else{
                    carts.splice(positionOfProductInCart, 1);
                }
                break;
            case 'plus':
                carts[positionOfProductInCart].quantity += 1;
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const addDataToHTML = () => {
    productListHTML.innerHTML = '';
    if(productList.length > 0) {
        productList.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt = "">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class ="addToCart">Add To Cart</button>
            `;
            productListHTML.appendChild(newProduct);
        })
    }
};

const addToCart = (product_id) => {
    let positionOfProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionOfProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionOfProductInCart].quantity += 1;
    }
    console.log(carts);
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
} 

const addCartToHTML = () => {
    cartListHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let productPosition = productList.findIndex((value) => value.id == cart.product_id);
            let info = productList[productPosition];
            newCart.innerHTML = `
            <div class="image">
            <img src="${info.image}" alt="">
            </div>
            <div class="name">${info.name}</div>
            <div class="totalPrice">$${info.price * cart.quantity}</div>
            <div class="quantity">
            <span class = "minus">-</span>
            <span class = "number">${cart.quantity}</span>
            <span class = "plus">+</span>
            </div>
            `;
            cartListHTML.appendChild(newCart);
        })
    }
    cartIconSpan.textContent = totalQuantity;
}

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        productList = data;
        addDataToHTML();

        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addDataToHTML();
        }
    })
};

initApp();