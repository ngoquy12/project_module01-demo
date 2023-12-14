import { formatDate } from "../../utils/formatData.js";

//#region Lấy ra các phần tử trong DOM
const btnOpenForm = document.querySelector("#btnOpenForm");
const formAddUser = document.querySelector("#formAddUser");
const iconCloseForm = document.querySelector("#iconCloseForm");
const btnCloseForm = document.querySelector("#btnCloseForm");
const btnSubmit = document.querySelector("#btnSubmit");
const formElement = document.querySelector(".form-container");
const userNameInput = document.querySelector("#userName");
const emailInput = document.querySelector("#email");
const genders = document.querySelectorAll("input[name=gender]");
const dateOfBirthInput = document.querySelector("#dateOfBirth");
const phoneNumberInput = document.querySelector("#phoneNumber");
const statuses = document.querySelectorAll("input[name=status]");
const tbody = document.querySelector("#tbody");

const emailError = document.querySelector(".email-error");
const userError = document.querySelector(".user-error");
//#endregion

//#region Các biến toàn cục của ứng dụng
let genderValue = 0; // Mặc định là giới tính nam
let statusValue = 1; // Mặc định là trạng thái đang hoạt động
//#endregion

//#region Các hàm liên quan đến form

// Hàm đóng form thêm mới
function handleCloseForm() {
  formAddUser.style.display = "none";
}

// Hàm mở form thêm mới
function handleOpenForm() {
  formAddUser.style.display = "flex";
  // Khi mở form thì mặc định nó sẽ focus vào input họ và tên
  userNameInput.focus();
}

//#endregion

// Lắng nghe sự kiện khi click vào button thêm mới tài khoản
btnOpenForm.addEventListener("click", () => {
  // Hiển thị form thêm mới tài khoản
  handleOpenForm();
});

// Đóng form khi click vào icon close
iconCloseForm.addEventListener("click", () => {
  handleCloseForm();
});

// Đóng form khi click vào button hủy
btnCloseForm.addEventListener("click", () => {
  handleCloseForm();
});

// Bắt sự kiện khi nhấn phím insert thì hiển thị form
window.addEventListener("keydown", (e) => {
  // Khi bấm vào phím insert thì hiển thị form
  if (e.code === "Insert" && e.which === 45) {
    handleOpenForm();
  }

  // Khi bấm vào phím ESC thì đóng form
  if (e.code === "Escape" && e.which === 27) {
    handleCloseForm();
  }
});

// Khi thực hiện tab qua nút thêm mới thì tự động sẽ focus vào input của userName
btnSubmit.addEventListener("keydown", (e) => {
  if (e.code === "Tab" && e.which === 9) {
    userNameInput.focus();
  }
});

// Validate dữ liệu đầu vào
function validateData() {
  const error = [];
  if (!userNameInput.value) {
    userNameInput.classList.add("border-red");
    userError.style.display = "block";
    // Khi có lỗi thì sẽ push lỗi vào trong mảng
    error.push("Tên không được để trống");
  } else {
    userNameInput.classList.remove("border-red");
    userError.style.display = "none";
  }

  if (!emailInput.value) {
    emailError.style.display = "block";
    emailInput.classList.add("border-red");
    error.push("Email không được để trống");
  } else {
    emailError.style.display = "none";
    emailInput.classList.remove("border-red");
  }

  if (error.length > 0) {
    return false;
  } else {
    return true;
  }
}

//#region Lấy giá trị từ các radio trong form

// Lấy giá trị của giới tính
genders.forEach((gender) => {
  gender.addEventListener("change", (e) => {
    if (e.target.checked) {
      genderValue = +e.target.value; // Gán lại giá trị cho biến gender khi change
    }
  });
});

// Lấy giá trị của trạng thái
statuses.forEach((status) => {
  status.addEventListener("change", (e) => {
    if (e.target.checked) {
      statusValue = +e.target.value; // Gán lại giá trị cho biến statusValue khi change
    }
  });
});

//#endregion

// Reset lại tất cả các giá trị trong form
function resetForm() {
  userNameInput.value = "";
  genderValue = 0;
  dateOfBirthInput.value = "";
  phoneNumberInput.value = "";
  emailInput.value = "";
  statusValue = 1;
}

// Sự kiện submit của form
formElement.addEventListener("submit", (e) => {
  // Ngăn chặn sự kiện mặc định của form
  e.preventDefault();
  let isValid = validateData();
  if (isValid) {
    // Tạo đối tượng user
    const newUser = {
      userId: uuidv4(),
      userName: userNameInput.value,
      gender: genderValue,
      dateOfBirth: dateOfBirthInput.value,
      phoneNumber: phoneNumberInput.value,
      email: emailInput.value,
      status: statusValue,
      createdDate: formatDate(new Date()),
    };

    // Lấy dữ liệu trên local
    const userLocal = JSON.parse(localStorage.getItem("users")) || [];

    // thêm phần tử vào đầu mảng
    userLocal.unshift(newUser);

    // Lưu dữ liệu lên local
    localStorage.setItem("users", JSON.stringify(userLocal));

    // Reset form
    resetForm();

    // Đóng form
    handleCloseForm();

    // Gọi hàm render để load lại dữ liệu
    renderListUser();
    // window.location.reload();
  }
});

// Render danh sách user

function renderListUser() {
  // Lấy dữ liệu trên local
  const userLocal = JSON.parse(localStorage.getItem("users")) || [];

  const trHtmls = userLocal.map((user, index) => {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${user.userName}</td>
            <td>${
              user.gender === 0 ? "Nam" : user.gender === 1 ? "Nữ" : "Khác"
            }</td>
            <td>${user.dateOfBirth}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber}</td>
            <td>${user.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
            <td>
            <button>Chặn</button>
            <button>Xem chi tiết</button>
            </td>
        </tr>
    `;
  });

  // Chuyển đổi từ array sang string
  const trHtml = trHtmls.join("");

  // Append dữ liệu vào trong bảng
  tbody.innerHTML = trHtml;
}

//#region Gọi các hàm trong toàn bộ file
renderListUser();
//#endregion
