//  api URL
const apiUserUrl = `${window.location.origin}/api/user`;

// 登入、登出元素
const loginLi = document.querySelector(".logout-li");
const logoutA = document.querySelector(".logout-a");
// main內部元素
const orderSuccessTitle = document.querySelector(".order-success-title")
const orderSuccessText = document.querySelector(".order-success-text")
const orderSuccessNumber = document.querySelector(".order-number")
const orderReminder = document.querySelector(".order-reminder")

let data = null;
async function getUser(){
  const response = await fetch(apiUserUrl);
  const result = await response.json();
  if(result.data){
    loginLi.classList.add("nav-a-hidden");
    logoutA.classList.add("nav-a-show");
  }
  else{
    window.location.href = "/";
  }
}

const orderNumber = window.location.search.split("=").pop()
console.log(orderNumber)

function renderThankyouPage(){
  orderSuccessTitle.textContent = "行程預定成功";
  orderSuccessText.textContent = "您的訂單編號如下 : ";
  orderSuccessNumber.textContent = `${orderNumber}`;
  orderReminder.textContent = "請記住您的訂單編號，或前往會員中心查詢";
}

async function initThankyouPage(){
  await getUser();
  renderThankyouPage();
}
initThankyouPage();

