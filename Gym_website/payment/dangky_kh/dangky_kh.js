// Biến lưu thông tin gói tập được chọn
let selectedPlan = null; // Lưu loại gói tập (basic/pro/premium)
let selectedPrice = 0; // Lưu giá tiền của gói
let selectedPlanName = ""; // Lưu tên hiển thị của gói

// Hàm chọn gói tập
function selectPlan(planType, price, planName) {
  // Reset tất cả các nút chọn gói về trạng thái ban đầu
  document.querySelectorAll(".select-plan-btn").forEach((btn) => {
    btn.classList.remove("selected"); // Xóa class selected
    btn.innerHTML = '<i class="bx bx-check-circle"></i> Chọn gói này'; // Đổi text nút
    btn.closest(".plan-card").classList.remove("highlight"); // Bỏ highlight thẻ gói
  });

  // Đánh dấu gói được chọn bằng cách:
  event.target.classList.add("selected"); // Thêm class selected cho nút
  event.target.innerHTML = '<i class="bx bx-check-circle"></i> Đã chọn'; // Đổi text nút
  event.target.closest(".plan-card").classList.add("highlight"); // Highlight thẻ gói

  // Cập nhật thông tin gói vào các biến
  selectedPlan = planType;
  selectedPrice = price;
  selectedPlanName = planName;

  // Hiển thị thông tin gói đã chọn
  document.getElementById("selectedPlanInfo").style.display = "flex"; // Hiện khung thông tin
  document.getElementById("selectedPlanName").textContent = planName; // Hiển thị tên gói
  document.getElementById("totalPrice").textContent = `$${price}`; // Hiển thị giá

  // Kiểm tra xem form đã hợp lệ chưa
  checkFormValidity();
}

// Hàm reset chọn gói
function resetPlanSelection() {
  // Reset các biến lưu thông tin
  selectedPlan = null;
  selectedPrice = 0;
  selectedPlanName = "";

  // Reset giao diện các nút chọn gói
  document.querySelectorAll(".select-plan-btn").forEach((btn) => {
    btn.classList.remove("selected");
    btn.innerHTML = '<i class="bx bx-check-circle"></i> Chọn gói này';
    btn.closest(".plan-card").classList.remove("highlight");
  });

  // Ẩn khung thông tin gói và disable nút tiếp tục
  document.getElementById("selectedPlanInfo").style.display = "none";
  document.getElementById("proceedBtn").disabled = true;
}

// Hàm kiểm tra tính hợp lệ của form
function checkFormValidity() {
  // Lấy tất cả các trường bắt buộc
  const requiredFields = document.querySelectorAll("[required]");
  let isValid = selectedPlan !== null; // Phải có gói được chọn

  // Kiểm tra từng trường bắt buộc
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      // Nếu trường trống
      isValid = false;
    }
  });

  // Kiểm tra định dạng email
  const email = document.getElementById("email").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    isValid = false;
  }

  // Kiểm tra số điện thoại (10-15 số)
  const phone = document.getElementById("phone").value;
  if (!/^\d{10,15}$/.test(phone)) {
    isValid = false;
  }

  // Cập nhật trạng thái nút thanh toán (enable/disable)
  document.getElementById("proceedBtn").disabled = !isValid;
}

// Hàm validate từng trường input
function setupFieldValidation(fieldId, errorId, validationFn = null) {
  const field = document.getElementById(fieldId); // Lấy trường input
  const error = document.getElementById(errorId); // Lấy thông báo lỗi

  // Bắt sự kiện khi người dùng nhập liệu
  field.addEventListener("input", () => {
    const value = field.value.trim(); // Lấy giá trị và bỏ khoảng trắng

    if (!value) {
      // Nếu trống
      field.classList.add("error"); // Thêm class error
      error.style.display = "block"; // Hiện thông báo lỗi
    } else if (validationFn && !validationFn(value)) {
      // Nếu có hàm validate và không hợp lệ
      field.classList.add("error");
      error.style.display = "block";
    } else {
      // Hợp lệ
      field.classList.remove("error");
      error.style.display = "none";
    }

    // Kiểm tra lại toàn bộ form
    checkFormValidity();
  });
}

// Thiết lập validation cho các trường cụ thể
setupFieldValidation("firstName", "firstNameError"); // Họ (bắt buộc)
setupFieldValidation("lastName", "lastNameError"); // Tên (bắt buộc)
setupFieldValidation(
  "email",
  "emailError",
  (
    value // Email (đúng định dạng)
  ) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
);
setupFieldValidation(
  "phone",
  "phoneError",
  (
    value // SĐT (10-15 số)
  ) => /^\d{10,15}$/.test(value)
);
setupFieldValidation("age", "ageError", (value) => value >= 16 && value <= 50); // Tuổi (16-50)
setupFieldValidation("address", "addressError"); // Địa chỉ (bắt buộc)

// Xử lý trường gender riêng vì là select box
document.getElementById("gender").addEventListener("change", () => {
  const field = document.getElementById("gender");
  const error = document.getElementById("genderError");

  if (!field.value) {
    // Nếu chưa chọn
    field.classList.add("error");
    error.style.display = "block";
  } else {
    // Đã chọn
    field.classList.remove("error");
    error.style.display = "none";
  }

  checkFormValidity();
});

// Xử lý khi submit form
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn form gửi theo cách thông thường

    // Kiểm tra lần cuối trước khi submit
    checkFormValidity();
    if (document.getElementById("proceedBtn").disabled) {
      return; // Nếu không hợp lệ thì dừng
    }

    // Lưu thông tin vào sessionStorage để dùng ở trang thanh toán
    const registrationData = {
      plan: selectedPlan,
      planName: selectedPlanName,
      price: selectedPrice,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      address: document.getElementById("address").value,
      experience: document.getElementById("experience").value,
      goal: document.getElementById("goal").value,
    };

    sessionStorage.setItem(
      "registrationData",
      JSON.stringify(registrationData)
    );

    // Chuyển đến trang thanh toán
    window.location.href = "../thanhtoan/thanhtoan.html";
  });
