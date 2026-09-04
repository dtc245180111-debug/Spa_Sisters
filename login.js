// Dữ liệu tài khoản demo và phân quyền
const usersDB = {
  manager: { password: "123", role: "Manager", redirect: "manager-dashboard.html" },
  receptionist: { password: "123", role: "Receptionist", redirect: "receptionist-dashboard.html" },
  technician: { password: "123", role: "Technician", redirect: "technician-dashboard.html" }
};

function handleLogin(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username").value.trim().toLowerCase();
  const passwordInput = document.getElementById("password").value;

  const user = usersDB[usernameInput];

  // Kiểm tra tài khoản và mật khẩu
  if (user && user.password === passwordInput) {
    // Lưu thông tin phiên làm việc
    sessionStorage.setItem("userRole", user.role);
    sessionStorage.setItem("username", usernameInput);

    alert(`Đăng nhập thành công với quyền: ${user.role}`);
    
    // Điều hướng theo phân quyền (thay thế bằng URL thực tế)
    // window.location.href = user.redirect;
  } else {
    alert("Tên đăng nhập hoặc mật khẩu không chính xác! (Mật khẩu demo: 123)");
  }
}