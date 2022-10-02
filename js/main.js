var staffList = [];

//Tạo danh sách nhân viên
function createStaff() {
  //Dom
  var staffId = document.querySelector("#tknv").value;
  var staffName = document.querySelector("#name").value;
  var staffEmail = document.querySelector("#email").value;
  var staffPassword = document.querySelector("#password").value;
  var staffWorkingDate = document.querySelector("#datepicker").value;
  var staffSalary = document.querySelector("#luongCB").value;
  var staffPosition = document.querySelector("#chucvu").value;
  var staffWorkingTime = document.querySelector("#gioLam").value;

  //Tao object
  var staff = new Staff(
    staffId,
    staffName,
    staffEmail,
    staffPassword,
    staffWorkingDate,
    staffSalary,
    staffPosition,
    staffWorkingTime
  );

  //Validation

  var valid = true;

  //Kiểm tra rỗng
  valid =
    kiemTraRong(staff.id, "#tbTKNV", "Tài khoản") &
    kiemTraRong(staff.name, "#tbTen", "Tên nhân viên") &
    kiemTraRong(staff.email, "#tbEmail", "Email") &
    kiemTraRong(staff.password, "#tbMatKhau", "Mật khẩu") &
    kiemTraRong(staff.workingDate, "#tbNgay", "Ngày làm") &
    kiemTraRong(staff.salary, "#tbLuongCB", "Lương cơ bản") &
    kiemTraRong(staff.workingTime, "#tbGiolam", "Số giờ làm");

  // Kiem tra chuc vu
  function kiemTraChucVu() {
    if (document.querySelector("#chucvu").value === "Chọn chức vụ") {
      document.querySelector("#tbChucVu").innerHTML = "Hãy chọn chức vụ hợp lệ";
      return false;
    }
    document.querySelector("#tbChucVu").innerHTML = "";
    return true;
  }
  valid &= kiemTraChucVu();

  //Kiem tra ID
  if (kiemTraRong(staff.id, "#tbTKNV", "Tài khoản")) {
    valid &= kiemTraSo(staff.id, "#tbTKNV", "Tài khoản");
    if (kiemTraSo(staff.id, "#tbTKNV", "Tài khoản")) {
      valid &= kiemTraDoDai(staff.id, "#tbTKNV", "Tài khoản", 4, 6);
    }
  }

  //Kiem tra Ten
  if (kiemTraRong(staff.name, "#tbTen", "Tên nhân viên")) {
    valid &= kiemTraKyTu(staff.name, "#tbTen", "Tên nhân viên");
  }

  //Kiem tra Email
  if (kiemTraRong(staff.email, "#tbEmail", "Email")) {
    valid &= kiemTraEmail(staff.email, "#tbEmail", "Email");
  }

  //Kiem tra Password
  if (kiemTraRong(staff.password, "#tbMatKhau", "Mật khẩu")) {
    valid &= kiemTraMatKhau(staff.password, "#tbMatKhau", "Mật khẩu");
    if (kiemTraMatKhau(staff.password, "#tbMatKhau", "Mật khẩu")) {
      valid &= kiemTraDoDai(staff.password, "#tbMatKhau", "Mật khẩu", 6, 10);
    }
  }

  //Kiem tra gio lam
  if (kiemTraRong(staff.workingTime, "#tbGiolam", "Số giờ làm")) {
    valid &= kiemTraSo(staff.workingTime, "#tbGiolam", "Số giờ làm");
    if (kiemTraSo(staff.workingTime, "#tbGiolam", "Số giờ làm")) {
      valid &= kiemTraGiaTri(
        staff.workingTime,
        "#tbGiolam",
        "Số giờ làm",
        80,
        200
      );
    }
  }

  //Kiem tra Ngay
  if (kiemTraRong(staff.workingDate, "#tbNgay", "Ngày làm")) {
    valid &= kiemTraNgay(staff.workingDate, "#tbNgay", "Ngày làm");
  }

  //Kiem tra Luong
  if (kiemTraRong(staff.salary, "#tbLuongCB", "Lương cơ bản")) {
    valid &= kiemTraSo(staff.salary, "#tbLuongCB", "Lương cơ bản");
    if (kiemTraSo(staff.salary, "#tbLuongCB", "Lương cơ bản")) {
      valid &= kiemTraGiaTri(
        staff.salary,
        "#tbLuongCB",
        "Lương cơ bản",
        1000000,
        20000000
      );
    }
  }

  if (!valid) {
    return;
  }

  staffList.push(staff);
  //Gọi hàm xuất ra màn hình
  renderStaffList(staffList);

  //Gọi hàm lưu vào local Storage
  saveLocalStorage(staffList, "keyName");
}

//Hàm xuất list nhân viên ra màn hình
function renderStaffList(arr) {
  var output = "";
  for (var i = 0; i < arr.length; i++) {
    var objectStaff = arr[i];
    objectStaff.totalSalary = function () {
      if (this.position == "Sếp") {
        return this.salary * 3;
      } else if (this.position == "Trưởng phòng") {
        return this.salary * 2;
      } else {
        return this.salary;
      }
    };

    objectStaff.rank = function () {
      if (this.workingTime >= 192) {
        return "Xuất sắc";
      } else if (this.workingTime >= 176) {
        return "Giỏi";
      } else if (this.workingTime >= 160) {
        return "Khá";
      } else {
        return "Trung bình";
      }
    };

    var trStaff = `
  <tr>
    <td>${objectStaff.id}</td>
    <td>${objectStaff.name}</td>
    <td>${objectStaff.email}</td>
    <td>${objectStaff.workingDate}</td>
    <td>${objectStaff.position}</td>
    <td>${objectStaff.totalSalary()}</td>    
    <td>${objectStaff.rank()}</td>
    <td>
      <button class="btn btn-success" id="btnUpdate" onclick="EditStaff('${
        objectStaff.id
      }')">Update</button>
      <button class="btn btn-danger" onclick="DeleteStaff('${
        objectStaff.id
      }')">Delete</button>
    </td>
  </tr>`;

    output += trStaff;
  }
  document.querySelector("tbody").innerHTML = output;
}

//Hàm save localStorage
function saveLocalStorage(object, key) {
  //Chuyển từ json sang string
  var str = JSON.stringify(object);
  localStorage.setItem(key, str);
}

//Lấy key từ localstorage
function getLocalStorage(key) {
  if (localStorage.getItem(key)) {
    var str = localStorage.getItem(key);
    //Chuyển từ string thành object
    var object = JSON.parse(str);
    return object;
  }
  return undefined;
}

window.onload = function () {
  staffList = getLocalStorage("keyName");
  if (staffList == undefined) {
    staffList = [];
  }
  renderStaffList(staffList);
};

//Hàm xóa nhân viên
function DeleteStaff(idClick) {
  var indexDel = -1;
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].id == idClick) {
      indexDel = i;
      break;
    }
  }
  if (indexDel !== -1) {
    staffList.splice(indexDel, 1);
  }

  //Tạo lại danh sách mới
  renderStaffList(staffList);

  //lưu vào localStorage
  saveLocalStorage(staffList, "keyName");
}

function EditStaff(idClick) {
  var staffEdit = null;
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].id == idClick) {
      staffEdit = staffList[i];
      break;
    }
  }

  if (staffEdit !== null) {
    document.querySelector("#tknv").value = staffEdit.id;
    document.querySelector("#name").value = staffEdit.name;
    document.querySelector("#email").value = staffEdit.email;
    document.querySelector("#password").value = staffEdit.password;
    document.querySelector("#datepicker").value = staffEdit.workingDate;
    document.querySelector("#luongCB").value = staffEdit.salary;
    document.querySelector("#chucvu").value = staffEdit.position;
    document.querySelector("#gioLam").value = staffEdit.workingTime;
  }
  // renderStaffList(staffList);
  // saveLocalStorage(staffList, "keyName");
}

//Hàm update thông tin nhân viên
document.querySelector("#btnCapNhat").onclick = function () {
  var staffUpdate = new Staff();
  staffUpdate.id = document.querySelector("#tknv").value;
  staffUpdate.name = document.querySelector("#name").value;
  staffUpdate.email = document.querySelector("#email").value;
  staffUpdate.password = document.querySelector("#password").value;
  staffUpdate.workingDate = document.querySelector("#datepicker").value;
  staffUpdate.salary = document.querySelector("#luongCB").value;
  staffUpdate.position = document.querySelector("#chucvu").value;
  staffUpdate.workingTime = document.querySelector("#gioLam").value;

  var indexEdit = -1;
  for (var i = 0; i < staffList.length; i++) {
    if (staffList[i].id === staffUpdate.id) {
      indexEdit = i;
      break;
    }
  }

  //Validation

  var valid = true;

  //Kiểm tra rỗng
  valid =
    kiemTraRong(staffUpdate.id, "#tbTKNV", "Tài khoản") &
    kiemTraRong(staffUpdate.name, "#tbTen", "Tên nhân viên") &
    kiemTraRong(staffUpdate.email, "#tbEmail", "Email") &
    kiemTraRong(staffUpdate.password, "#tbMatKhau", "Mật khẩu") &
    kiemTraRong(staffUpdate.workingDate, "#tbNgay", "Ngày làm") &
    kiemTraRong(staffUpdate.salary, "#tbLuongCB", "Lương cơ bản") &
    kiemTraRong(staffUpdate.workingTime, "#tbGiolam", "Số giờ làm");

  // Kiem tra chuc vu
  function kiemTraChucVu() {
    if (document.querySelector("#chucvu").value === "Chọn chức vụ") {
      document.querySelector("#tbChucVu").innerHTML = "Hãy chọn chức vụ hợp lệ";
      return false;
    }
    document.querySelector("#tbChucVu").innerHTML = "";
    return true;
  }
  valid &= kiemTraChucVu();

  //Kiem tra Ten
  if (kiemTraRong(staffUpdate.name, "#tbTen", "Tên nhân viên")) {
    valid &= kiemTraKyTu(staffUpdate.name, "#tbTen", "Tên nhân viên");
  }

  //Kiem tra Email
  if (kiemTraRong(staffUpdate.email, "#tbEmail", "Email")) {
    valid &= kiemTraEmail(staffUpdate.email, "#tbEmail", "Email");
  }

  //Kiem tra Password
  if (kiemTraRong(staffUpdate.password, "#tbMatKhau", "Mật khẩu")) {
    valid &= kiemTraMatKhau(staffUpdate.password, "#tbMatKhau", "Mật khẩu");
    if (kiemTraMatKhau(staffUpdate.password, "#tbMatKhau", "Mật khẩu")) {
      valid &= kiemTraDoDai(
        staffUpdate.password,
        "#tbMatKhau",
        "Mật khẩu",
        6,
        10
      );
    }
  }

  //Kiem tra gio lam
  if (kiemTraRong(staffUpdate.workingTime, "#tbGiolam", "Số giờ làm")) {
    valid &= kiemTraSo(staffUpdate.workingTime, "#tbGiolam", "Số giờ làm");
    if (kiemTraSo(staffUpdate.workingTime, "#tbGiolam", "Số giờ làm")) {
      valid &= kiemTraGiaTri(
        staffUpdate.workingTime,
        "#tbGiolam",
        "Số giờ làm",
        80,
        200
      );
    }
  }

  //Kiem tra Ngay
  if (kiemTraRong(staffUpdate.workingDate, "#tbNgay", "Ngày làm")) {
    valid &= kiemTraNgay(staffUpdate.workingDate, "#tbNgay", "Ngày làm");
  }

  //Kiem tra Luong
  if (kiemTraRong(staffUpdate.salary, "#tbLuongCB", "Lương cơ bản")) {
    valid &= kiemTraSo(staffUpdate.salary, "#tbLuongCB", "Lương cơ bản");
    if (kiemTraSo(staffUpdate.salary, "#tbLuongCB", "Lương cơ bản")) {
      valid &= kiemTraGiaTri(
        staffUpdate.salary,
        "#tbLuongCB",
        "Lương cơ bản",
        1000000,
        20000000
      );
    }
  }

  if (!valid) {
    return;
  }

  if (indexEdit !== -1) {
    staffList[indexEdit].id = staffUpdate.id;
    staffList[indexEdit].name = staffUpdate.name;
    staffList[indexEdit].email = staffUpdate.email;
    staffList[indexEdit].password = staffUpdate.password;
    staffList[indexEdit].workingDate = staffUpdate.workingDate;
    staffList[indexEdit].salary = staffUpdate.salary;
    staffList[indexEdit].position = staffUpdate.position;
    staffList[indexEdit].workingTime = staffUpdate.workingTime;
  }

  renderStaffList(staffList);

  saveLocalStorage(staffList, "keyName");
};

//Hàm search theo xếp loại nhân viên
function searchStaff() {
  var keyWord = document.querySelector("#searchName").value;
  keyWord = removeVietnameseTones(keyWord);

  var output = [];
  for (var i = 0; i < staffList.length; i++) {
    var rank = removeVietnameseTones(staffList[i].rank());
    if (rank.search(keyWord) != -1) {
      output.push(staffList[i]);
    }
  }
  renderStaffList(output);
}
document.querySelector("#searchName").oninput = searchStaff;
document.querySelector("#btnTimNV").onclick = searchStaff;

//Hàm search Tiếng Việt
function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}
