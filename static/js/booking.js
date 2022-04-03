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

function renderBookingPage(){
  loginLi.classList.add("nav-a-hidden");
  logoutA.classList.add("nav-a-show");
  if (data.data){
    let bookingData = data.data;
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