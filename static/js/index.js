// ********************取得元素*************************
const secondSection = document.querySelector(".second-section");
const footer = document.querySelector("footer");

// ********************取得資料*************************
// page從 0 開始搜尋
let page = 0 ;
// 未進行搜尋功能時，keyword 設為 null
let keyword = null;
let nextPage;
// let url ;
let data = null ;
let fetching = false ;

async function getData(){
  fetching = true;
  // 判斷有無 keyword 決定 fetch 的網址
  if(keyword){
    url = `/api/attractions?page=${page}&keyword=${keyword}`;
  }else{
    url = `/api/attractions?page=${page}`;
  }
  const response = await fetch(url);
  const result = await response.json();
  data = result
  fetching = false ;
}

// ********************渲染畫面*************************
function renderPage (){
  let attData = data.data;
  nextPage = data.nextPage;
  // 有資料就渲染頁面
  if (attData){
    for(let item of attData){
    gridBox = document.createElement("div");
    gridBox.classList.add("grid-box");

    boxImg = document.createElement("div");
    boxImg.classList.add("box-img");

    imgAnchor = document.createElement("a");
    imgAnchor.classList.add("img-anchor")
    imgAnchor.href = `attraction/${item["id"]}`

    img = document.createElement("img");
    img.src = item.images[0];

    boxText = document.createElement("div");
    boxText.classList.add("box-text");

    attName = document.createElement("div");
    attName.classList.add("att-name");
    attName.textContent = item["name"];

    attTransport = document.createElement("div");
    attTransport.classList.add("att-transport");
    attTransport.textContent = item["mrt"];

    attCategory = document.createElement("div");
    attCategory.classList.add("att-category");
    attCategory.textContent = item["category"];

    boxText.append(attName, attTransport, attCategory);
    imgAnchor.appendChild(img)
    boxImg.appendChild(imgAnchor);
    gridBox.append(boxImg, boxText);
    secondSection.appendChild(gridBox);
    }
  }else{ // 沒有資料就回應找不到的訊息
    searchMessage = document.createElement("h1");
    searchMessage.textContent = `找不到《${keyword}》相關資訊`;
    secondSection.appendChild(searchMessage);
  }
  // 記錄下一頁的資料
  page = nextPage;
}

// ********************頁面初始化************************
async function init(){
  await getData();
  renderPage();
}
init()

const options = {
  rootMargin: "0px 0px 20px 0px",
  threshold:0
};
const callback = (entries, observer) => {
  if(!fetching){
    entries.forEach(entry => {
      if(entry.intersectionRatio > 0 && page){
        init();
      }
      else if(page === null){
        observer.unobserve(footer);
      }
    })
  }else return
}

const observer = new IntersectionObserver(callback, options)
observer.observe(footer)

// ********************監聽事件*************************
const searchAttraction = (e) => {
  e.preventDefault()
  // 從 page 0 開始搜尋
  page = 0;
  keyword = inputVal.value;
  if(secondSection.innerHTML && keyword){
    secondSection.innerHTML = ""
    getData()
    e.stopPropagation()
  }
};

const searchAttractionKeypress = (e) => {
  if (e.keyCode == 13) {
    searchAttraction(e)
  }
}


const inputVal = document.querySelector("#input-val");
const inputBtn = document.querySelector("#input-btn");

// 點擊查詢按鈕
inputBtn.addEventListener("click", searchAttraction);
// 按 enter 查詢
inputVal.addEventListener("keydown", searchAttractionKeypress);



