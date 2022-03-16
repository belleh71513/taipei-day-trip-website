
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
  const imgContainer = document.querySelector(".img-container")
  const attractionName = document.querySelector(".attraction-name")
  const attractionCategoryMrt = document.querySelector(".attraction-category-mrt")
  const attracionDescription = document.querySelector(".attraction-description")
  const attractionAddressContent = document.querySelector(".attraction-address-content")
  const attractionTransportContent = document.querySelector(".attraction-transport-content")
  const slideIconWrap = document.querySelector(".slide-icon-wrap")




  // 先將圖片render出來
  attData["images"].forEach( imgURL => {
    // 創造img element
    let img = document.createElement("img")
    // 放進 img src
    img.src = imgURL

    // 創造圖片下方圓點
    let slideIcon = document.createElement("div")
    slideIcon.classList.add("slide-icon")

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