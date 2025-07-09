// Sự kiện khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", function () {
  loadRegistrationData(); // Tải dữ liệu đăng ký từ sessionStorage
  setupPaymentMethods(); // Thiết lập sự kiện cho các tab phương thức thanh toán
  setupCardFormatting(); // Định dạng input thẻ tín dụng
  setupPaymentProcessing(); // Thiết lập sự kiện cho nút thanh toán
  setupWalletSelection(); // Thiết lập sự kiện chọn ví điện tử

  // Cập nhật ngày bắt đầu
  const today = new Date(); // Lấy ngày hiện tại
  const formattedDate = today.toLocaleDateString("vi-VN", {
    day: "2-digit", // Định dạng ngày 2 chữ số
    month: "2-digit", // Định dạng tháng 2 chữ số
    year: "numeric", // Định dạng năm đầy đủ
  });
  document.getElementById("startDate").textContent = formattedDate; // Hiển thị ngày lên giao diện
});

// Hàm tải dữ liệu đăng ký từ sessionStorage
function loadRegistrationData() {
  // Lấy dữ liệu từ sessionStorage hoặc trả về object rỗng nếu không có
  const data = JSON.parse(sessionStorage.getItem("registrationData") || "{}");

  // Nếu có tên gói, cập nhật thông tin lên giao diện
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

  // Nếu có thông tin khách hàng, hiển thị lên giao diện
  if (data.firstName && data.lastName) {
    document.getElementById(
      "customerName"
    ).textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById("customerEmail").textContent = data.email || "-"; // Hiển thị email hoặc "-" nếu không có
    document.getElementById("customerPhone").textContent = data.phone || "-"; // Hiển thị số điện thoại hoặc "-" nếu không có
  }
}

// Hàm thiết lập sự kiện chọn phương thức thanh toán
function setupPaymentMethods() {
  const tabs = document.querySelectorAll(".method-tab"); // Lấy tất cả các tab phương thức
  const contents = document.querySelectorAll(".method-content"); // Lấy tất cả các nội dung tương ứng

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Xóa active của tất cả các tab và content
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      // Thêm active cho tab được chọn
      tab.classList.add("active");

      // Hiển thị content tương ứng với tab được chọn
      const methodType = tab.getAttribute("data-method");
      document.getElementById(`${methodType}Method`).classList.add("active");

      // Reset trạng thái nút thanh toán về mặc định
      document
        .getElementById("processBtn")
        .querySelector(".btn-text").textContent = "Tiến hành thanh toán";

      // Nếu không phải tab ví điện tử, bỏ chọn tất cả các ví
      if (methodType !== "wallet") {
        document.querySelectorAll(".wallet-option").forEach((option) => {
          option.classList.remove("active");
        });
      }
    });
  });
}

// Hàm thiết lập chọn ví điện tử
function setupWalletSelection() {
  document.querySelectorAll(".wallet-option").forEach((option) => {
    option.addEventListener("click", function () {
      // Chỉ xử lý khi đang ở tab ví điện tử
      const activeTab = document.querySelector(".method-tab.active");
      if (activeTab.getAttribute("data-method") !== "wallet") return;

      // Xóa active của tất cả các ví
      document.querySelectorAll(".wallet-option").forEach((opt) => {
        opt.classList.remove("active");
      });

      // Thêm active cho ví được chọn
      this.classList.add("active");

      // Cập nhật nút thanh toán với tên ví được chọn
      const walletName = this.querySelector("span").textContent;
      document
        .getElementById("processBtn")
        .querySelector(
          ".btn-text"
        ).textContent = `Thanh toán bằng ${walletName}`;
    });
  });
}

// Hàm định dạng input thẻ tín dụng
function setupCardFormatting() {
  const cardNumber = document.getElementById("cardNumber");
  const expiryDate = document.getElementById("expiryDate");

  // Định dạng số thẻ (thêm dấu cách sau mỗi 4 số)
  cardNumber.addEventListener("input", function (e) {
    // Xóa tất cả khoảng trắng và ký tự không phải số
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    // Thêm dấu cách sau mỗi 4 số
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    // Giới hạn độ dài tối đa 19 ký tự (16 số + 3 dấu cách)
    if (formattedValue.length > 19)
      formattedValue = formattedValue.substr(0, 19);
    this.value = formattedValue;
  });

  // Định dạng ngày hết hạn (MM/YY)
  expiryDate.addEventListener("input", function (e) {
    // Xóa tất cả ký tự không phải số
    let value = e.target.value.replace(/\D/g, "");
    // Thêm dấu / sau 2 số đầu (tháng)
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    this.value = value;
  });

  // Chỉ cho phép nhập số cho CVV
  document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
}

// Hàm thiết lập sự kiện cho nút thanh toán
function setupPaymentProcessing() {
  document
    .getElementById("processBtn")
    .addEventListener("click", processPayment);
}

// Hàm xử lý thanh toán
function processPayment() {
  const btn = document.getElementById("processBtn");
  const btnText = btn.querySelector(".btn-text");
  const activeTab = document.querySelector(".method-tab.active");
  const methodType = activeTab.getAttribute("data-method");
  const selectedWallet = document.querySelector(".wallet-option.active");

  // Kiểm tra hợp lệ form nếu là phương thức thẻ tín dụng
  if (methodType === "card" && !validatePaymentForm()) {
    return; // Dừng nếu form không hợp lệ
  }

  // Kiểm tra đã chọn ví điện tử chưa nếu là phương thức ví
  if (methodType === "wallet" && !selectedWallet) {
    alert("Vui lòng chọn ví điện tử");
    return;
  }

  // Hiển thị trạng thái loading
  btn.disabled = true;
  btnText.textContent = "Đang xử lý...";

  // Xử lý riêng cho từng phương thức thanh toán
  switch (methodType) {
    case "bank": // Chuyển khoản ngân hàng
      setTimeout(() => {
        btnText.textContent = "Vui lòng quét mã QR";
        simulateQRPayment(); // Giả lập thanh toán QR
      }, 1000);
      break;

    case "wallet": // Ví điện tử
      const walletName = selectedWallet.querySelector("span").textContent;
      simulateWalletPayment(walletName); // Giả lập thanh toán ví điện tử
      break;

    default: // Thẻ tín dụng
      setTimeout(() => {
        completePayment(); // Hoàn tất thanh toán
      }, 3000);
  }
}

// Hàm kiểm tra tính hợp lệ của form thanh toán thẻ
function validatePaymentForm() {
  const cardNumber = document.getElementById("cardNumber").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const cvv = document.getElementById("cvv").value;
  const cardName = document.getElementById("cardName").value;

  // Kiểm tra số thẻ (đủ 16 số sau khi xóa khoảng trắng)
  if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
    alert("Vui lòng nhập đúng số thẻ (16 số)");
    return false;
  }

  // Kiểm tra ngày hết hạn (đủ 5 ký tự MM/YY)
  if (!expiryDate || expiryDate.length < 5) {
    alert("Vui lòng nhập ngày hết hạn (MM/YY)");
    return false;
  }

  // Kiểm tra CVV (ít nhất 3 số)
  if (!cvv || cvv.length < 3) {
    alert("Vui lòng nhập CVV (3-4 số)");
    return false;
  }

  // Kiểm tra tên trên thẻ (không để trống)
  if (!cardName.trim()) {
    alert("Vui lòng nhập tên trên thẻ");
    return false;
  }

  return true; // Trả về true nếu tất cả hợp lệ
}

// Hàm giả lập thanh toán QR
function simulateQRPayment() {
  const btn = document.getElementById("processBtn");
  const btnText = btn.querySelector(".btn-text");

  // Giả lập thanh toán thành công sau 7 giây
  setTimeout(() => {
    completePayment();
  }, 7000);
}

// Hàm giả lập thanh toán bằng ví điện tử
function simulateWalletPayment(walletName) {
  const btn = document.getElementById("processBtn");
  const btnText = btn.querySelector(".btn-text");

  // Giả lập mở ứng dụng ví sau 1 giây
  setTimeout(() => {
    btnText.textContent = `Đang mở ${walletName}...`;

    // Giả lập xác nhận thanh toán sau 2 giây
    setTimeout(() => {
      btnText.textContent = "Đang xác nhận thanh toán...";

      // Giả lập hoàn tất thanh toán sau 2 giây nữa
      setTimeout(() => {
        completePayment();
      }, 2000);
    }, 2000);
  }, 1000);
}

// Hàm hoàn tất thanh toán
function completePayment() {
  const btn = document.getElementById("processBtn");
  const btnText = btn.querySelector(".btn-text");
  const registrationData = JSON.parse(
    sessionStorage.getItem("registrationData") || "{}"
  );
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Cập nhật thông tin khóa học cho user hiện tại
  currentUser.course = {
    plan: registrationData.plan, // Loại gói
    planName: registrationData.planName, // Tên gói
    startDate: new Date().toISOString(), // Ngày bắt đầu (hiện tại)
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Ngày kết thúc (30 ngày sau)
  };

  // Lưu thông tin user hiện tại
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Cập nhật danh sách users trong localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const updatedUsers = users.map((user) => {
    // Cập nhật thông tin khóa học cho user tương ứng
    if (user.username === currentUser.username) {
      return {
        ...user,
        course: currentUser.course,
      };
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  // Đặt lại trạng thái nút thanh toán
  btn.disabled = false;
  btnText.textContent = "Tiến hành thanh toán";

  // Hiển thị modal thông báo thành công
  document.getElementById("successModal").classList.add("active");

  // Xóa dữ liệu đăng ký khỏi sessionStorage
  sessionStorage.removeItem("registrationData");
}

// Hàm quay lại trang trước
function goBack() {
  window.history.back();
}
