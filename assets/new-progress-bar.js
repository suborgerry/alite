async function updateProgressBar() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const items = cart.items || [];

    let totalQuantity = 0;
    items.forEach(item => {
      totalQuantity += item.quantity;
    });

    // Снимаем класс со всех svg иконок в прогресс-барах
    document.querySelectorAll('.new-progress-bar svg').forEach(svg => {
      svg.classList.remove('active-progress-svg');
    });

    // Хелпер: активировать SVG в указанных контейнерах
    function activateSvg(className) {
      const svg = document.querySelector(`.${className} svg:first-of-type`);
      if (svg) {
        svg.classList.add('active-progress-svg');
      }
    }

    // Проверяем количество и активируем иконки для каждой версии
    if (totalQuantity >= 4) {
      activateSvg('first-off');
      activateSvg('first-off-mob');
    }
    if (totalQuantity >= 6) {
      activateSvg('second-off');
      activateSvg('second-off-mob');
    }
    if (totalQuantity >= 10) {
      activateSvg('third-off');
      activateSvg('third-off-mob');
    }

  } catch (error) {
    console.error('Ошибка при обновлении прогресс-бара:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();

  document.querySelectorAll('.ts-product__button').forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(updateProgressBar, 800); // Ждём пока товар добавится
    });
  });
});
