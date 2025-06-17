document.addEventListener("DOMContentLoaded", function () {
  loadRegistrationData();
  setupPaymentMethods();
  setupCardFormatting();
  setupPaymentProcessing();
});

function loadRegistrationData() {
  const data = JSON.parse(sessionStorage.getItem("registrationData") || "{}");

  if (data.planName) {
    document.getElementById("planName").textContent = `Gói ${data.planName}`;
    document.getElementById("planPrice").textContent = `$${data.price}`;
    document.getElementById("subtotal").textContent = `$${data.price}`;

    const tax = Math.round(data.price * 0.1);
    const total = data.price + tax + 2;

    document.getElementById("tax").textContent = `$${tax}`;
    document.getElementById("finalTotal").textContent = `$${total}`;
  }

  if (data.firstName && data.lastName) {
    document.getElementById(
      "customerName"
    ).textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById("customerEmail").textContent = data.email || "-";
    document.getElementById("customerPhone").textContent = data.phone || "-";
  }
}

function setupPaymentMethods() {
  const methods = document.querySelectorAll(".payment-method");
  const cardForm = document.getElementById("cardForm");
  const qrPayment = document.getElementById("qrPayment");

  methods.forEach((method) => {
    method.addEventListener("click", () => {
      methods.forEach((m) => m.classList.remove("active"));
      method.classList.add("active");

      // Ẩn tất cả các form thanh toán
      cardForm.style.display = "none";
      qrPayment.style.display = "none";

      const methodType = method.getAttribute("data-method");
      if (methodType === "card") {
        cardForm.style.display = "block";
      }
    });
  });
}

function setupCardFormatting() {
  const cardNumber = document.getElementById("cardNumber");
  const expiryDate = document.getElementById("expiryDate");

  cardNumber.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    if (formattedValue.length > 19)
      formattedValue = formattedValue.substr(0, 19);
    this.value = formattedValue;
  });

  expiryDate.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    this.value = value;
  });

  document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

function setupPaymentProcessing() {
  document
    .getElementById("processBtn")
    .addEventListener("click", processPayment);
}

function processPayment() {
  const btn = document.getElementById("processBtn");
  const loadingIcon = document.getElementById("loadingIcon");
  const btnText = btn.querySelector(".btn-text");
  const activeMethod = document
    .querySelector(".payment-method.active")
    .getAttribute("data-method");
  const qrPayment = document.getElementById("qrPayment");

  // Validate form nếu là thẻ
  if (activeMethod === "card" && !validatePaymentForm()) {
    return;
  }

  // Start loading
  btn.disabled = true;
  loadingIcon.classList.add("active");
  btnText.textContent = "Đang Xử Lý...";

  if (activeMethod === "bank") {
    // Hiển thị mã QR sau 1 giây (giả lập xử lý)
    setTimeout(() => {
      qrPayment.style.display = "block";
      btnText.textContent = "Vui Lòng Quét Mã QR";
      loadingIcon.classList.remove("active");

      // Giả lập thanh toán thành công sau 5 giây
      setTimeout(() => {
        showSuccessModal();
      }, 7000);
    }, 1000);
  } else {
    // Các phương thức khác
    setTimeout(() => {
      showSuccessModal();
    }, 5000);
  }
}

function validatePaymentForm() {
  const activeMethod = document
    .querySelector(".payment-method.active")
    .getAttribute("data-method");

  if (activeMethod === "card") {
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;
    const cardName = document.getElementById("cardName").value;

    if (!cardNumber || cardNumber.length < 19) {
      alert("Vui lòng nhập đúng số thẻ");
      return false;
    }

    if (!expiryDate || expiryDate.length < 5) {
      alert("Vui lòng nhập ngày hết hạn");
      return false;
    }

    if (!cvv || cvv.length < 3) {
      alert("Vui lòng nhập CVV");
      return false;
    }

    if (!cardName.trim()) {
      alert("Vui lòng nhập tên trên thẻ");
      return false;
    }
  }

  return true;
}

function showSuccessModal() {
  const btn = document.getElementById("processBtn");
  const loadingIcon = document.getElementById("loadingIcon");
  const btnText = btn.querySelector(".btn-text");

  // Reset button
  btn.disabled = false;
  loadingIcon.classList.remove("active");
  btnText.textContent = "Xử Lý Thanh Toán";

  // Show success modal
  document.getElementById("successModal").classList.add("active");

  // Clear stored data
  sessionStorage.removeItem("registrationData");
}

function goBack() {
  window.history.back();
}

function goHome() {
  window.location.href = "../code/mt_fitness.html";
}

// Close modal when clicking outside
document.getElementById("successModal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.remove("active");
    goHome();
  }
});
