document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  const slidingContainer = document.querySelector('#sliding-container')
  const hamburger = document.querySelector('.hamburger');
  const mobileShoppingCartButton = document.querySelector('.shopping-cart-button');
  const desktopShoppingCartButton = document.querySelector('#shopping-cart-button');
  const shoppingCartModalXButton = document.querySelector('.shopping-cart-top-x-icon');
  const productItemToBuy = document.querySelectorAll('.cart-btn');
  let mobNavStat = 0;

  // handle nav clicks
  document.querySelectorAll('.nav--link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        document.querySelector('#sliding-container').scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  hamburger.addEventListener('click', mobileMenu);

  // handle nav menu animation
  function mobileMenu() {
    if (mobNavStat === 0) {
      hamburger.classList.add('active');
      slidingContainer.classList.add('left');
      mobNavStat = 1;
    } else {
      hamburger.classList.remove('active');
      slidingContainer.classList.remove('left');
      mobNavStat = 0;
    }
  }

  // handle shopping cart modal animation
  mobileShoppingCartButton.addEventListener('click', shoppingCartModal);
  desktopShoppingCartButton.addEventListener('click', shoppingCartModal);
  shoppingCartModalXButton.addEventListener('click', shoppingCartModal);

  function shoppingCartModal() {
    console.log("shopping cart modal click");
    slidingContainer.classList.toggle('right');
  }

  // handle add-to-cart action
  productItemToBuy.forEach((productItem) => {
    productItem.addEventListener('click', (event) => {
      addToCart(event);
    })
  })

  // handle header bar color on scroll
  document.querySelector('#sliding-container').addEventListener('scroll', function () {
    const pageColumnHeader = document.querySelector('.page-column-mobile-header');
    const navHeader = document.querySelector('.top-and-left-nav-bar');
    console.log('scoll');
    if (document.querySelector('#sliding-container').scrollTop > 0) {
      pageColumnHeader.classList.add('scrolled');
      navHeader.classList.add('scrolled');
    } else {
      pageColumnHeader.classList.remove('scrolled');
      navHeader.classList.remove('scrolled');
    }
  });

  window.addEventListener('load', function () {
    document.querySelector(".loader").style.display = 'none';
  });
});

const checkoutItems = document.querySelector('.checkout-items');
const checkoutTotal = document.querySelector('#checkout-total');
const currentShoppingCart = {};
let cartItemQuantityElement;
let cartItemPriceElement;
let total = 0;

function addToCart(event) {
  console.log("add to cart");
  let itemAlreadyInCart = event.currentTarget.dataset.product in currentShoppingCart;

  if (!itemAlreadyInCart) {
    currentShoppingCart[event.currentTarget.dataset.product] = {
      name: event.currentTarget.dataset.product,
      nameConcat: event.currentTarget.dataset.product.replaceAll(' ', '_'),
      quantity: 1,
      image: event.currentTarget.dataset.image,
      unitPrice: parseInt(event.currentTarget.dataset.price, 10),
      price: parseInt(event.currentTarget.dataset.price, 10)
    };

    let newItem = `
      <div class="cart-item" id="${currentShoppingCart[event.currentTarget.dataset.product].nameConcat}">
        <div class="cart-item-left-side" style="">
          <!-- checkout item image -->
          <div class="cart-item-image" style="background-image: url('${currentShoppingCart[event.currentTarget.dataset.product].image}');"></div>
          <!-- checkout item name -->
          <div class="cart-item-name">
            <h4 class="mb-0"><span class="white-text">${currentShoppingCart[event.currentTarget.dataset.product].name}</span></h4>
            <p class="cart-item-name-description">Product description.</p>
          </div>
        </div>

        <div class="cart-item-right-side" >
          <div class="cart-item-price-quantity">
            <!-- checkout item quantity -->
            <div class="cart-item-quantity-container">
              <h4 class="cart-item-quantity">
              <i class="fas fa-chevron-circle-up orange-text" onclick="incrementCartItem('${currentShoppingCart[event.currentTarget.dataset.product].name}')"></i>
              <span class="white-text" id="${currentShoppingCart[event.currentTarget.dataset.product].nameConcat}-quantity">1</span>
              <i class="fas fa-chevron-circle-down orange-text" onclick="decrementCartItem('${currentShoppingCart[event.currentTarget.dataset.product].name}')"></i></h4>
            </div>

            <!-- checkout item price -->
            <div class="cart-item-price-container">
              <h4 class="cart-item-price"><span class="white-text" id="${currentShoppingCart[event.currentTarget.dataset.product].nameConcat}-price">$${currentShoppingCart[event.currentTarget.dataset.product].price}.00</span></h4>
            </div>
          </div>

          <!-- trash -->
          <div class="cart-item-trash-container">
            <h4 class="cart-item-trash"><i class="fas fa-trash orange-text" onclick="removeCartItem('${currentShoppingCart[event.currentTarget.dataset.product].name}')"></i></h4>
          </div>
        </div>
      </div>
    `
    checkoutItems.insertAdjacentHTML('beforeend', newItem)
  } else {
    incrementCartItem(currentShoppingCart[event.currentTarget.dataset.product].name)
  }
  updateTotalPrice();
}

function removeCartItem(itemName) {
  let cartItemToRemove = document.querySelector(`#${currentShoppingCart[itemName].nameConcat}`)
  cartItemToRemove.remove();
  delete currentShoppingCart[itemName]
  updateTotalPrice();
}

function incrementCartItem(itemName) {
  if (currentShoppingCart[itemName].quantity < 3) {
    currentShoppingCart[itemName].quantity = currentShoppingCart[itemName].quantity + 1; 
    currentShoppingCart[itemName].price += currentShoppingCart[itemName].unitPrice;
    cartItemPriceElement = document.querySelector(`#${currentShoppingCart[itemName].nameConcat}-price`)
    cartItemPriceElement.innerHTML = `$${currentShoppingCart[itemName].price}.00`
    cartItemQuantityElement = document.querySelector(`#${currentShoppingCart[itemName].nameConcat}-quantity`)
    cartItemQuantityElement.innerHTML = `${currentShoppingCart[itemName].quantity}`
  }
  updateTotalPrice();
}

function decrementCartItem(itemName) {
  if (currentShoppingCart[itemName].quantity > 0) {
    currentShoppingCart[itemName].quantity = currentShoppingCart[itemName].quantity - 1;
    cartItemQuantityElement = document.querySelector(`#${currentShoppingCart[itemName].nameConcat}-quantity`)
    cartItemQuantityElement.innerHTML = `${currentShoppingCart[itemName].quantity}`
    currentShoppingCart[itemName].price -= currentShoppingCart[itemName].unitPrice;
    cartItemPriceElement = document.querySelector(`#${currentShoppingCart[itemName].nameConcat}-price`)
    cartItemPriceElement.innerHTML = `$${currentShoppingCart[itemName].price}.00`
  }
  updateTotalPrice();
}

function updateTotalPrice() {
  total = 0;
  for (const item in currentShoppingCart) {
    total += currentShoppingCart[item].price;
  }
  checkoutTotal.innerHTML = `$${total}.00`
}
