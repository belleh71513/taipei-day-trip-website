
// ********************取得元素*************************
const imgContainer = document.querySelector(".img-container")
const attractionName = document.querySelector(".attraction-name")
const attractionCategoryMrt = document.querySelector(".attraction-category-mrt")
const attracionDescription = document.querySelector(".attraction-description")
const attractionAddressContent = document.querySelector(".attraction-address-content")
const attractionTransportContent = document.querySelector(".attraction-transport-content")
const slideIconWrap = document.querySelector(".slide-icon-wrap")

// ******************取得 api 資料***********************
let data = null;
async function initData() {
  let currentURL = window.location.href
  let attractionID = currentURL.split("/").pop()
  const response = await fetch(`/api/attraction/${attractionID}`);
  const result = await response.json();
  data = result;
};

// ****************拿到資料後渲染頁面*********************
function renderPage(){
  attData = data.data
  // 先將圖片render出來
  attData["images"].forEach( (imgURL, index) => {
    // 創造img element
    let img = document.createElement("img")
    img.classList.add("slide-img")
    // 放進 img src
    img.src = imgURL
    // 創造圖片下方圓點
    let slideIcon = document.createElement("div")
    slideIcon.classList.add("slide-icon")
    // 如果不是第一張圖片，就給予hidden class 先隱藏
    if(index !== 0){
      img.classList.add("hidden")
    }
    // radio 第一個給予 hidden class 表示第一張圖片
    if(index === 0){
      slideIcon.classList.add("hidden")
    }
    imgContainer.appendChild(img)
    slideIconWrap.appendChild(slideIcon)
  });
  // 景點各相關資訊載入(嘗試利用三元運算)
  attractionName.textContent = attData["name"]
  attractionCategoryMrt.textContent = attData["mrt"] ? `${attData["name"]} at ${attData["mrt"]}` : `${attData["name"]}`
  attracionDescription.textContent = attData["description"]
  attractionAddressContent.textContent = attData["address"]
  attractionTransportContent.textContent = attData["transport"]
}

//*******************初始化函式************************
async function init(){
  await initData();
  renderPage();
}
init()

// ******************費用監聽事件***********************
// 監聽使用者預定上半天或下半天，給予相對應的價錢
const pmRadio = document.querySelector("#pm")
const amRadio = document.querySelector("#am")
const bookingPrice = document.querySelector(".booking-price")

pmRadio.addEventListener("click", ()=>{
  bookingPrice.textContent = "新台幣 2500 元"
})
amRadio.addEventListener("click", ()=>{
  bookingPrice.textContent = "新台幣 2000 元"
})

// ****************景點圖片輪播事件*********************

// 取得按鈕元素
const arrowPre = document.querySelector(".arrow-pre");
const arrowNext = document.querySelector(".arrow-next");
// 全域變數紀錄目前圖片位置
let count = 0;
// next 按鈕綁定函式
arrowNext.addEventListener("click", ()=>{
  const slideImg = document.querySelectorAll(".slide-img")
  const slideIcon = document.querySelectorAll(".slide-icon");
  count ++;
  // 給所有圖片 hidden class
  slideImg.forEach((img) =>{
    img.classList.add("hidden")
  })
  slideIcon.forEach((icon) =>{
    icon.classList.remove("hidden")
  })
  // 如果到了最後一張圖片就歸 0
  if(count > (slideImg.length-1)){
    count = 0;
  }
  // 當前圖片移除 hidden 元素(將圖片顯示出來)
  slideImg[count].classList.remove("hidden");
  slideIcon[count].classList.add("hidden");
})
// pre 按鈕綁定函式
arrowPre.addEventListener("click", ()=>{
  const slideImg = document.querySelectorAll(".slide-img")
  const slideIcon = document.querySelectorAll(".slide-icon");
  count --;
  slideImg.forEach((img) =>{
    img.classList.add("hidden")
  })
  slideIcon.forEach((icon) =>{
    icon.classList.remove("hidden")
  })
  if(count < 0 ){
    count = slideImg.length-1;
  }
  slideImg[count].classList.remove("hidden");
  slideIcon[count].classList.add("hidden");
})

// *************景點圖片自動輪播(待開發)*****************





