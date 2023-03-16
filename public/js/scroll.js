currentPage = 1;
let pageCount = Math.ceil(elemdb/30);

const handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (endOfPage) {
      currentPage++;
      appendContent(currentPage)
    }
    if (currentPage >= pageCount) {
      removeInfiniteScroll();
    }
    console.log(pageCount);
    
};

const removeInfiniteScroll = () => {
  window.removeEventListener("scroll", handleInfiniteScroll);
};

function appendContent(page){
  const divShowData = document.getElementById("hely");
  myData = getData("/cars/"+page);
  myData.then(result => {
    divShowData.innerHTML+=result;
  })
}
async function getData(url){ 
    res = await fetch(url,{
        method: 'GET'
    }
    )
   return res.text();
}

window.addEventListener("scroll", handleInfiniteScroll);  