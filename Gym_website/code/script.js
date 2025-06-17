document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle functionality
  let menu = document.querySelector("#menu-icon");
  let navbar = document.querySelector(".navbar");

  menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };

  window.onscroll = () => {
    menu.classList.remove("bx-x");
    navbar.classList.remove("active");
  };

  // Login/Logout
  function updateLoginButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginButton = document.getElementById("loginLogoutBtn");

    if (loginButton) {
      if (isLoggedIn) {
        loginButton.textContent = "Đăng Xuất";
        loginButton.href = "#";
        loginButton.onclick = function (e) {
          e.preventDefault();
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("currentUser");
          window.location.href = "../dang_nhap/login/login.html";
        };
      } else {
        loginButton.textContent = "Đăng Nhập";
        loginButton.href = "../dang_nhap/login/login.html";
        loginButton.onclick = null;
      }
    }
  }

  // Initialize login button and typed text
  updateLoginButton();
  window.addEventListener("storage", updateLoginButton);

  // Typing Text Effect
  const typed = new Typed(".multiple-text", {
    strings: [
      "Physical Fitness",
      "Weight Lifting",
      "Strength Training",
      "Fat Loss",
      "Boxing",
      "Running",
    ],
    typeSpeed: 50,
    backSpeed: 60,
    backDelay: 1000,
    loop: true,
  });

  // Blog Carousel với hiệu ứng vô tận
  const slider = document.querySelector(".blog-slider");
  if (slider) {
    const items = document.querySelectorAll(".blog-item");
    const dotsContainer = document.querySelector(".carousel-dots");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    // Clone các item đầu và cuối để tạo hiệu ứng vô tận
    const firstItem = items[0].cloneNode(true);
    const secondItem = items[1].cloneNode(true);
    const thirdItem = items[2].cloneNode(true);
    const lastItem = items[items.length - 1].cloneNode(true);
    const secondLastItem = items[items.length - 2].cloneNode(true);
    const thirdLastItem = items[items.length - 3].cloneNode(true);

    slider.insertBefore(lastItem, items[0]);
    slider.insertBefore(secondLastItem, items[0]);
    slider.insertBefore(thirdLastItem, items[0]);
    slider.appendChild(firstItem);
    slider.appendChild(secondItem);
    slider.appendChild(thirdItem);

    const allItems = document.querySelectorAll(".blog-item");
    let currentIndex = 3; // Bắt đầu từ item gốc đầu tiên
    const itemsPerPage = 4;
    const totalOriginalItems = items.length;
    const totalDots = 6; // Tổng số dots mong muốn
    let autoSlideInterval;
    const autoSlideDelay = 3000; // 3 giây tự động chuyển slide

    // Tạo 6 dots
    function createDots() {
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          // Tính toán vị trí tương ứng trong slider
          currentIndex = i * Math.ceil(totalOriginalItems / totalDots) + 3;
          updateSlider();
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Cập nhật slider và dot active
    function updateSlider() {
      const offset = -currentIndex * (100 / itemsPerPage);
      slider.style.transform = `translateX(${offset}%)`;

      // Cập nhật dot active dựa trên vị trí hiện tại
      const activeDot =
        Math.floor(
          (currentIndex - 3) / Math.ceil(totalOriginalItems / totalDots)
        ) % totalDots;
      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === activeDot);
      });

      // Xử lý hiệu ứng vô tận
      if (currentIndex <= 0) {
        setTimeout(() => {
          slider.style.transition = "none";
          currentIndex = allItems.length - 6;
          slider.style.transform = `translateX(${
            -currentIndex * (100 / itemsPerPage)
          }%)`;
          setTimeout(() => {
            slider.style.transition = "transform 0.5s ease";
          }, 50);
        }, 500);
      }

      if (currentIndex >= allItems.length - itemsPerPage) {
        setTimeout(() => {
          slider.style.transition = "none";
          currentIndex = 3;
          slider.style.transform = `translateX(${
            -currentIndex * (100 / itemsPerPage)
          }%)`;
          setTimeout(() => {
            slider.style.transition = "transform 0.5s ease";
          }, 50);
        }, 500);
      }
    }

    // Chuyển đến slide tiếp theo
    function nextSlide() {
      currentIndex++;
      updateSlider();
    }

    // Chuyển đến slide trước đó
    function prevSlide() {
      currentIndex--;
      updateSlider();
    }

    // Bắt đầu tự động chuyển slide
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    // Dừng tự động chuyển slide
    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Reset bộ đếm tự động chuyển slide
    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    // Sự kiện click nút điều hướng
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
      });

      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    // Khởi tạo
    createDots();
    updateSlider();
    startAutoSlide();

    // Dừng tự động chuyển slide khi hover
    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    // Responsive adjustments
    function handleResize() {
      const width = window.innerWidth;
      let newItemsPerPage = 4;

      if (width < 768) {
        newItemsPerPage = 1;
      } else if (width < 992) {
        newItemsPerPage = 2;
      }

      // Điều chỉnh kích thước item
      document.querySelectorAll(".blog-item").forEach((item) => {
        item.style.minWidth = `${100 / newItemsPerPage}%`;
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
  }

  // nút cuộn trang
  window.addEventListener("scroll", function () {
    const arrow = document.querySelector(".fixed-arrow");
    arrow.classList.toggle("show", window.pageYOffset > 300);
  });

  document.querySelector(".fixed-arrow").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
