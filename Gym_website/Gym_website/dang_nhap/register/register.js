// Chỉ báo độ mạnh của mật khẩu
const passwordInput = document.getElementById("regPassword");
const strengthBar = document.getElementById("passwordStrengthBar");
const strengthText = document.getElementById("passwordStrengthText");

passwordInput.addEventListener("input", function () {
  const password = this.value;
  let strength = 0;

  //Kiểm tra độ dài
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Kiểm tra loại ký tự
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  // Cập nhật thanh và văn bản độ mạnh
  const width = (strength / 5) * 100;
  strengthBar.style.width = width + "%";

  if (password.length === 0) {
    strengthText.textContent = "";
    strengthBar.style.backgroundColor = "transparent";
  } else if (strength <= 2) {
    strengthText.textContent = "Weak";
    strengthBar.style.backgroundColor = "#ff6b6b";
  } else if (strength <= 3) {
    strengthText.textContent = "Medium";
    strengthBar.style.backgroundColor = "#ffb347";
  } else {
    strengthText.textContent = "Strong";
    strengthBar.style.backgroundColor = "#4CAF50";
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const email = document.getElementById("regEmail").value;

    // Xóa thông báo lỗi và thành công trước khi kiểm tra
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("successMessage").textContent = "";

    // Kiểm tra các trường bắt buộc
    if (password !== confirmPassword) {
      document.getElementById("errorMessage").textContent =
        "Passwords do not match!";
      return;
    }

    if (password.length < 6) {
      document.getElementById("errorMessage").textContent =
        "Password must be at least 6 characters!";
      return;
    }

    // Lấy danh sách user từ localStorage hoặc tạo mới nếu chưa có
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra username đã tồn tại chưa
    if (users.some((u) => u.username === username)) {
      document.getElementById("errorMessage").textContent =
        "Username already exists!";
      return;
    }

    // Kiểm tra email đã tồn tại chưa
    if (users.some((u) => u.email === email)) {
      document.getElementById("errorMessage").textContent =
        "Email already registered!";
      return;
    }

    // Thêm user mới
    const newUser = {
      username,
      password,
      email,
      registerDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Hiển thị thông báo thành công
    document.getElementById("successMessage").textContent =
      "Registration successful! Redirecting...";

    // Tự động đăng nhập sau khi đăng ký thành công
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Chuyển hướng sang trang admin sau 2 giây
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  });
