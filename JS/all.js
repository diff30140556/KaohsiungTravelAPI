// 宣告一個空的陣列存放區域。宣告一個空的物件存放資料
let areaArray = [];
let jsonData = {};

// 建立新的XHR連線，資料抓取完執行Load函數
let xhr = new XMLHttpRequest();
// xhr.open('get','https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c',true);
xhr.open('get','https://raw.githubusercontent.com/diff30140556/KaohsiungTravelAPI/main/JS/data.json',true);
xhr.send(null);
xhr.onload = function load(){
  print();

// 監聽網頁滾動，取決內容長度，往下滑到一定部分顯示gototop圖示
  window.onscroll = function(){
    let height = window.document.documentElement.scrollTop;
    let windowHeight = window.document.documentElement.scrollHeight
    let goToTop = document.querySelector('.goToTop');
    let num = '';
    if (windowHeight>2000){
      num=0.54;
    } else if (windowHeight>1400 && windowHeight<2000){
      num=0.3;
    } else{
      num=0.22;
    }
    if (height/windowHeight > num){
      goToTop.classList.add("goToTopAnimation");
    } else {
      goToTop.classList.remove("goToTopAnimation");
    }
  }
}

// 解析資料並丟進空物件，計算資料總數。
function print(){
  let dataContent = JSON.parse(xhr.responseText);
  jsonData = dataContent.result.records;
  let len = jsonData.length;

// 將所有區域從地址的第6、7、8個文字抓取出來並丟入空陣列。
  let noRepeatingZone;

  for (let i=0; i<len; i++){
  let str = jsonData[i].Add;
  let catchAreaName = str.split("")[3]+str.split("")[4]+str.split("")[5];
  areaArray.push(catchAreaName);

// 篩選掉重覆的區域
  noRepeatingZone = areaArray.filter(function(item,index,array){
    return array.indexOf(item)===index;
  });
  }

// 將篩選完的陣列資料放入選單之中，結束後進行網頁初始渲染
  let zoneLen = noRepeatingZone.length;
  let areaList = document.querySelector('.areaList');
  for (let i=0; i<zoneLen; i++){
    let option = document.createElement('option');
    option.textContent = noRepeatingZone[i];
    option.value = noRepeatingZone[i];
    areaList.appendChild(option);
  }
  initialRendering();
}

// 初始渲染。預設呈現第一頁內容，執行三個部分，資料搜索完呈現結果、按照資料總數做分頁、分頁上的樣式
function initialRendering(){
  result(1);
  pagination(1)
  pageColor(1);
}

// 替選單增加監聽器，內容改變後觸發渲染函數
let list = document.querySelector('.list');
let selection = document.querySelector('.selection');
selection.addEventListener('change',initialRendering);

// 搜索結果呈現
let num = [];
function result(num1){
  // 清空num陣列中的資料
  num=[];
  let num2 = (num1-1)*contentLen; //分業的第一筆資料
  let num3 = num1*contentLen; //分業的最後一筆資料
  list.innerHTML = ''; //先清空一次內容
  let len = jsonData.length;
  let area = selection.value;
  let str = '';

// 在下方的小標題顯示目前所選的區域  
  let currentArea = document.querySelector('.currentArea');
  currentArea.textContent = area;
  
// 如果資料的區域等於所選的區域，將此陣列放入num陣列中
  for (let i=0; i<len; i++){
    let zone = jsonData[i].Add;
    let catchAreaName = zone.split("")[3]+zone.split("")[4]+zone.split("")[5];
    if (area === catchAreaName){
      num.push(jsonData[i]);
    }
  }
  
// 若是最後一筆資料超出資料的總數，那最後一筆資料等於資料的總數，不會再繼續往後跑空的資料
  if (num3>num.length){
    num3 = num.length;
  }

// 開始跑搜尋結果
  for (let i=num2; i<num3; i++){
    
// 若是資料中的票價資訊為空，自動放上免費參觀
    if (num[i].Ticketinfo ===''){
      num[i].Ticketinfo = '免費參觀';
    }    

// 將結果放入內容中UL LI底下
    let printAreaName = num[i].Add.split("")[3]+num[i].Add.split("")[4]+num[i].Add.split("")[5];
    let liList = 
    `<li>
      <div class="pic" style="background: url(${num[i].Picture1})center no-repeat;background-size: 110%;">
        <h2>${num[i].Name}</h2>
        <h3>${printAreaName}</h3>
      </div>

      <div class="detail">
        <div class="time">
          <div class="icon">
            <img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="clock_icon" class="clock">
          </div>
          <p>${num[i].Opentime}</p>
        </div>

        <div class="address">
          <div class="icon">
            <img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="pin_icon" class="pin">
          </div>
          <p>${num[i].Add}</p>
        </div>

        <div class="contact">
          <div class="number">
            <div class="icon">
              <img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="phone_icon" class="phone">
            </div>
            <p>${num[i].Tel}</p>
          </div>

          <div class="visit">
            <div class="icon">
              <img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="ticket_icon">
            </div>
            <p>參觀票價詳情<span class="ticketPopInfo">${num[i].Ticketinfo}</span></p>
          </div>
        </div>
      </div>
    </li>`
 
  str += liList;
  }
  list.innerHTML = str;
}

// 預設一頁顯示內容為6筆，點擊頁數觸發換頁
const contentLen = 6;
let page = document.querySelector('.page');
page.addEventListener('click',switchPage);

// 製作分頁頁數
function pagination(currentPage){

  let totalPages = Math.ceil(num.length/contentLen);
  let str = '';
  page.innerHTML = '';

  for (let i=0; i<totalPages; i++){
    // 使用樣板字面值寫法但是此處在li後面換行會造成程式碼錯誤?
    str += 
    `<li><a href="#" class="pagination" data-number="${(i+1)}">${(i+1)}</a></li>`;
    }

  page.innerHTML = `<li><a href="#" data-number="${(currentPage-1)}" class="previousPage">< Prev</a></li>${str}<li><a href="#" data-number="${(currentPage+1)}" class="nextPage">Next ></a></li>`;
   
}

let currentPage = '';

// 換頁，當前頁數前或後沒有資料時不會觸發
function switchPage(e){
  e.preventDefault();
  currentPage = parseInt(e.target.dataset.number);
  let element = e.target.nodeName;
  let totalPages = Math.ceil(num.length/contentLen);

  if (element !== 'A' || currentPage<1 || currentPage>totalPages){
    return;
  }
  result(currentPage);
  pagination(currentPage);
  pageColor(currentPage);

}

// 當前頁數的樣式渲染
function pageColor(e){
  let totalPages = Math.ceil(num.length/contentLen);
  page.childNodes[e].childNodes[0].style.backgroundColor = '#D1BBFF';
  
  switch(true){
    case e===1 && e<totalPages:
      page.childNodes[e-1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      page.childNodes[e-1].childNodes[0].style.textDecoration = 'unset';
      break;
    
    case e===totalPages && e>1:
      page.childNodes[e+1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      page.childNodes[e+1].childNodes[0].style.textDecoration = 'unset';
      break;
      
    case e===1:
      page.childNodes[e-1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      page.childNodes[e+1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      page.childNodes[e+1].childNodes[0].style.textDecoration = 'unset';
      page.childNodes[e-1].childNodes[0].style.textDecoration = 'unset';
      break;
  }
}

// 最後替熱門區域的按鈕加上功能，點擊更改表單區域
let hotlist = document.querySelector('.hotList');

hotlist.addEventListener('click',clickHotList);
function clickHotList(e){
  let selection = document.querySelector('.selection');
  if (e.target.nodeName !== 'BUTTON'){
    return;
  }
  let hotAreaName = e.target.textContent;
  selection.value = hotAreaName;
  initialRendering();
}


