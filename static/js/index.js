
const secondSection = document.querySelector(".secondSection");
const observerTarget = document.querySelector(".observerTarget");
const inputBtn = document.querySelector("#inputBtn");

let page;
let keyword = null;
let nextPage;

async function getData(){
  // keyword = document.querySelector("#inputVal").value
  page = 0
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
  }else if(nextPage === null && page === null){
    searchMessage = document.createElement("h1");
    searchMessage.textContent = `找不到《${keyword}》相關資訊`
    secondSection.appendChild(searchMessage);
  }
  page = nextPage
}

getData();



const options = {
  rootMargin: "0px 0px 10px 0px",
  threshold:0
}

const callback = (entries, observer) => {
  console.log(nextPage)
  console.log(entries)
  entries.forEach(entry => {
    if(entry.intersectionRatio > 0 && nextPage){
      getData();
    }
  });
}
let observer = new IntersectionObserver(callback, options)
observer.observe(observerTarget)

const searchAttraction = () => {
  keyword = document.querySelector("#inputVal").value
  if(secondSection.innerHTML && keyword){
    secondSection.innerHTML = "";
    console.log(page, keyword)
    getData();
  }
}


inputBtn.addEventListener("click",searchAttraction);


