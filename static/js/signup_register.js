// *********************登入 / 註冊 彈出視窗監聽事件*****************************

const loginRegister = document.querySelector("#login-register");
const loginSection = document.querySelector("#loginSection")
const registerSection = document.querySelector("#registerSection")
const loginClose = document.querySelector(".login-close");
const registerClose = document.querySelector(".register-close");
const loginToggleBtn = document.querySelector(".login-toggle-btn");
const registerToggleBtn = document.querySelector(".register-toggle-btn");
const registerMessage = document.querySelector("#registerMessage");
const loginMessage = document.querySelector("#loginMessage");

const loginDisplay = (e) => {
  e.preventDefault()
  loginSection.classList.toggle("show")
}

const registerDisplay = () => {
  registerSection.classList.toggle("show")
}

const loginRegisterSwitch = () => {
  loginSection.classList.toggle("show")
  registerSection.classList.toggle("show")
  if(loginMessage.textContent){
    loginMessage.textContent="";
  }
  if(registerMessage.textContent){
    registerMessage.textContent="";
  }
}

loginRegister.addEventListener("click", loginDisplay)
loginClose.addEventListener("click", loginDisplay)
registerClose.addEventListener("click", registerDisplay)
loginToggleBtn.addEventListener("click",loginRegisterSwitch)
registerToggleBtn.addEventListener("click",loginRegisterSwitch)

// ********************登入狀態確認****************************

function checkUserStatus(){
  fetch("/api/user",{
    method : "GET"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    if(data.data){
      loginRegister.textContent = "登出系統"
   }
  })
}
checkUserStatus();
// *********************註冊功能*****************************
const registerBtn = document.querySelector(".register-btn")

function register(e){
  e.preventDefault()
  const registerName = document.querySelector("#registerName").value
  const registerEmail = document.querySelector("#registerEmail").value
  const registerPassword = document.querySelector("#registerPassword").value


  if (!registerName ||  !registerEmail || !registerPassword){
    registerMessage.textContent = "姓名、電子信箱或密碼欄位不得為空";
  }else{
    fetch("/api/user",{
      method : "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "name" : registerName,
        "email" : registerEmail,
        "password" : registerPassword
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.ok === true){
        registerMessage.textContent = "註冊成功";
      }else{
        registerMessage.textContent = data.message;
      }
    })
  }


}

registerBtn.addEventListener("click", register)

// *********************登入功能*****************************
const loginBtn = document.querySelector(".login-btn")
function login(e){
  e.preventDefault()
  const loginEmail = document.querySelector("#loginEmail").value
  const loginPassword = document.querySelector("#loginPassword").value

  if (!loginEmail ||  !loginPassword){
    loginMessage.textContent = "電子信箱或密碼欄位不得為空";
  }else{
    fetch("api/user", {
      method : "PATCH",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "email" : loginEmail,
        "password" : loginPassword
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data)
      if(data.ok){
        loginSection.classList.toggle("show")
      }else{
        loginMessage.textContent = data.message;
      }
    })
  }
}
loginBtn.addEventListener("click", login)
// *********************登出功能*****************************
function logout(){
  fetch("/api/user",{
    method : "DELETE"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {

  })
}