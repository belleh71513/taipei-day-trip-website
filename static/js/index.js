




async function getAttImg(page=0) {

  const secondSection = document.querySelector(".secondSection")
  const observerTarget = document.querySelector(".observerTarget")
  // let keyword = null;
  // let url;
  // if(!keyword){
  //   url = `/api/attractions?page=${page}`
  // }
  // else{
  //   url = `/api/attractions?page=${page}&keyword=${keyword}`
  // };


  url = `/api/attractions?page=${page}`

  const response = await fetch(url);
  const data = await response.json();

  attData = data.data
  nextPage = data.nextPage


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
const options = {
  root: secondSection,
  rootMargin: "0px 0px 200px 0px",
  threshold:0
}

const callback = (entries, observer) => {
  entries.forEach(entry => {
    console.log(entry)
    if(entry.isIntersecting){
      if(nextPage){
        getAttImg(nextPage);
      }
    }
  });
}
let observer = new IntersectionObserver(callback, options)
observer.observe(observerTarget)
getAttImg();






