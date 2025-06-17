let selectedPlan = null;
let selectedPrice = 0;
let selectedPlanName = "";

// Chọn gói tập
function selectPlan(planType, price, planName) {
  // Reset tất cả buttons
  document.querySelectorAll(".select-plan-btn").forEach((btn) => {
    btn.classList.remove("selected");
    btn.innerHTML = '<i class="bx bx-check-circle"></i> Chọn Gói Này';
  });

  // Highlight button được chọn
  event.target.classList.add("selected");
  event.target.innerHTML = '<i class="bx bx-check-circle"></i> Đã Chọn';

  // Cập nhật thông tin
  selectedPlan = planType;
  selectedPrice = price;
  selectedPlanName = planName;

  // Hiển thị thông tin gói đã chọn
  document.getElementById("selectedPlanInfo").style.display = "block";
  document.getElementById("selectedPlanName").textContent = planName;
  document.getElementById("totalPrice").textContent = `$${price}`;

  // Kiểm tra form
  checkFormValidity();
}

// Kiểm tra tính hợp lệ của form
function checkFormValidity() {
  const form = document.getElementById("registrationForm");
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = selectedPlan !== null;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
    }
  });

  // Kiểm tra email hợp lệ
  const email = document.getElementById("email").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    isValid = false;
  }

  // Kiểm tra số điện thoại hợp lệ (ít nhất 10 số)
  const phone = document.getElementById("phone").value;
  if (!/^\+?[0-9\s]{10,15}$/.test(phone)) {
    isValid = false;
  }

  document.getElementById("proceedBtn").disabled = !isValid;
}

// Validate từng trường khi nhập
function validateField(fieldId, errorId, validationFn = null) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  if (!field.value.trim()) {
    field.classList.add("error");
    error.style.display = "block";
    return false;
  }

  if (validationFn && !validationFn(field.value)) {
    field.classList.add("error");
    error.style.display = "block";
    return false;
  }

  field.classList.remove("error");
  error.style.display = "none";
  return true;
}

// Xử lý sự kiện input
document.getElementById("firstName").addEventListener("input", () => {
  validateField("firstName", "firstNameError");
  checkFormValidity();
});

document.getElementById("lastName").addEventListener("input", () => {
  validateField("lastName", "lastNameError");
  checkFormValidity();
});

document.getElementById("email").addEventListener("input", () => {
  validateField("email", "emailError", (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
  checkFormValidity();
});

document.getElementById("phone").addEventListener("input", () => {
  validateField("phone", "phoneError", (value) =>
    /^\+?[0-9\s]{10,15}$/.test(value)
  );
  checkFormValidity();
});

document.getElementById("age").addEventListener("input", () => {
  validateField("age", "ageError", (value) => value >= 16 && value <= 50);
  checkFormValidity();
});

document.getElementById("gender").addEventListener("change", () => {
  validateField("gender", "genderError");
  checkFormValidity();
});

document.getElementById("address").addEventListener("input", () => {
  validateField("address", "addressError");
  checkFormValidity();
});

// Xử lý submit form
document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate tất cả các trường
    const isFirstNameValid = validateField("firstName", "firstNameError");
    const isLastNameValid = validateField("lastName", "lastNameError");
    const isEmailValid = validateField("email", "emailError", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    );
    const isPhoneValid = validateField("phone", "phoneError", (value) =>
      /^\+?[0-9\s]{10,15}$/.test(value)
    );
    const isAgeValid = validateField(
      "age",
      "ageError",
      (value) => value >= 16 && value <= 50
    );
    const isGenderValid = validateField("gender", "genderError");
    const isAddressValid = validateField("address", "addressError");

    const isFormValid =
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isAgeValid &&
      isGenderValid &&
      isAddressValid;

    if (!isFormValid) {
      return;
    }

    if (!selectedPlan) {
      alert("Vui lòng chọn gói tập trước khi thanh toán");
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
    window.location.href = "../payment/thanhtoan.html";
  });
