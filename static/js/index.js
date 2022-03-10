
const secondSection = document.querySelector(".secondSection");
const footer = document.querySelector("footer");
const inputBtn = document.querySelector("#inputBtn");


// page從 0 開始搜尋
let page = 0 ;
let keyword = null;
let nextPage;

async function getData(){
  let url ;
  if(keyword){
    url = `/api/attractions?page=${page}&keyword=${keyword}`
  }else{
    url = `/api/attractions?page=${page}`
  }
  console.log(url)
  const response = await fetch(url);
  const data = await response.json();
  let attData = data.data;
  nextPage = data.nextPage;
  if (attData){
    console.log(attData)
    for(let item of attData){
    console.log(item.name)
    gridBox = document.createElement("div");
    gridBox.classList.add("gridBox")

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
  }else if(nextPage === null){
    searchMessage = document.createElement("h1");
    searchMessage.textContent = `找不到《${keyword}》相關資訊`
    secondSection.appendChild(searchMessage);
  }
  page = nextPage
  console.log(page)
}


const options = {
  rootMargin: "0px 0px 20px 0px",
  threshold:0
}
const callback = (entries, observer) => {

  entries.forEach(entry => {
    if(entry.intersectionRatio > 0 && page){
      getData();
    }
  });
}
let observer = new IntersectionObserver(callback, options)
observer.observe(footer)


const searchAttraction = (e) => {
  // if(page === null){ page = 0}
  page=0
  keyword = document.querySelector("#inputVal").value
  if(secondSection.innerHTML && keyword){
    secondSection.innerHTML = "";
    console.log(page, keyword)
    getData();
    e.stopPropagation()
  }
}

getData();

inputBtn.addEventListener("click", searchAttraction);


