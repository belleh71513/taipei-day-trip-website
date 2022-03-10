

// const options = {
//   // root: secondSection,
//   rootMargin: "0px 0px 200px 0px",
//   threshold:0
// }
// const callback = (entries, observer) => {
//   entries.forEach(entry => {
//     if(entry.intersectionRatio > 0){
//       async(page, keyword=null) => {
//         if(keyword){
//           url = `/api/attractions?page=${page}&keyword=${keyword}`
//         }else{
//           url = `/api/attractions?page=${page}`
//         }
//         const response = await fetch(url);
//         const data = await response.json();
//         attData = data.data
//         nextPage = data.nextPage
//         createEle(attData);
//       }
//     }
//   })
// }
// let observer = new IntersectionObserver(callback, options)
// observer.observe(observerTarget)

// getData();

// .then(nextPage => {
//   const options = {
//         // root: secondSection,
//         rootMargin: "0px 0px 200px 0px",
//         threshold:0
//       }
//       const callback = (entries, observer) => {
//         entries.forEach(entry => {
//           if(entry.intersectionRatio > 0){
//             const nextPageData = (async () =>{
//              await getData(nextPage)
//             })()
//             const newPage = createEle(nextPageData.nextPage)
//             }
//           })

//       }
//       let observer = new IntersectionObserver(callback, options)
//       observer.observe(observerTarget)
// })



// (async () =>{

// })()

// const createNextPage = nextPage =>{
//   const options = {
//     // root: secondSection,
//     rootMargin: "0px 0px 200px 0px",
//     threshold:0
//   }
//   const callback = (entries, observer) => {
//     entries.forEach(entry => {
//       if(entry.intersectionRatio > 0){
//         (async () =>{
//           console.log(await getData())
//         })
//         }
//       })
//   }
//   let observer = new IntersectionObserver(callback, options)
//   observer.observe(observerTarget)
// }


const secondSection = document.querySelector(".secondSection");
const observerTarget = document.querySelector(".observerTarget");
const inputBtn = document.querySelector("#inputBtn");

let keyword ;
let nextPage;
let url;
let page = 0;

async function getData(page=0, keyword=null){
  keyword = document.querySelector("#inputVal").value
  if(keyword){
    url = `/api/attractions?page=${page}&keyword=${keyword}`
  }else{
    url = `/api/attractions?page=${page}`
  }
  const response = await fetch(url);
  const data = await response.json();
  let attData = data.data;
  nextPage = data.nextPage;

  if (attData){
    for(let item of attData){
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
  }else{
    result = document.createElement("h1");
    result.textContent = "查無此景點相關資料"
    secondSection.appendChild(result);
  }
}

getData();


const options = {
  rootMargin: "0px 0px 200px 0px",
  threshold:0
}

const callback = (entries, observer) => {
  entries.forEach(entry => {
    if(entry.intersectionRatio > 0){
      if(nextPage){
        getData(nextPage,keyword);
      }
    }
  });
}
let observer = new IntersectionObserver(callback, options)
observer.observe(observerTarget)


const searchAttraction = e => {
  if(secondSection.innerHTML){
    secondSection.innerHTML = "";
    getData(page,keyword);
  }
}


inputBtn.addEventListener("click",searchAttraction);



// const createEle = (attData) =>{
//   for(let item of attData){
//     gridBox = document.createElement("div");
//     gridBox.classList.add("gridBox")

//     boxImg = document.createElement("div");
//     boxImg.classList.add("boxImg");

//     img = document.createElement("img");
//     img.src = item.images[0];

//     boxText = document.createElement("div");
//     boxText.classList.add("boxText");

//     attName = document.createElement("div");
//     attName.classList.add("attName");
//     attName.textContent = item["name"];

//     attTransport = document.createElement("div");
//     attTransport.classList.add("attTransport");
//     attTransport.textContent = item["mrt"];

//     attCategory = document.createElement("div");
//     attCategory.classList.add("attCategory");
//     attCategory.textContent = item["category"];

//     boxText.append(attName, attTransport, attCategory);
//     boxImg.appendChild(img);
//     gridBox.append(boxImg, boxText);
//     secondSection.appendChild(gridBox);
//   }
// }








// async function getAttImg(page=0) {

//   const secondSection = document.querySelector(".secondSection")
//   const observerTarget = document.querySelector(".observerTarget")
  // let keyword = null;
  // let url;
  // if(!keyword){
  //   url = `/api/attractions?page=${page}`
  // }
  // else{
  //   url = `/api/attractions?page=${page}&keyword=${keyword}`
  // };


//   url = `/api/attractions?page=${page}`

//   const response = await fetch(url);
//   const data = await response.json();

//   attData = data.data
//   nextPage = data.nextPage


//   for(let item of attData){
//     gridBox = document.createElement("div");
//     gridBox.classList.add("gridBox")

//     boxImg = document.createElement("div");
//     boxImg.classList.add("boxImg");

//     img = document.createElement("img");
//     img.src = item.images[0];

//     boxText = document.createElement("div");
//     boxText.classList.add("boxText");

//     attName = document.createElement("div");
//     attName.classList.add("attName");
//     attName.textContent = item["name"];

//     attTransport = document.createElement("div");
//     attTransport.classList.add("attTransport");
//     attTransport.textContent = item["mrt"];

//     attCategory = document.createElement("div");
//     attCategory.classList.add("attCategory");
//     attCategory.textContent = item["category"];

//     boxText.append(attName, attTransport, attCategory);
//     boxImg.appendChild(img);
//     gridBox.append(boxImg, boxText);
//     secondSection.appendChild(gridBox);
//   }

// }



// getAttImg()


// const options = {
//   // root: secondSection,
//   rootMargin: "0px 0px 200px 0px",
//   threshold:0
// }

// const callback = (entries, observer) => {
//   entries.forEach(entry => {
//     if(entry.intersectionRatio > 0){
//       if(nextPage){
//         getAttImg(nextPage);
//       }
//     }
//   });
// }
// let observer = new IntersectionObserver(callback, options)
// observer.observe(observerTarget)
// console.log(nextPage)

