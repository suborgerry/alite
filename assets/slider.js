 document.addEventListener("DOMContentLoaded", function () {
      if (window.__sliderInitialized) return;
      window.__sliderInitialized = true;
    const slides = document.querySelectorAll(".updated-banner")
    const totalSlides = slides.length;
    const progressBarsContainers = document.querySelectorAll(".progress-bar");
    let nextIndexToAppend = 0;
    const slidesContainer = document.querySelector(".banner-viewport");
    let activeSlide = document.querySelector(".active-banner");
    const progressBars = document.querySelectorAll(".progress-bar .fill");
    let progressInterval;
    let progressTimeout;
    let hasFirstPainted = false;
    let isTransitioning = false;
    const autoScrollTime = {{ section.settings.autoscroll }} * 1000;

    activeSlide.querySelector("img").setAttribute("loading", "eager");
    activeSlide.nextElementSibling.querySelector("img").setAttribute("loading", "eager");
    activeSlide.previousElementSibling.querySelector("img").setAttribute("loading", "eager");
    function getActiveSlideIndex() {
  const active = document.querySelector(".updated-banner.active-banner");
  return active ? parseInt(active.dataset.index) : 0;
}
    function addSlideClones(direсtion) {

      if(direсtion ==="prev"){
        for(let i = totalSlides - 1; i>=0;i--){
        const slide = slides[i]
        const slideCopy = slide.cloneNode(true);
        slideCopy.classList.remove("active-banner");
        slideCopy.classList.remove("next-banner");
        slideCopy.classList.remove("previous-banner");
        slideCopy.classList.remove("hidden-clone-next");
        slideCopy.classList.add("hidden-clone-prev");
        slidesContainer.insertBefore(slideCopy, slidesContainer.firstChild);
        }

      }
      if(direсtion ==="next"){
      slides.forEach(slide=>{
        const slideCopy = slide.cloneNode(true);
        slideCopy.classList.remove("active-banner");
        slideCopy.classList.remove("next-banner");
        slideCopy.classList.remove("previous-banner");
        slideCopy.classList.remove("hidden-clone-prev");
        slideCopy.classList.add("hidden-clone-next");
        slidesContainer.appendChild(slideCopy);
      })
      }
  }
function showNextSlide() {
    if (isTransitioning) return;
  isTransitioning = true;
  const current = document.querySelector(".active-banner");
  const next = document.querySelector(".next-banner");
  const prev = document.querySelector(".previous-banner");

  if (!current || !next || !prev) return;

  prev.classList.remove("previous-banner");
  current.classList.remove("active-banner");
  next.classList.remove("next-banner");

  prev.classList.add("hidden-clone-prev");
  current.classList.add("previous-banner");
  next.classList.add("active-banner");

let newNext = next.nextElementSibling;
while (newNext && !newNext.classList.contains("updated-banner")) {
  newNext = newNext.nextElementSibling;
}

let preloadNext = newNext?.nextElementSibling;
while (preloadNext && !preloadNext.classList.contains("updated-banner")) {
  preloadNext = preloadNext.nextElementSibling;
}

if (!preloadNext) {
  const currentIndex = +document.querySelector(".active-banner").dataset.index;
  const preloadIndex = (currentIndex + 2) % totalSlides;
  const preloadOriginal = document.querySelector(`.updated-banner[data-index='${preloadIndex}']`);
  if (preloadOriginal) {
    const preloadClone = preloadOriginal.cloneNode(true);
    preloadClone.classList.remove("active-banner", "next-banner", "previous-banner", "hidden-clone-prev");
    preloadClone.classList.add("updated-banner", "hidden-clone-next");
    slidesContainer.appendChild(preloadClone);
      const firstSlide = slidesContainer.querySelector(".updated-banner");
      if (firstSlide) slidesContainer.removeChild(firstSlide);
  }
}

  if (newNext) {
    newNext.classList.remove("hidden-clone-next");
    newNext.classList.add("next-banner");
  } else {
    const activeIndex = document.querySelector(".active-banner").dataset.index;
    const nextIndex = (+activeIndex + totalSlides + 1) % totalSlides
      let firstOriginal = document.querySelector(`.updated-banner[data-index='${nextIndex}']`);
      const slideCopy = firstOriginal.cloneNode(true);
      slideCopy.classList.remove("active-banner", "previous-banner", "next-banner","hidden-clone-next","hidden-clone-prev");
      slideCopy.classList.add("updated-banner", "hidden-clone-next");
      slidesContainer.appendChild(slideCopy);
      const firstSlide = slidesContainer.querySelector(".updated-banner");
      if (firstSlide) slidesContainer.removeChild(firstSlide);
      requestAnimationFrame(() => {
        slideCopy.classList.remove("hidden-clone-next");
        slideCopy.classList.add("next-banner");
      });
  }
    setTimeout(() => {
    isTransitioning = false;
  }, 250);
}


function showPrevSlide() {
      if (isTransitioning) return;
  isTransitioning = true;
  const current = document.querySelector(".active-banner");
  const prev = document.querySelector(".previous-banner");
  const next = document.querySelector(".next-banner");
  if (!current || !prev || !next) return;

  next.classList.remove("next-banner");
  current.classList.remove("active-banner");
  prev.classList.remove("previous-banner");

  next.classList.add("hidden-clone-next");
  current.classList.add("next-banner");
  prev.classList.add("active-banner");

  let newPrev = prev.previousElementSibling;
while (newPrev && !newPrev.classList.contains("updated-banner")) {
  newPrev = newPrev.previousElementSibling;
}

let preloadPrev = newPrev?.previousElementSibling;
while (preloadPrev && !preloadPrev.classList.contains("updated-banner")) {
  preloadPrev = preloadPrev.previousElementSibling;
}

if (!preloadPrev) {
  const currentIndex = +document.querySelector(".active-banner").dataset.index;
  const preloadIndex = (currentIndex - 2 + totalSlides) % totalSlides;
  const preloadOriginal = document.querySelector(`.updated-banner[data-index='${preloadIndex}']`);
  if (preloadOriginal) {
    const preloadClone = preloadOriginal.cloneNode(true);
    preloadClone.classList.remove("active-banner", "next-banner", "previous-banner", "hidden-clone-next");
    preloadClone.classList.add("updated-banner", "hidden-clone-prev");
    slidesContainer.insertBefore(preloadClone, slidesContainer.firstChild);
    const banners = slidesContainer.querySelectorAll(".updated-banner");
    const lastSlide = banners[banners.length - 1];
    if (lastSlide) slidesContainer.removeChild(lastSlide);
  }
}

  if (newPrev) {
    newPrev.classList.remove("hidden-clone-prev");
    newPrev.classList.add("previous-banner");
  } else {
    const activeIndex = document.querySelector(".active-banner").dataset.index;
    const nextIndex = (+activeIndex + totalSlides -1) % totalSlides
      let lastOriginal = document.querySelector(`.updated-banner[data-index='${nextIndex}']`);
      const slideCopy = lastOriginal.cloneNode(true);
      slideCopy.classList.remove("active-banner", "previous-banner", "next-banner","hidden-clone-next","hidden-clone-prev");
      slideCopy.classList.add("updated-banner", "hidden-clone-prev");
      slidesContainer.insertBefore(slideCopy, slidesContainer.firstChild);
      const banners = slidesContainer.querySelectorAll(".updated-banner");
      const lastSlide = banners[banners.length - 1];
      if (lastSlide) slidesContainer.removeChild(lastSlide);
      requestAnimationFrame(() => {
        slideCopy.classList.remove("hidden-clone-prev");
        slideCopy.classList.add("previous-banner");
      });
  }
    setTimeout(() => {
    isTransitioning = false;
  }, 250);
}


    let previousSlide = activeSlide.previousElementSibling;
    let nextSlide = activeSlide.nextElementSibling;
    
    previousSlide.classList.add("previous-banner")
    nextSlide.classList.add("next-banner")
    document.querySelectorAll(".updated-banner").forEach((el,i)=>{
      const activeI = document.querySelector(".active-banner").dataset.index;
      if(i < +activeI && !el.classList.contains("previous-banner")){
        el.classList.add("hidden-clone-prev")
      }
      if(i > +activeI && !el.classList.contains("next-banner")){
        el.classList.add("hidden-clone-next")
      }
    })
   function startProgress() {
  resetProgressBars();

  const currentIndex = getActiveSlideIndex();
  const currentBar = progressBars[currentIndex];

  currentBar.style.transition = `width ${autoScrollTime}ms linear`;
  currentBar.style.width = "100%";

  progressTimeout = setTimeout(() => {
    showNextSlide();
    startProgress();
  }, autoScrollTime);
}

function resetProgressBars() {
  progressBars.forEach(bar => {
    bar.style.transition = "none";
    bar.style.width = "0%";
  });
  clearTimeout(progressTimeout);
}

document.getElementById("nextSlide").addEventListener("click", (event) => {

  resetProgressBars();
  showNextSlide();
  startProgress();
});

document.getElementById("prevSlide").addEventListener("click", (event) => {
  resetProgressBars();
  showPrevSlide();
  startProgress();
});
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipeGesture();
}

function handleSwipeGesture() {
  const swipeThreshold = 80;

  if (touchEndX < touchStartX - swipeThreshold) {
  resetProgressBars();
  showNextSlide();
  startProgress();
  }

  if (touchEndX > touchStartX + swipeThreshold) {
  resetProgressBars();
  showPrevSlide();
  startProgress();
  }
}
    slidesContainer.addEventListener("touchstart", handleTouchStart, false);
slidesContainer.addEventListener("touchend", handleTouchEnd, false);

progressBarsContainers.forEach(bar => {
  bar.style.height = "4px";
});


    function scrollToBlockAndOpenDropdown(id) {
  const target = document.getElementById(id);
      const text  = target.querySelector(".product-information_block-button");
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const elementY = rect.top + scrollTop;
  const centerOffset = window.innerHeight / 2 - rect.height / 2;

  window.scrollTo({
    top: elementY - centerOffset,
    behavior: 'smooth'
  });

  setTimeout(() => {
    const dropdown = target.querySelector('.product-dropdown_block');
    if (dropdown) {
      dropdown.classList.add('open');
      if(dropdown.classList.contains("open")){
         text.textContent = "{{ 'ts.updated_banner.close' | t }}"
        }else{
         text.textContent = "{{ 'ts.updated_banner.link' | t }}"
        }
    }
  }, 600);
}

document.querySelectorAll('.banner_link').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href').substring(1);
    const block = document.getElementById(id);
    if (block) {
      e.preventDefault();
      scrollToBlockAndOpenDropdown(id);
    }
  });
});
setTimeout(() => {
  addSlideClones("prev");
  addSlideClones("next");
  startProgress();
}, 2000);

  });