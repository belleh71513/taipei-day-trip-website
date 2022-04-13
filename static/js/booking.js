const userApiURL = `${window.location.origin}/api/user`;
const bookingApiURL = `${window.location.origin}/api/booking`;
// ********************取得header元素****************************
const loginLi = document.querySelector(".logout-li");
const logoutA = document.querySelector(".logout-a");
// ********************取得main元素****************************
const mainElement = document.querySelector("#booking-main");
const attractionImg = document.querySelector(".attraction-img");
const bookingHeader = document.querySelector(".booking-header");
const bookingAttraction = document.querySelector(".booking-attraction");
const bookingTimeText = document.querySelector(".booking-time-text");
const bookingDateText = document.querySelector(".booking-date-text");
const bookingPriceText = document.querySelector(".booking-price-text");
const bookingAddressText = document.querySelector(".booking-address-text");
const confirmPrice = document.querySelector(".confirm-price");
const deleteIcon = document.querySelector(".delete-icon");
// ********************取得no booking main元素****************************
const mainNoBooking = document.querySelector(".main-no-booking");
const noBookingHeader = document.querySelector(".no-booking-header");
const noOrderMessage = document.querySelector(".no-order-message");
// ********************取得contact input元素****************************
const contactName = document.querySelector("#contact-name");
const contactEmail = document.querySelector("#contact-email");
const contactPhone = document.querySelector("#phone-number")

const sendBtn = document.querySelector(".confirm-btn");
const confirmMessage = document.querySelector("#confirm-message")

const footer = document.querySelector("footer");

let data = null;
let userName;
let email;
async function initBookingData(){
  const response = await fetch(bookingApiURL);
  const result = await response.json();
  data = result;
}

async function getUser(){
  const response = await fetch(userApiURL);
  const result = await response.json();
  if(result.data){
    userName = result.data.name;
    email = result.data.email;
  }
  else{
    window.location.href = "/";
  }
}

let bookingData;
function renderBookingPage(){
  loginLi.classList.add("nav-a-hidden");
  logoutA.classList.add("nav-a-show");
  if (data.data){
    bookingData = data.data;
    // 轉換date格式
    let dateFormat = new Date(bookingData.date);
    let date = dateFormat.toISOString().split('T')[0];

    bookingHeader.textContent = `您好，${userName}，待預定行程如下 :`;
    bookingAttraction.textContent = `台北一日遊 : ${bookingData.attraction.name}`;

    const img = document.createElement("img");
    img.src = bookingData.attraction.image;

    bookingTimeText.textContent = bookingData.time == "morning" ? "早上 9 點到 下午 5點" : "下午 1 點到 下午 9點";
    bookingDateText.textContent = date;
    bookingPriceText.textContent = `新台幣 ${bookingData.price} 元`;
    bookingAddressText.textContent = bookingData.attraction.address;
    confirmPrice.textContent = `新台幣 ${bookingData.price} 元`;

    contactName.setAttribute("value", userName);
    contactEmail.setAttribute("value", email);
    attractionImg.appendChild(img);
  }else{
    noBookingData();
  }
}
// ********************初始化page****************************
async function initBookingPage(){
  await initBookingData();
  await getUser();
  renderBookingPage();
}
initBookingPage();

function noBookingData(){
  mainNoBooking.classList.add("show");
  mainElement.classList.add("hidden")
  noBookingHeader.textContent = `您好，${userName}，待預定行程如下 :`;
  noOrderMessage.classList.add("no-order-message-show");
  footer.classList.add("no-order-footer");
}

function deleteBookingData(){
  fetch(bookingApiURL, {
    method : "DELETE"
  })
  .then(response => {
    return response.json()
  })
  .then(data => {
    if(data.ok){
      noBookingData();
    }
  })
  .catch((error) => console.log(error));
}
deleteIcon.addEventListener("click", deleteBookingData)

function logout(){
  fetch(userApiURL,{
    method : "DELETE"
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    if(data.ok){
      logoutA.classList.add("nav-a-hidden");
      loginLi.classList.remove("nav-a-hidden");
      window.location.href = "/";
    }
  })
}
logoutA.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
  }
)

// **********************送出訂單驗證******************************

// tappay設定
TPDirect.setupSDK(123998, "app_yF5llo3O6gk0wj4TBYiu0G4zwfv48mVhMRfzCO6eKwEz5PIg6nMXlCz6bWFR", "sandbox");

const setup = {
  fields : {
    number : {
      element : "#card-number",
      placeholder: "**** **** **** ****"
    },
    expirationDate: {
      element: document.getElementById('card-exp-date'),
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'CCV'
    }
  },
  styles : {
    "input" : {
      "color" : "#666666",
      "font-size" : "16px"
    },
    ":focus" : {
      "color" : "black"
    },
    ".valid" : {
      "color" : "green"
    },
    ".invalid" : {
      "color" : "red"
    }
  }
}

TPDirect.card.setup(setup)

// TPDirect.card.onUpdate(function (update) {

//   if (update.canGetPrime) {
//       // submitButton.removeAttribute('disabled')
//       $('button[type="submit"]').removeAttr('disabled')
//   } else {
//       // submitButton.setAttribute('disabled', true)
//       $('button[type="submit"]').attr('disabled', true)
//   }

//   // number 欄位是錯誤的
//   if (update.status.number === 2) {
//       setNumberFormGroupToError('.card-number-group')
//   } else if (update.status.number === 0) {
//       setNumberFormGroupToSuccess('.card-number-group')
//   } else {
//       setNumberFormGroupToNormal('.card-number-group')
//   }

//   if (update.status.expiry === 2) {
//       setNumberFormGroupToError('.card-exp-date-group')
//   } else if (update.status.expiry === 0) {
//       setNumberFormGroupToSuccess('.card-exp-date-group')
//   } else {
//       setNumberFormGroupToNormal('.card-exp-date-group')
//   }

//   if (update.status.cvc === 2) {
//       setNumberFormGroupToError('.card-ccv-group')
//   } else if (update.status.cvc === 0) {
//       setNumberFormGroupToSuccess('.card-ccv-group')
//   } else {
//       setNumberFormGroupToNormal('.card-ccv-group')
//   }
// })

// 按下送出button觸發事件
const orderApiURL = `${window.location.origin}/api/orders`;
let prime = null;

function getPrime(e) {
  e.preventDefault();
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  console.log(contactPhone.value)
  if (!contactPhone.value){
    confirmMessage.style.color = "#f00";
    confirmMessage.textContent = "手機號碼欄位不得空白!"
    setTimeout(() => {
      confirmMessage.textContent = "";
    },1500)
    return
  }
  // 確認是否可以 getPrime
  if(tappayStatus.canGetPrime === false) {
    confirmMessage.style.color = "#f00";
    confirmMessage.textContent = "請確認信用卡資訊是否正確!"

    setTimeout(() => {
      confirmMessage.textContent = "";
    },1500)
    return
  }
  // Get Prime
  TPDirect.card.getPrime( result => {
    if(result.status !==0) {
      confirmMessage.textContent = `${result.msg}`
      return
    }
    prime = result.card.prime
    snedPrimeToBackend(prime)
  })
}

function snedPrimeToBackend(prime){
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    let dateFormat = new Date(bookingData.date);
    let date = dateFormat.toISOString().split('T')[0];

    const primeData = {
      "prime" : prime,
      "order" : {
        "price" : bookingData.price,
        "trip" : {
          "attraction" : {
            "id" : bookingData.attraction.id,
            "name" : bookingData.attraction.name,
            "address" : bookingData.attraction.address,
            "image" : bookingData.attraction.image
          },
          "date" : date,
          "time" : bookingData.time
        },
        "contact" : {
          "name" : userName,
          "email" : email,
          "phone" : contactPhone.value
        }
      }
    }
    fetch(orderApiURL, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(primeData)
    })
    .then (response => {
      return response.json()
    })
    .then (data => {
      if(data.data){
        window.location.href = `/thankyou?number=${data.data.number}`;

      }
      else {
        confirmMessage.textContent = data.message
      }
    })
}



sendBtn.addEventListener("click", getPrime)


function setNumberFormGroupToError(selector) {
  $(selector).addClass('has-error')
  $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
  $(selector).removeClass('has-error')
  $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
  $(selector).removeClass('has-error')
  $(selector).removeClass('has-success')
}