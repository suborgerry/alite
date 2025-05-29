document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('discount-popup');
  const closeButton = document.getElementById('popup-discount-btn');
  const popupText = popup.querySelector('.popup-discount-text');

  const svgElement = popupText.querySelector('svg');
  const textNode = document.createElement('span');
  popupText.appendChild(textNode);

  let hideTimeout = null;
  let lastDiscountLevel = 0; 
  let manuallyClosed = false;

 function showPopup() {
  if (manuallyClosed) return;
  
  popup.classList.add('show-pop');

  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    hidePopup();
  }, 5000);
}


  function hidePopup() {
    popup.classList.remove('show-pop');
    if (hideTimeout) clearTimeout(hideTimeout);
  }

  closeButton.addEventListener('click', function() {
    manuallyClosed = true; 
    hidePopup();
  });

  function calculateDiscount(totalItems) {
    if (totalItems < 4) return 0;
    if (totalItems < 6) return 10;
    if (totalItems < 10) return 20;
    return 30;
  }

  function updatePopupText(totalItems) {
    let nextTarget = 0;
    let currentDiscount = 0;
    let nextDiscount = 0;

    if (totalItems < 4) {
      nextTarget = 4;
      nextDiscount = 10;

      const stickersLeft = nextTarget - totalItems;
      textNode.innerHTML = `
        <span>${stickersLeft} stickers left to get <span style="color:#CE3040;font-weight:600;">${nextDiscount}% OFF</span></span>
      `;
      return;
    }

    if (totalItems < 6) {
      currentDiscount = 10;
      nextTarget = 6;
      nextDiscount = 20;
    } else if (totalItems < 10) {
      currentDiscount = 20;
      nextTarget = 10;
      nextDiscount = 30;
    } else {
      currentDiscount = 30;
      textNode.innerHTML = `
        <strong style="margin-right: 10px;">–${currentDiscount}% OFF</strong>
        <span>Maximum discount <span style="color:#CE3040;font-weight:600;">30% OFF</span> reached!</span>
      `;
      return;
    }

    const stickersLeft = nextTarget - totalItems;
    textNode.innerHTML = `
      <strong style="margin-right: 10px;">–${currentDiscount}% OFF</strong>
      <span>${stickersLeft} stickers left to get <span style="color:#CE3040;font-weight:600;">${nextDiscount}% OFF</span></span>
    `;
  }

  async function fetchCartItemsCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      let totalQuantity = 0;

      cart.items.forEach(item => {
        totalQuantity += item.quantity;
      });

      return totalQuantity;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return 0;
    }
  }

 async function handleCartUpdate() {
  const totalItems = await fetchCartItemsCount();
  const currentDiscount = calculateDiscount(totalItems);

  if (currentDiscount !== lastDiscountLevel) {
    manuallyClosed = false;
    updatePopupText(totalItems);
    hidePopup();

    setTimeout(() => {
      showPopup(); 
    }, 50);
  } else {
    if (manuallyClosed) {
      manuallyClosed = false;
    }
    updatePopupText(totalItems);
    showPopup(); 
  }

  lastDiscountLevel = currentDiscount;
}


  document.addEventListener('submit', function (event) {
    const form = event.target.closest('form[action^="/cart/add"]');
    if (form) {
      event.preventDefault();
      const formData = new FormData(form);

      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(handleCartUpdate)
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    }
  }, true);

  document.querySelectorAll('.ts-product__button').forEach(button => {
    button.addEventListener('click', function () {
      setTimeout(handleCartUpdate, 700);
    });
  });
});

