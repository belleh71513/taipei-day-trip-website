const userApiURL = `${window.location.origin}/api/user`
const memberApiURL = `${window.location.origin}/api/member`
const userProfileContainerEle = document.querySelector("#user-profile-container")
const orderRecordContainerEle = document.querySelector(".order-record-container")
const accountManagementEle = document.querySelector(".account-management")
const orderRecordEle = document.querySelector(".order-record")
const changePasswordBtn = document.querySelector("#change-password-btn")

const loginLi = document.querySelector(".logout-li");
const logoutA = document.querySelector(".logout-a");
const loader = document.querySelector(".loader")

let email;
let data = null;

async function getUserStatus() {
  const res = await fetch(userApiURL);
  const userJsonData = await res.json();
  if(userJsonData.data) {
    loginLi.classList.add("nav-a-hidden")
    logoutA.classList.add("nav-a-show")
    email = userJsonData.data.email;
  }
  else {
    window.location.href = "/";
  }
}

async function memberData () {
  const res = await fetch(memberApiURL);
  const memberJsonData = await res.json();
  data = memberJsonData
}

function renderMemberAccountPage () {
  let memberData = data.data;
  const userNameElement = document.querySelector(".user-name")
  const userProfileNameSpan = document.querySelector(".user-profile-name-span")
  const userProfileEmailSpan = document.querySelector(".user-profile-email-span")
  const userProfilePhoneSpan = document.querySelector(".user-profile-phone-span")
  const orderRecordNumberEle = document.querySelector("#order-record-number")
  const orderRecordPriceEle = document.querySelector("#order-record-price")
  const orderRecordAttImgEle = document.querySelector("#order-record-att-img")
  const orderRecordAttNameEle = document.querySelector(".order-record-name")
  const orderRecordDateEle = document.querySelector(".order-record-date")
  const orderRecordTimeEle = document.querySelector(".order-record-time")
  const orderRecordAddressEle = document.querySelector(".order-record-address")
  const noOrderRecordMessage = document.querySelector("#no-order-record-message")
  const orderRecordDetails = document.querySelector(".order-record-details")


  if(memberData){
    for(let item of memberData) {
      let dateFormat = new Date(item["trip"]["date"]);
      let date = dateFormat.toISOString().split('T')[0];
      let time = item["trip"]["time"] == "morning" ? "早上 9 點到 下午 5點" : "下午 1 點到 下午 9點";

      userNameElement.textContent = item["contact"]["name"]
      userProfileNameSpan.textContent = item["contact"]["name"]
      userProfileEmailSpan.textContent = email
      userProfilePhoneSpan.textContent = item["contact"]["phone"]
      orderRecordNumberEle.textContent = `訂單編號    ${item["number"]}`
      orderRecordPriceEle.textContent = `訂單總金額   ${item["price"]}`
      orderRecordAttImgEle.src = item["trip"]["attraction"]["image"]
      orderRecordAttNameEle.textContent = `台北一日遊  :    ${item["trip"]["attraction"]["name"]}`
      orderRecordDateEle.textContent = `日期  :    ${date}`
      orderRecordTimeEle.textContent = `時間  :    ${time}`
      orderRecordAddressEle.textContent = `地點  :    ${item["trip"]["attraction"]["address"]}`
    }
  }else {
    noOrderRecordMessage.style.display = "block";
    orderRecordDetails.style.display = "none"
    noOrderRecordMessage.textContent = `${data.message}`
  }

}

async function initMemberPage(){
  await getUserStatus();
  await memberData();
  renderMemberAccountPage();
}
initMemberPage();

logoutA.addEventListener("click", async() => {
  const res = await fetch(userApiURL,{method : "DELETE"});
  const data = await res.json();
  if(data.ok){window.location.href = "/";}
})

changePasswordBtn.addEventListener("click", async() => {
  const oldPasswordVal = document.querySelector("#old-password").value
  const newPasswordVal = document.querySelector("#new-password").value
  const confirmPasswordVal = document.querySelector("#confirm-password").value
  const errorMessage = document.querySelector(".error-message")
  console.log(oldPasswordVal)
  console.log(newPasswordVal)
  console.log(confirmPasswordVal)

  if(oldPasswordVal === newPasswordVal){
    return errorMessage.textContent = "新、舊密碼不得重複!!!"
  }

  if(newPasswordVal === confirmPasswordVal){
    const req = {
      method : "PUT",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "email" : email,
        "old_password" : oldPasswordVal,
        "new_password" : newPasswordVal
      })
    }
    try {
      const res = await fetch(userApiURL, req);
      const data = await res.json();
      if(data.ok){
        errorMessage.textContent = "密碼變更成功，請重新登入"
        errorMessage.style.color = "blue";
        setTimeout(() =>{
          window.location.href = "/";
        },1500)
      }
    }catch(e){
      console.log(e)
    }
  }
})

orderRecordEle.addEventListener("click", () => {
  userProfileContainerEle.style.display = "none";
  orderRecordContainerEle.style.display = "block";
})

accountManagementEle.addEventListener("click", () => {
  userProfileContainerEle.style.display = "block";
  orderRecordContainerEle.style.display = "none";
})


