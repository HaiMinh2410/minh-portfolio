import '../css/style.css';
import './1fe6c3bf61bf01e6';
import './3e8ad2a3dd94f51d'
// Slider initialization
document.addEventListener("DOMContentLoaded", function () {
  $(".slider-component").each(function (index) {
    const swiper = new Swiper($(this).find(".swiper")[0], {
      speed: 750,
      loop: true,
      autoHeight: false,
      centeredSlides: false,
      followFinger: true,
      slidesPerView: "auto",
      /*  autoplay: {
delay: 1500,
disableOnInteraction: false
},
*/
      disableOnInteraction: false,
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        // mobile landscape
        480: {
          slidesPerView: "auto",
        },
        // tablet
        768: {
          slidesPerView: "auto",
        },
        // desktop
        992: {
          slidesPerView: "auto",
        },
      },
      pagination: {
        el: $(this).find(".swiper-bullet-wrapper")[0],
        bulletActiveClass: "is-active",
        bulletClass: "swiper-bullet",
        bulletElement: "button",
        clickable: true,
      },
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled",
      },
      scrollbar: {
        el: $(this).find(".swiper-drag-wrapper")[0],
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true,
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
    });
    //
  });
});

// Line clamp toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const textElements = document.querySelectorAll('.text-style-2lines');
  
  textElements.forEach(element => {
    element.addEventListener('click', function() {
      this.classList.toggle('expanded');
      
      // Add smooth scroll to element if expanded
      if (this.classList.contains('expanded')) {
        this.style.cursor = 'zoom-out';
        // Smooth scroll to show the expanded content
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        this.style.cursor = 'zoom-in';
      }
    });

    // Add keyboard support for accessibility
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });

    // Make element focusable for keyboard navigation
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', 'Click to expand/collapse text');
  });
});