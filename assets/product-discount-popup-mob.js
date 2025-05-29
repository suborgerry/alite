document.addEventListener('DOMContentLoaded', function () {
  const popupContainer = document.querySelector('.ts-discount-popup-container');
  const popupTextContainer = document.querySelector('.ts-discount-popup__text-content');
  const controlBar = document.querySelector('.ts-sticky-add');

  let hideTimeout = null;
  let swipeStartY = 0;
  let swipeEndY = 0;
  let swipeThreshold = 50; 

  function showPopup() {
    if (window.innerWidth > 989) return;
    popupContainer.classList.add('show');
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hidePopup, 5000);
  }

  function hidePopup() {
    popupContainer.classList.remove('show');
    if (hideTimeout) clearTimeout(hideTimeout);
  }

  async function fetchCartItemsCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return 0;
    }
  }

  async function updatePopupTextManually() {
    const totalItems = await fetchCartItemsCount();
    updatePopupText(totalItems);
  }

  function updatePopupText(totalItems) {
    const discountLeftEl = document.querySelector('.ts-discount-popup__discount-left');
    const highlightEl = document.querySelector('.ts-discount-popup__highlight');
    const textContentWrapper = document.querySelector('.ts-discount-popup__text-content');

    if (!discountLeftEl || !highlightEl || !textContentWrapper) {
      console.warn('One or more discount popup elements are missing.');
      return;
    }

    let currentDiscount = 0;
    let nextDiscount = 0;
    let nextTarget = 0;
    let leftToNext = 0;

    if (totalItems >= 10) {
      currentDiscount = 30;
      discountLeftEl.textContent = `-30% OFF`;
      highlightEl.textContent = `30% OFF`;
      textContentWrapper.innerHTML = `Max discount reached!`;
    } else {
      if (totalItems >= 6) {
        currentDiscount = 20;
        nextDiscount = 30;
        nextTarget = 10;
      } else if (totalItems >= 4) {
        currentDiscount = 10;
        nextDiscount = 20;
        nextTarget = 6;
      } else {
        currentDiscount = 0;
        nextDiscount = 10;
        nextTarget = 4;
      }

      leftToNext = nextTarget - totalItems;
      discountLeftEl.textContent = currentDiscount > 0 ? `-${currentDiscount}% OFF` : '';
      highlightEl.textContent = `${nextDiscount}% OFF`;
      textContentWrapper.innerHTML = `${leftToNext} stickers left to get <span class="ts-discount-popup__highlight">${nextDiscount}% OFF</span>`;
    }
  }

  async function handleCartUpdate() {
    const totalItems = await fetchCartItemsCount();
    updatePopupText(totalItems);
    showPopup();
  }

  updatePopupTextManually();

  document.addEventListener('submit', function (event) {
    const form = event.target.closest('form[action^="/cart/add"]');
    if (form) {
      event.preventDefault();
      const formData = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(handleCartUpdate)
        .catch(console.error);
    }
  }, true);

  document.querySelectorAll('.ts-product__button').forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(handleCartUpdate, 700);
    });
  });

  controlBar.addEventListener('touchstart', function(e) {
    swipeStartY = e.touches[0].clientY;
  });
controlBar.addEventListener('touchend', function(e) {
  console.log('touchend triggered');
});
  controlBar.addEventListener('touchmove', function(e) {
    const deltaY = e.touches[0].clientY - swipeStartY;
    if (popupContainer.classList.contains('show') && deltaY > swipeThreshold) {
      hidePopup();
    }
    if ((deltaY * -1) > swipeThreshold && !popupContainer.classList.contains('show')) {
      showPopup();
    }
  });

});