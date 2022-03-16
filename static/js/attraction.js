

const imgContainer = document.querySelector(".img-container")
const attractionName = document.querySelector(".attraction-name")
const attractionCategoryMrt = document.querySelector(".attraction-category-mrt")
const attracionDescription = document.querySelector(".attraction-description")
const attractionAddressContent = document.querySelector(".attraction-address-content")
const attractionTransportContent = document.querySelector(".attraction-transport-content")
const slideIconWrap = document.querySelector(".slide-icon-wrap")


let data = null;

async function initData() {
  let currentURL = window.location.href
  let attractionID = currentURL.split("/").pop()
  const response = await fetch(`/api/attraction/${attractionID}`);
  const result = await response.json();
  data = result;
};


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
    if(index !== 0){
      img.classList.add("hidden")
    }
    if(index === 0){
      slideIcon.classList.add("hidden")
    }




    imgContainer.appendChild(img)
    slideIconWrap.appendChild(slideIcon)
  });

  attractionName.textContent = attData["name"]
  attractionCategoryMrt.textContent = `${attData["name"]} at ${attData["mrt"]}`
  attracionDescription.textContent = attData["description"]
  attractionAddressContent.textContent = attData["address"]
  attractionTransportContent.textContent = attData["transport"]


}

async function init(){
  await initData();
  renderPage();
}

init()

const pmRadio = document.querySelector("#pm")
const amRadio = document.querySelector("#am")
const bookingPrice = document.querySelector(".booking-price")

pmRadio.addEventListener("click", ()=>{
  bookingPrice.textContent = "新台幣 2500 元"
})
amRadio.addEventListener("click", ()=>{
  bookingPrice.textContent = "新台幣 2000 元"
})


const arrowPre = document.querySelector(".arrow-pre");
const arrowNext = document.querySelector(".arrow-next");
let count = 0;


arrowNext.addEventListener("click", ()=>{
  const slideImg = document.querySelectorAll(".slide-img")
  const slideIcon = document.querySelectorAll(".slide-icon");
  count ++;
  slideImg.forEach((img) =>{
    img.classList.add("hidden")
  })
  slideIcon.forEach((icon) =>{
    icon.classList.remove("hidden")
  })

  if(count > (slideImg.length-1)){
    count = 0;
  }
  slideImg[count].classList.remove("hidden");
  slideIcon[count].classList.add("hidden");
})

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






