
const secondSection = document.querySelector(".secondSection");
const footer = document.querySelector("footer");


// page從 0 開始搜尋
let page = 0 ;
// 未進行搜尋功能時，keyword 設為 null
let keyword = null;
let nextPage;
// let url ;
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
  const data = await response.json();
  let attData = data.data;
  nextPage = data.nextPage;
  // 有資料就渲染頁面
  if (attData){
    for(let item of attData){
    gridBox = document.createElement("div");
    gridBox.classList.add("gridBox");

    boxImg = document.createElement("div");
    boxImg.classList.add("boxImg");

    img = document.createElement("img");
    img.src = item.images[0];

    boxText = document.createElement("div");
    boxText.classList.add("boxText");

    attName = document.createElement("div");
    attName.classList.add("attName");
    attName.textContent = item["name"];

    attTransport = document.createElement("div");
    attTransport.classList.add("attTransport");
    attTransport.textContent = item["mrt"];

    attCategory = document.createElement("div");
    attCategory.classList.add("attCategory");
    attCategory.textContent = item["category"];

    boxText.append(attName, attTransport, attCategory);
    boxImg.appendChild(img);
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
  fetching = false ;
}

const options = {
  rootMargin: "0px 0px 20px 0px",
  threshold:0
};
const callback = (entries, observer) => {
  console.log(entries, page)
  if(!fetching){
    entries.forEach(entry => {
      if(entry.intersectionRatio > 0 && page){
        getData();
      }
      else if(page === null){
        observer.unobserve(footer);
      }
    })
  }else{
    return
  }

}

const observer = new IntersectionObserver(callback, options)
observer.observe(footer)


const searchAttraction = (e) => {
  e.preventDefault()
  // 從 page 0 開始搜尋
  page = 0;
  keyword = document.querySelector("#inputVal").value;
  if(secondSection.innerHTML && keyword){
    secondSection.innerHTML = ""
    getData()
    e.stopPropagation()
  }
};

const searchAttractionKeypress = (e) => {
  if (e.keyCode == 13) {
    searchAttraction(e)
  }else{return}
}

getData();

const inputVal = document.querySelector("#inputVal");
const inputBtn = document.querySelector("#inputBtn");


inputBtn.addEventListener("click", searchAttraction);
inputVal.addEventListener("keydown", searchAttractionKeypress);



