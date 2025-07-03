// Biến lưu thông tin gói tập được chọn
let selectedPlan = null;
let selectedPrice = 0;
let selectedPlanName = "";

// Hàm chọn gói tập
function selectPlan(planType, price, planName) {
  // Reset tất cả các nút chọn gói
  document.querySelectorAll(".select-plan-btn").forEach((btn) => {
    btn.classList.remove("selected");
    btn.innerHTML = '<i class="bx bx-check-circle"></i> Chọn Gói Này';
  });

  // Đánh dấu gói được chọn
  event.target.classList.add("selected");
  event.target.innerHTML = '<i class="bx bx-check-circle"></i> Đã Chọn';

  // Cập nhật thông tin gói
  selectedPlan = planType;
  selectedPrice = price;
  selectedPlanName = planName;

  // Hiển thị thông tin gói đã chọn
  document.getElementById("selectedPlanInfo").style.display = "block";
  document.getElementById("selectedPlanName").textContent = planName;
  document.getElementById("totalPrice").textContent = `$${price}`;

  // Kiểm tra trạng thái form
  checkFormValidity();
}

// Hàm kiểm tra tính hợp lệ của form
function checkFormValidity() {
  const requiredFields = document.querySelectorAll("[required]");
  let isValid = selectedPlan !== null;

  // Kiểm tra các trường bắt buộc
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
    }
  });

  // Kiểm tra định dạng email
  const email = document.getElementById("email").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    isValid = false;
  }

  // Kiểm tra số điện thoại (ít nhất 10 số)
  const phone = document.getElementById("phone").value;
  if (!/^\d{10,15}$/.test(phone)) {
    isValid = false;
  }

  // Cập nhật trạng thái nút thanh toán
  document.getElementById("proceedBtn").disabled = !isValid;
}

// Hàm validate từng trường input
function setupFieldValidation(fieldId, errorId, validationFn = null) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  field.addEventListener("input", () => {
    const value = field.value.trim();

    if (!value) {
      field.classList.add("error");
      error.style.display = "block";
    } else if (validationFn && !validationFn(value)) {
      field.classList.add("error");
      error.style.display = "block";
    } else {
      field.classList.remove("error");
      error.style.display = "none";
    }

    checkFormValidity();
  });
}

// Thiết lập validation cho các trường
setupFieldValidation("firstName", "firstNameError");
setupFieldValidation("lastName", "lastNameError");
setupFieldValidation("email", "emailError", (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
);
setupFieldValidation("phone", "phoneError", (value) =>
  /^\d{10,15}$/.test(value)
);
setupFieldValidation("age", "ageError", (value) => value >= 16 && value <= 50);
setupFieldValidation("address", "addressError");

// Xử lý trường gender riêng vì là select
document.getElementById("gender").addEventListener("change", () => {
  const field = document.getElementById("gender");
  const error = document.getElementById("genderError");

  if (!field.value) {
    field.classList.add("error");
    error.style.display = "block";
  } else {
    field.classList.remove("error");
    error.style.display = "none";
  }

  checkFormValidity();
});

// Xử lý submit form
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Kiểm tra lần cuối trước khi submit
    checkFormValidity();
    if (document.getElementById("proceedBtn").disabled) {
      return;
    }

    // Lưu thông tin vào sessionStorage
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
