
document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('cart-popup');
  const closeBtn = document.getElementById('popup-cart-btn');
  const popupContainer = document.querySelector('.cart-popup-container');
  const controlBar = document.querySelector('.ts-controlbar');

  let hideTimeout = null;

 function showCartPopup() {
  if (hideTimeout) clearTimeout(hideTimeout);

  // Задержка перед показом — ждём, пока контролбар выедет
  setTimeout(() => {
    popup.classList.add('show-popup-cart');
    hideTimeout = setTimeout(hideCartPopup, 5000);
  }, 300); // подбери под свою анимацию контролбара
}

  function hideCartPopup() {
    popup.classList.remove('show-popup-cart');
    if (hideTimeout) clearTimeout(hideTimeout);
  }

  // Клик по крестику
  closeBtn.addEventListener('click', hideCartPopup);

  // Shopify стандартные формы
  document.addEventListener('submit', function (event) {
    const form = event.target.closest('form[action^="/cart/add"]');
    if (form) {
      event.preventDefault();
      const formData = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(() => {
          showCartPopup();
        })
        .catch(console.error);
    }
  }, true);

  // Кастомные кнопки
  document.querySelectorAll('.ts-product__button').forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(showCartPopup, 700);
    });
  });

  // Обновление позиции попапа при движении контролбара (только на мобилках)
   if (popupContainer) {
 function updatePopupPosition() {
  const screenHeight = window.innerHeight;

  if (window.innerWidth > 989) {
    const hasDiscountPopup = document.querySelector('.ts-discount-popup-container');
    popupContainer.style.bottom = hasDiscountPopup ? '155px' : '75px';
    return;
  }

  const controlBar = document.querySelector('.ts-controlbar');
  const stickyAdd = document.querySelector('.ts-sticky-add');

  const minY = screenHeight - 75;
  const maxY = screenHeight - 145;

  let elementBottom = minY;

  if (controlBar || stickyAdd) {
    const controlBarRect = controlBar?.getBoundingClientRect();
    const stickyAddRect = stickyAdd?.getBoundingClientRect();

    const controlBarTop = controlBarRect ? controlBarRect.top : -Infinity;
    const stickyAddTop = stickyAddRect ? stickyAddRect.top : -Infinity;

    elementBottom = Math.max(controlBarTop, stickyAddTop);
  }

  const clampedY = Math.max(Math.min(elementBottom, minY), maxY);
  const progress = (minY - clampedY) / (minY - maxY);
  const newBottom = 75 + (145 - 75) * progress;

  popupContainer.style.bottom = `${newBottom}px`;
}


  window.addEventListener('scroll', updatePopupPosition);
  window.addEventListener('resize', updatePopupPosition);
  setInterval(updatePopupPosition, 100);
}

});

