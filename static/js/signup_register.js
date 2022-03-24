// *********************登入 / 註冊 彈出視窗監聽事件*****************************

const loginLi = document.querySelector(".logout-li");
const logoutA = document.querySelector(".logout-a");
const loginSection = document.querySelector("#loginSection")
const registerSection = document.querySelector("#registerSection")
const loginClose = document.querySelector(".login-close");
const registerClose = document.querySelector(".register-close");
const loginToggleBtn = document.querySelector(".login-toggle-btn");
const registerToggleBtn = document.querySelector(".register-toggle-btn");
const registerMessage = document.querySelector("#registerMessage");
const loginMessage = document.querySelector("#loginMessage");
// *********************註冊表單元素*****************************
const registerName = document.querySelector("#registerName")
const registerEmail = document.querySelector("#registerEmail")
const registerPassword = document.querySelector("#registerPassword")
// *********************登入表單元素*****************************
const loginEmail = document.querySelector("#loginEmail")
const loginPassword = document.querySelector("#loginPassword")

const loginDisplay = (e) => {
  e.preventDefault()
  loginMessage.textContent = "";
  loginEmail.value = "";
  loginPassword.value = "";
  loginSection.classList.toggle("show")
}

const registerDisplay = () => {
  registerMessage.textContent = "";
  registerSection.classList.toggle("show")
  registerName.value = "";
  registerEmail.value= "";
  registerPassword.value= "";
}

const loginRegisterSwitch = () => {
  loginMessage.textContent = "";
  registerMessage.textContent = "";
  registerName.value = "";
  registerEmail.value= "";
  registerPassword.value= "";
  loginEmail.value = "";
  loginPassword.value = "";
  loginSection.classList.toggle("show")
  registerSection.classList.toggle("show")
}

loginLi.addEventListener("click", loginDisplay)
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
      loginLi.classList.add("nav-a-hidden")
      logoutA.classList.add("nav-a-show")
    }else{
      logoutA.classList.add("nav-a-hidden")
    }
  })
}
checkUserStatus();
// *********************註冊功能*****************************
const registerBtn = document.querySelector(".register-btn")

function register(e){
  e.preventDefault()
  const name = registerName.value
  const email = registerEmail.value
  const password = registerPassword.value

  if (!name ||  !email || !password){
    registerMessage.textContent = "姓名、電子信箱或密碼欄位不得為空";
  }else{
    fetch("/api/user",{
      method : "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "name" : name,
        "email" : email,
        "password" : password
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
  const email = loginEmail.value
  const password = loginPassword.value

  if (!email ||  !password){
    loginMessage.textContent = "電子信箱或密碼欄位不得為空";
  }else{
    fetch("api/user", {
      method : "PATCH",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "email" : email,
        "password" : password
      })
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.ok){
        loginMessage.textContent = "登入成功";
        loginMessage.style.color = "black"
        setTimeout(() =>{
          window.location.reload()
        },1500)
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
    if(data.ok){
      logoutA.classList.add("nav-a-hidden")
      loginLi.classList.remove("nav-a-hidden")
    }
  })
}
logoutA.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
  // setTimeout(()=>{
  //   window.location.reload()
  // },1000)
  }
)