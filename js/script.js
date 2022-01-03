let cart = [];
let modalQt = 0;
let key = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

coffeeJson.map((item, index)=>{
    let coffeeItem = c('.models .coffee-item').cloneNode(true); 
    coffeeItem.setAttribute('data-key', index);
    coffeeItem.querySelector('.coffee-item--img img').src= item.img;
    coffeeItem.querySelector('.coffee-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    coffeeItem.querySelector('.coffee-item--name').innerHTML = item.name;
    coffeeItem.querySelector('.coffee-item--desc').innerHTML = item.description;

    coffeeItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        key = e.target.closest('.coffee-item').getAttribute('data-key');
        modalQt = 1;

        c('.coffeeBig img').src = coffeeJson[key].img;
        c('.coffeeInfo h1').innerHTML = coffeeJson[key].name;
        c('.coffeeInfo--desc').innerHTML = coffeeJson[key].description;
        c('.coffeeInfo--actualPrice').innerHTML = `R$ ${coffeeJson[key].price.toFixed(2)}`;

        c('.coffeeInfo--qt').innerHTML = modalQt;

        c('.coffeeWindowArea').style.opacity = 0;
        c('.coffeeWindowArea').style.display = 'flex';
        setTimeout(()=> {
            c('.coffeeWindowArea').style.opacity = 1;
        }, 200);
    });

     c('.coffee-area').append(coffeeItem);

 });

function closeModal(){
    c('.coffeeWindowArea').style.opacity = 0;
    setTimeout(()=> {
        c('.coffeeWindowArea').style.display = 'none';
    }, 500);
}

cs('.coffeeInfo--cancelButton, .coffeeInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.coffeeInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.coffeeInfo--qt').innerHTML = modalQt;
        let total = (coffeeJson[key].price * (modalQt + 1)) - coffeeJson[key].price
        c('.coffeeInfo--actualPrice').innerHTML = `R$ ${total.toFixed(2)}`
    }
});

c('.coffeeInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.coffeeInfo--qt').innerHTML = modalQt;
    let total = coffeeJson[key].price * modalQt
    c('.coffeeInfo--actualPrice').innerHTML = `R$ ${total.toFixed(2)}`
});

c('.coffeeInfo--addButton').addEventListener('click', ()=>{
    let identifier = coffeeJson[key].id+'@';
    let localId = cart.findIndex((item)=>item.identifier == identifier);

    if (localId > -1) {
        cart[localId].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:coffeeJson[key].id,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length >0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let total = 0;

        for(let i in cart) {
            let coffeeItem = coffeeJson.find((item)=>item.id == cart[i].id);
            total += coffeeItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
        
            let coffeeName = `${coffeeItem.name}`
            cartItem.querySelector('img').src = coffeeItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = coffeeName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            c('.cart').append(cartItem);

            c('.cart--clear').addEventListener('click', () => {
                cart = [];
                updateCart()
            })
        }

        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
    
}

c('.cart--finalizar').addEventListener('click', () => {
    c('aside').classList.remove('show');
})