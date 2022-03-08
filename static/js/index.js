
let page = 0;
let keyword = null;

async function getAttImg() {
  // let url;
  // if(!keyword){
  //   url = `/api/attractions?page=${page}`
  // }
  // else{
  //   url = `/api/attractions?page=${page}&keyword=${keyword}`
  // };
  const secondSection = document.querySelector(".secondSection")

  url = `/api/attractions?page=${page}`

  const response = await fetch(url);
  const data = await response.json();

  attData = data.data

  for(let attItem of attData){


    gridBox = document.createElement("div");
    gridBox.classList.add("gridBox")

    boxImg = document.createElement("div");
    boxImg.classList.add("boxImg");

    img = document.createElement("img");
    img.src = attItem.images[0];

    boxText = document.createElement("div");
    boxText.classList.add("boxText");

    attName = document.createElement("div");
    attName.classList.add("attName");
    attName.textContent = attItem["name"];

    attTransport = document.createElement("div");
    attTransport.classList.add("attTransport");
    attTransport.textContent = attItem["mrt"];

    attCategory = document.createElement("div");
    attCategory.classList.add("attCategory");
    attCategory.textContent = attItem["category"];

    boxText.append(attName, attTransport, attCategory);
    boxImg.appendChild(img);
    gridBox.append(boxImg, boxText);
    secondSection.appendChild(gridBox);
  }
}

getAttImg()


