// Sự kiện khi DOM đã tải xong, khởi chạy các hàm cần thiết
document.addEventListener("DOMContentLoaded", function () {
  loadRegistrationData(); // Tải dữ liệu đăng ký từ sessionStorage
  setupPaymentMethods(); // Thiết lập sự kiện cho phương thức thanh toán
  setupCardFormatting(); // Định dạng input thẻ tín dụng
  setupPaymentProcessing(); // Thiết lập sự kiện xử lý thanh toán
});

// Hàm tải và hiển thị dữ liệu đăng ký từ sessionStorage
function loadRegistrationData() {
  // Lấy dữ liệu từ sessionStorage hoặc trả về object rỗng nếu không có
  const data = JSON.parse(sessionStorage.getItem("registrationData") || "{}");

  // Nếu có tên gói, hiển thị thông tin đơn hàng
  if (data.planName) {
    document.getElementById("planName").textContent = `Gói ${data.planName}`;
    document.getElementById("planPrice").textContent = `$${data.price}`;
    document.getElementById("subtotal").textContent = `$${data.price}`;

    // Tính thuế (10%) và tổng cộng (giá + thuế + phí xử lý $2)
    const tax = Math.round(data.price * 0.1);
    const total = data.price + tax + 2;

    // Hiển thị thuế và tổng cộng
    document.getElementById("tax").textContent = `$${tax}`;
    document.getElementById("finalTotal").textContent = `$${total}`;
  }

  // Nếu có thông tin khách hàng, hiển thị tên, email, điện thoại
  if (data.firstName && data.lastName) {
    document.getElementById(
      "customerName"
    ).textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById("customerEmail").textContent = data.email || "-"; // Mặc định "-" nếu không có email
    document.getElementById("customerPhone").textContent = data.phone || "-"; // Mặc định "-" nếu không có số điện thoại
  }
}

// Hàm thiết lập sự kiện chọn phương thức thanh toán
function setupPaymentMethods() {
  const methods = document.querySelectorAll(".payment-method"); // Tất cả các nút phương thức
  const cardForm = document.getElementById("cardForm"); // Form thẻ tín dụng
  const qrPayment = document.getElementById("qrPayment"); // Form QR code

  methods.forEach((method) => {
    method.addEventListener("click", () => {
      // Xóa class active của tất cả phương thức
      methods.forEach((m) => m.classList.remove("active"));
      // Thêm class active cho phương thức được chọn
      method.classList.add("active");

      // Ẩn tất cả các form thanh toán
      cardForm.style.display = "none";
      qrPayment.style.display = "none";

      // Hiển thị form tương ứng với phương thức được chọn
      const methodType = method.getAttribute("data-method");
      if (methodType === "card") {
        cardForm.style.display = "block"; // Hiển thị form thẻ
      } else if (methodType === "bank") {
        // (Form QR sẽ được hiển thị trong hàm processPayment)
      }
    });
  });
}

// Hàm định dạng input thẻ tín dụng (số thẻ, ngày hết hạn, CVV)
function setupCardFormatting() {
  const cardNumber = document.getElementById("cardNumber");
  const expiryDate = document.getElementById("expiryDate");

  // Định dạng số thẻ: thêm dấu cách sau mỗi 4 số
  cardNumber.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, ""); // Xóa khoảng trắng và ký tự không phải số
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value; // Chia thành các nhóm 4 số
    if (formattedValue.length > 19)
      formattedValue = formattedValue.substr(0, 19); // Giới hạn 16 số
    this.value = formattedValue;
  });

  // Định dạng ngày hết hạn: thêm dấu "/" sau tháng (MM/YY)
  expiryDate.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4); // Thêm "/"
    }
    this.value = value;
  });

  // Chỉ cho phép nhập số cho CVV
  document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

// Hàm thiết lập sự kiện cho nút "Xử Lý Thanh Toán"
function setupPaymentProcessing() {
  document
    .getElementById("processBtn")
    .addEventListener("click", processPayment);
}

// Hàm xử lý thanh toán khi nhấn nút
function processPayment() {
  const btn = document.getElementById("processBtn");
  const loadingIcon = document.getElementById("loadingIcon");
  const btnText = btn.querySelector(".btn-text");
  const activeMethod = document
    .querySelector(".payment-method.active")
    .getAttribute("data-method");
  const qrPayment = document.getElementById("qrPayment");

  // Kiểm tra hợp lệ form nếu là thẻ tín dụng
  if (activeMethod === "card" && !validatePaymentForm()) {
    return; // Dừng nếu form không hợp lệ
  }

  // Hiển thị trạng thái loading
  btn.disabled = true;
  loadingIcon.classList.add("active");
  btnText.textContent = "Đang Xử Lý...";

  // Xử lý riêng cho phương thức chuyển khoản (hiển thị QR)
  if (activeMethod === "bank") {
    setTimeout(() => {
      qrPayment.style.display = "block"; // Hiển thị mã QR sau 1 giây
      btnText.textContent = "Vui Lòng Quét Mã QR";
      loadingIcon.classList.remove("active");

      // Giả lập thanh toán thành công sau 7 giây
      setTimeout(() => {
        showSuccessModal();
      }, 7000);
    }, 1000);
  } else {
    // Các phương thức khác: giả lập thành công sau 5 giây
    setTimeout(() => {
      showSuccessModal();
    }, 5000);
  }
}

// Hàm kiểm tra tính hợp lệ của form thanh toán thẻ
function validatePaymentForm() {
  const activeMethod = document
    .querySelector(".payment-method.active")
    .getAttribute("data-method");

  if (activeMethod === "card") {
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;
    const cardName = document.getElementById("cardName").value;

    // Kiểm tra số thẻ (đủ 16 số)
    if (!cardNumber || cardNumber.length < 19) {
      alert("Vui lòng nhập đúng số thẻ");
      return false;
    }

    // Kiểm tra ngày hết hạn (đủ MM/YY)
    if (!expiryDate || expiryDate.length < 5) {
      alert("Vui lòng nhập ngày hết hạn");
      return false;
    }

    // Kiểm tra CVV (ít nhất 3 số)
    if (!cvv || cvv.length < 3) {
      alert("Vui lòng nhập CVV");
      return false;
    }

    // Kiểm tra tên trên thẻ (không để trống)
    if (!cardName.trim()) {
      alert("Vui lòng nhập tên trên thẻ");
      return false;
    }
  }

  return true; // Trả về true nếu tất cả hợp lệ
}

// Hàm hiển thị popup thông báo thành công
function showSuccessModal() {
  const btn = document.getElementById("processBtn");
  const loadingIcon = document.getElementById("loadingIcon");
  const btnText = btn.querySelector(".btn-text");
  const registrationData = JSON.parse(
    sessionStorage.getItem("registrationData") || "{}"
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Cập nhật thông tin khóa học cho user
  currentUser.course = {
    plan: registrationData.plan,
    planName: registrationData.planName,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày sau
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Đặt lại trạng thái nút
  btn.disabled = false;
  loadingIcon.classList.remove("active");
  btnText.textContent = "Xử Lý Thanh Toán";

  // Hiển thị modal
  document.getElementById("successModal").classList.add("active");

  // Xóa dữ liệu đăng ký khỏi sessionStorage
  sessionStorage.removeItem("registrationData");
}
// Sau khi xử lý thanh toán thành công:
const data = JSON.parse(sessionStorage.getItem("registrationData") || "{}");

const users = JSON.parse(localStorage.getItem("users") || "[]");
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// Tìm user trong danh sách
const updatedUsers = users.map((user) => {
  if (user.username === currentUser.username) {
    return {
      ...user,
      course: {
        planName: data.planName,
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
      },
    };
  }
  return user;
});

// Lưu lại danh sách users mới
localStorage.setItem("users", JSON.stringify(updatedUsers));

// Cập nhật currentUser
currentUser.course = {
  planName: data.planName,
  startDate: new Date().toISOString(),
  endDate: new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  ).toISOString(),
};
localStorage.setItem("currentUser", JSON.stringify(currentUser));

// Hàm quay lại trang trước
function goBack() {
  window.history.back();
}

// Hàm trở về trang chủ
function goHome() {
  window.location.href = "../../code/mt_fitness.html";
}

// Đóng modal khi click bên ngoài nội dung
document.getElementById("successModal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.remove("active");
    goHome(); // Về trang chủ sau khi đóng
  }
});
