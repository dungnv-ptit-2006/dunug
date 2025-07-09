// Khi toàn bộ DOM đã được tải xong, thực thi các hàm bên trong
document.addEventListener("DOMContentLoaded", () => {
  // ==================== PHẦN XỬ LÝ MENU TOGGLE ====================
  // Lấy phần tử menu icon bằng id "menu-icon"
  let menu = document.querySelector("#menu-icon");
  // Lấy phần tử navbar bằng class "navbar"
  let navbar = document.querySelector(".navbar");

  // Khi click vào menu icon
  menu.onclick = () => {
    // Thêm hoặc xóa class 'bx-x' (biểu tượng close) cho menu
    menu.classList.toggle("bx-x");
    // Thêm hoặc xóa class 'active' cho navbar để hiển thị/ẩn menu
    navbar.classList.toggle("active");
  };

  // Khi người dùng cuộn trang
  window.onscroll = () => {
    // Xóa class 'bx-x' khỏi menu (để đóng icon menu)
    menu.classList.remove("bx-x");
    // Xóa class 'active' khỏi navbar (để ẩn menu đi)
    navbar.classList.remove("active");
  };

  // ==================== PHẦN XỬ LÝ ĐĂNG XUẤT ====================
  // Thêm sự kiện click cho nút logout (nếu tồn tại)
  document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
    logoutUser(); // Gọi hàm xử lý đăng xuất
  });

  // ==================== PHẦN XỬ LÝ PROFILE USER ====================
  // Thêm sự kiện click cho nút xem profile (nếu tồn tại)
  document
    .getElementById("viewProfile")
    ?.addEventListener("click", function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định
      showUserProfile(); // Gọi hàm hiển thị thông tin user
    });

  // Hàm hiển thị modal thông tin user
  function showUserProfile() {
    // Lấy thông tin user từ localStorage, nếu không có thì trả về object rỗng
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // Tạo nội dung HTML cho modal
    const modalContent = `
    <div class="user-info-modal">
      <div class="user-info-content">
        <div class="user-info-header">
          <h3><i class="bx bx-user"></i> Thông tin cá nhân</h3>
          <span class="close-user-info">&times;</span>
        </div>
        <div class="user-info-body">
          <div class="user-avatar-large">
            ${
              // Hiển thị chữ cái đầu của username (viết hoa), nếu không có hiển thị "U"
              currentUser.username
                ? currentUser.username.charAt(0).toUpperCase()
                : "U"
            }
          </div>
          <div class="user-details">
            <div class="user-detail-item">
              <span class="user-detail-label">Họ tên:</span>
              <span class="user-detail-value">${
                currentUser.username || "Chưa cập nhật"
              }</span>
            </div>
            <div class="user-detail-item">
              <span class="user-detail-label">Email:</span>
              <span class="user-detail-value">${
                currentUser.email || "Chưa cập nhật"
              }</span>
            </div>
            <div class="user-detail-item">
              <span class="user-detail-label">Số điện thoại:</span>
              <span class="user-detail-value">${
                currentUser.phone || "Chưa cập nhật"
              }</span>
            </div>
            ${
              // Nếu có thông tin khóa học thì hiển thị
              currentUser.course
                ? `
            <div class="user-detail-item">
              <span class="user-detail-label">Gói tập:</span>
              <span class="user-detail-value">${
                currentUser.course.planName || "Chưa đăng ký"
              }</span>
            </div>
            <div class="user-detail-item">
              <span class="user-detail-label">Ngày hết hạn:</span>
              <span class="user-detail-value">${
                currentUser.course.endDate
                  ? new Date(currentUser.course.endDate).toLocaleDateString()
                  : "N/A"
              }</span>
            </div>
            `
                : "" // Nếu không có thì không hiển thị
            }
          </div>
          <div class="user-actions">
            <button class="edit-profile-btn">
              <i class="bx bx-edit"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    // Tạo modal và thêm vào body
    const modal = document.createElement("div");
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Xử lý sự kiện đóng modal khi click nút đóng
    modal.querySelector(".close-user-info").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Xử lý sự kiện đóng modal khi click bên ngoài
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Xử lý sự kiện khi click nút chỉnh sửa profile
    modal.querySelector(".edit-profile-btn")?.addEventListener("click", () => {
      alert("Tính năng chỉnh sửa hồ sơ sẽ được cập nhật sau!");
    });
  }

  // ==================== PHẦN XỬ LÝ KHÓA HỌC VÀ LỊCH TẬP ====================
  // Thêm sự kiện click cho nút xem lịch đã đăng ký
  document
    .getElementById("viewRegistered")
    ?.addEventListener("click", function (e) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định
      showUserSchedule(); // Gọi hàm hiển thị lịch tập
    });

  // Hàm hiển thị thông tin khóa học và lịch tập
  function showUserSchedule() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const bookings = JSON.parse(localStorage.getItem("classBookings") || "[]");

    // Kiểm tra nếu chưa đăng ký khóa học
    if (!currentUser || !currentUser.course) {
      showRegistrationAlert(
        "Bạn chưa đăng ký khóa học nào",
        "../payment/dangky_kh/dangky_kh.html"
      );
      return;
    }

    // Tạo nội dung modal
    const modalContent = `
    <div class="schedule-modal">
      <div class="modal-header">
        <h3><i class="bx bx-calendar"></i> Khóa Học & Lịch Tập</h3>
        <span class="close-modal">&times;</span>
      </div>
      <div class="modal-body">
        <div class="course-info">
          <h4>Thông Tin Khóa Học</h4>
          <p><strong>Gói tập:</strong> ${currentUser.course.planName}</p>
          <p><strong>Ngày bắt đầu:</strong> ${new Date(
            currentUser.course.startDate
          ).toLocaleDateString()}</p>
          <p><strong>Ngày kết thúc:</strong> ${new Date(
            currentUser.course.endDate
          ).toLocaleDateString()}</p>
          <p><strong>Trạng thái:</strong> ${
            new Date(currentUser.course.endDate) > new Date()
              ? "Đang hoạt động"
              : "Đã hết hạn"
          }</p>
        </div>
        
        <div class="booked-classes">
          <h4>Lịch Đã Đặt (${bookings.length})</h4>
          <ul class="booking-list">
            ${
              bookings.length > 0
                ? bookings
                    .map(
                      (booking, index) => `
                      <li>
                        <div class="booking-day">${getDayName(
                          booking.day
                        )}</div>
                        <div class="booking-time">${booking.time}</div>
                        <div class="booking-class">${booking.name}</div>
                        <div class="booking-trainer">${booking.trainer}</div>
                    
                      </li>
                    `
                    )
                    .join("")
                : `<p class="no-booking">Bạn chưa đặt lịch tập nào.</p>`
            }
          </ul>
        </div>
      </div>
    </div>
  `;

    // Tạo và hiển thị modal
    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Xử lý đóng modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Xử lý hủy lịch từ modal
    modal.querySelectorAll(".cancel-booking-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        cancelBooking(index);
        document.body.removeChild(modal); // Đóng modal
        showUserSchedule(); // Mở lại modal để cập nhật
      });
    });
  }

  // Hàm chuyển day code (mon, tue,...) thành tên thứ
  function getDayName(dayCode) {
    const days = {
      mon: "Thứ 2",
      tue: "Thứ 3",
      wed: "Thứ 4",
      thu: "Thứ 5",
      fri: "Thứ 6",
      sat: "Thứ 7",
      sun: "Chủ Nhật",
    };
    return days[dayCode] || dayCode;
  }

  // ==================== PHẦN CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP ====================
  // Hàm cập nhật trạng thái nút đăng nhập/đăng xuất
  function updateLoginButton() {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    // Lấy các phần tử cần thiết
    const loginButton = document.getElementById("loginLogoutBtn");
    const userGreeting = document.getElementById("userGreeting");
    const usernameInitial = document.getElementById("usernameInitial");

    // Nếu các phần tử tồn tại
    if (loginButton && userGreeting && usernameInitial) {
      if (isLoggedIn) {
        // Nếu đã đăng nhập
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        if (currentUser.username) {
          // Hiển thị chữ cái đầu của username
          const initial = currentUser.username.charAt(0).toUpperCase();
          usernameInitial.textContent = initial;
          userGreeting.style.display = "flex"; // Hiển thị phần chào user
        }
        loginButton.style.display = "none"; // Ẩn nút đăng nhập
      } else {
        // Nếu chưa đăng nhập
        userGreeting.style.display = "none"; // Ẩn phần chào user
        loginButton.textContent = "Đăng Nhập";
        loginButton.href = "../dang_nhap/login/login.html";
        loginButton.onclick = null;
      }
    }
  }

  // ==================== PHẦN XỬ LÝ ĐĂNG XUẤT ====================
  // Hàm đăng xuất user
  function logoutUser() {
    localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
    // localStorage.removeItem("currentUser"); // Xóa thông tin user

    window.location.href = "../dang_nhap/login/login.html"; // Chuyển về trang login
  }

  // ==================== PHẦN KHỞI TẠO ====================
  // Khởi tạo nút đăng nhập và hiệu ứng typed text
  updateLoginButton();
  // Theo dõi sự thay đổi trong localStorage để cập nhật UI
  window.addEventListener("storage", updateLoginButton);

  // Hiệu ứng typing text
  const typed = new Typed(".multiple-text", {
    strings: [
      "Physical Fitness",
      "Weight Lifting",
      "Strength Training",
      "Fat Loss",
      "Boxing",
      "Running",
    ],
    typeSpeed: 50, // Tốc độ gõ
    backSpeed: 60, // Tốc độ xóa
    backDelay: 1000, // Thời gian chờ trước khi xóa
    loop: true, // Lặp lại
  });

  // ==================== PHẦN BLOG CAROUSEL ====================
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

    // Thêm các item cloned vào slider
    slider.insertBefore(lastItem, items[0]);
    slider.insertBefore(secondLastItem, items[0]);
    slider.insertBefore(thirdLastItem, items[0]);
    slider.appendChild(firstItem);
    slider.appendChild(secondItem);
    slider.appendChild(thirdItem);

    const allItems = document.querySelectorAll(".blog-item");
    let currentIndex = 3; // Bắt đầu từ item gốc đầu tiên
    const itemsPerPage = 4; // Số item hiển thị mỗi trang
    const totalOriginalItems = items.length;
    const totalDots = 6; // Tổng số dots
    let autoSlideInterval;
    const autoSlideDelay = 3000; // Thời gian tự động chuyển slide (3s)

    // Tạo các dots điều hướng
    function createDots() {
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active"); // Dot đầu tiên active
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

      // Cập nhật dot active
      const activeDot =
        Math.floor(
          (currentIndex - 3) / Math.ceil(totalOriginalItems / totalDots)
        ) % totalDots;
      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === activeDot);
      });

      // Xử lý hiệu ứng vô tận khi đến đầu/cuối slider
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

    // Tự động chuyển slide
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

    // Khởi tạo slider
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

      // Điều chỉnh số item hiển thị theo kích thước màn hình
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

  // ==================== PHẦN NÚT CUỘN LÊN ĐẦU TRANG ====================
  window.addEventListener("scroll", function () {
    const arrow = document.querySelector(".fixed-arrow");
    // Hiển thị nút khi scroll xuống quá 300px
    arrow.classList.toggle("show", window.pageYOffset > 300);
  });

  // Sự kiện click nút cuộn lên đầu trang
  document.querySelector(".fixed-arrow").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn mượt lên đầu
  });
});

// ==================== PHẦN LỊCH HỌC ====================
// Khi DOM tải xong
document.addEventListener("DOMContentLoaded", function () {
  // Lấy tất cả các tab ngày
  const dayTabs = document.querySelectorAll(".day-tab");
  // Lấy tất cả các lịch ngày
  const daySchedules = document.querySelectorAll(".day-schedule");

  // Active tab đầu tiên nếu có
  if (dayTabs.length > 0) {
    dayTabs[0].classList.add("active");
    daySchedules[0].classList.add("active");
  }

  // Xử lý click tab ngày
  dayTabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
      // Xóa active tất cả tab và schedule
      dayTabs.forEach((t) => t.classList.remove("active"));
      daySchedules.forEach((s) => s.classList.remove("active"));

      // Thêm active cho tab và schedule được click
      this.classList.add("active");
      daySchedules[index].classList.add("active");
      filterClasses();
    });
  });

  // Dữ liệu các tuần
  const weekData = [
    {
      range: "Tuần 10/6 - 16/6",
      dates: "10 - 16 Tháng 6, 2024",
    },
    {
      range: "Tuần 17/6 - 23/6",
      dates: "17 - 23 Tháng 6, 2024",
    },
    {
      range: "Tuần 24/6 - 30/6",
      dates: "24 - 30 Tháng 6, 2024",
    },
  ];

  let currentWeek = 0;
  const weekRange = document.querySelector(".week-range");
  const weekDates = document.querySelector(".week-dates");
  const prevWeekBtn = document.querySelector(".prev-week");
  const nextWeekBtn = document.querySelector(".next-week");

  // Cập nhật hiển thị tuần
  function updateWeekDisplay() {
    weekRange.textContent = weekData[currentWeek].range;
    weekDates.textContent = weekData[currentWeek].dates;
  }

  // Xử lý nút tuần trước/sau
  if (prevWeekBtn && nextWeekBtn) {
    prevWeekBtn.addEventListener("click", () => {
      currentWeek = Math.max(0, currentWeek - 1); // Giảm tuần nhưng không nhỏ hơn 0
      updateWeekDisplay();
    });

    nextWeekBtn.addEventListener("click", () => {
      currentWeek = Math.min(weekData.length - 1, currentWeek + 1); // Tăng tuần nhưng không vượt quá số tuần
      updateWeekDisplay();
    });

    updateWeekDisplay();
  }
});

// ==================== PHẦN XỬ LÝ ĐẶT LỊCH ====================
// Thêm sự kiện cho tất cả các nút đặt lịch
document.querySelectorAll(".register-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    // Lấy thông tin user
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // Nếu chưa đăng nhập, hiển thị thông báo
    if (!isLoggedIn) {
      showRegistrationAlert(
        "Vui lòng đăng nhập để đặt lịch",
        "../dang_nhap/login/login.html"
      );
      return;
    }

    // Nếu chưa đăng ký khóa học, hiển thị thông báo
    if (!currentUser || !currentUser.course) {
      showRegistrationAlert(
        "Vui lòng đăng ký khóa học để đặt lịch",
        "../payment/dangky_kh/dangky_kh.html"
      );
      return;
    }

    // Lấy thông tin lớp học
    const classItem = this.closest(".class-item");
    const classInfo = {
      day: classItem.closest(".day-schedule").dataset.day,
      time: classItem.querySelector(".class-time").textContent.trim(),
      name: classItem.querySelector(".class-name").textContent.trim(),
      trainer: classItem.querySelector(".class-trainer").textContent.trim(),
    };

    // Lấy danh sách đặt lịch từ localStorage
    let bookings = JSON.parse(localStorage.getItem("classBookings") || "[]");

    // Nếu đã đặt lịch, hủy lịch
    if (this.dataset.bookingId) {
      bookings.splice(this.dataset.bookingId, 1);
      localStorage.setItem("classBookings", JSON.stringify(bookings));

      // Cập nhật UI
      this.textContent = "Đặt lịch";
      this.style.backgroundColor = "#5dade2";
      delete this.dataset.bookingId;

      // Hiển thị thông báo
      showAlert("Đã hủy lịch tập thành công!", "success");
    } else {
      // Nếu chưa đặt, thêm vào danh sách
      bookings.push(classInfo);
      localStorage.setItem("classBookings", JSON.stringify(bookings));

      // Cập nhật UI
      this.textContent = "Hủy lịch";
      this.style.backgroundColor = "#dc3545";
      this.dataset.bookingId = bookings.length - 1;
    }
  });
});

// ==================== PHẦN HIỂN THỊ THÔNG BÁO ====================
// Hàm hiển thị thông báo đăng ký
function showRegistrationAlert(message, redirectUrl) {
  // Tạo thẻ div chứa thông báo
  const alertDiv = document.createElement("div");
  // Thiết lập style cho thông báo
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "var(--main-color)";
  alertDiv.style.color = "#000";
  alertDiv.style.padding = "15px 25px";
  alertDiv.style.borderRadius = "5px";
  alertDiv.style.zIndex = "10000";
  alertDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  alertDiv.style.display = "flex";
  alertDiv.style.flexDirection = "column";
  alertDiv.style.alignItems = "center";
  alertDiv.style.gap = "10px";

  // Tạo nội dung thông báo
  const messageP = document.createElement("p");
  messageP.textContent = message;
  messageP.style.margin = "0";
  messageP.style.fontWeight = "bold";

  // Tạo nút chuyển hướng
  const redirectBtn = document.createElement("button");
  redirectBtn.textContent = "Chuyển đến trang";
  redirectBtn.style.padding = "5px 15px";
  redirectBtn.style.backgroundColor = "#000";
  redirectBtn.style.color = "var(--main-color)";
  redirectBtn.style.border = "none";
  redirectBtn.style.borderRadius = "3px";
  redirectBtn.style.cursor = "pointer";
  redirectBtn.onclick = function () {
    window.location.href = redirectUrl;
  };

  // Tạo nút đóng
  const closeBtn = document.createElement("span");
  closeBtn.innerHTML = "&times;";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "5px";
  closeBtn.style.right = "10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "20px";
  closeBtn.onclick = function () {
    document.body.removeChild(alertDiv);
  };

  // Thêm các phần tử vào alert
  alertDiv.appendChild(closeBtn);
  alertDiv.appendChild(messageP);
  alertDiv.appendChild(redirectBtn);

  // Thêm alert vào body
  document.body.appendChild(alertDiv);

  // Tự động đóng sau 5 giây
  setTimeout(() => {
    if (document.body.contains(alertDiv)) {
      document.body.removeChild(alertDiv);
    }
  }, 5000);
}

// ==================== PHẦN CẬP NHẬT TRẠNG THÁI ĐẶT LỊCH ====================
// Kiểm tra và cập nhật trạng thái đặt lịch khi tải trang
function updateBookingStatus() {
  // Lấy danh sách đặt lịch từ localStorage
  const bookings = JSON.parse(localStorage.getItem("classBookings") || "[]");

  // Duyệt qua tất cả các lớp học
  document.querySelectorAll(".class-item").forEach((item) => {
    const time = item.querySelector(".class-time").textContent.trim();
    const day = item.closest(".day-schedule").dataset.day;
    const className = item.querySelector(".class-name").textContent.trim();
    const btn = item.querySelector(".register-btn");

    // Tìm kiếm booking trùng khớp
    const bookingIndex = bookings.findIndex(
      (booking) =>
        booking.day === day &&
        booking.time === time &&
        booking.name === className
    );

    // Cập nhật UI theo trạng thái đặt lịch
    if (bookingIndex !== -1) {
      // Nếu đã đặt, hiển thị nút hủy
      btn.textContent = "Hủy lịch";
      btn.style.backgroundColor = "#dc3545";
      btn.dataset.bookingId = bookingIndex;
      btn.disabled = false;
    } else {
      // Nếu chưa đặt, hiển thị nút đặt lịch
      btn.textContent = "Đặt lịch";
      btn.style.backgroundColor = "#5dade2";
      delete btn.dataset.bookingId;
      btn.disabled = false;
    }
    // Kiểm tra trạng thái đăng nhập
    // Nếu chưa đăng nhập, đặt lại nút về trạng thái "Đặt lịch"
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Đặt lại tất cả nút về trạng thái "Đặt lịch"
      document.querySelectorAll(".register-btn").forEach((btn) => {
        btn.textContent = "Đặt lịch";
        btn.style.backgroundColor = "#5dade2";
      });
      return;
    }
  });
}

// Gọi hàm này khi DOM được tải
document.addEventListener("DOMContentLoaded", function () {
  updateBookingStatus();
});
