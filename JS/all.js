// 宣告一個空的陣列存放區域。宣告一個空的物件存放資料
var areaArray = [];
var jsonData = {};

// 建立新的XHR連線，資料抓取完執行Load函數
var xhr = new XMLHttpRequest();
xhr.open('get','https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c',true);
xhr.send(null);
xhr.onload = function load(){
  print();

// 監聽網頁滾動，取決內容長度，往下滑到一定部分顯示gototop圖示
  window.onscroll = function(){
    var height = window.document.documentElement.scrollTop;
    var windowHeight = window.document.documentElement.scrollHeight
    var goToTop = document.querySelector('.goToTop');
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
  var dataContent = JSON.parse(xhr.responseText);
  jsonData = dataContent.data.XML_Head.Infos.Info;
  var len = jsonData.length;

// 將所有區域從地址的第6、7、8個文字抓取出來並丟入空陣列。
  let noRepeatingZone;

  for (let i=0; i<len; i++){
  let str = jsonData[i].Add;
  var catchAreaName = str.split("")[6]+str.split("")[7]+str.split("")[8];
  areaArray.push(catchAreaName);

// 篩選掉重覆的區域
  noRepeatingZone = areaArray.filter(function(item,index,array){
    return array.indexOf(item)===index;
  });
  }

// 將篩選完的陣列資料放入選單之中，結束後進行網頁初始渲染
  var zoneLen = noRepeatingZone.length;
  var areaList = document.querySelector('.areaList');
  for (let i=0; i<zoneLen; i++){
    var option = document.createElement('option');
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
var list = document.querySelector('.list');
var selection = document.querySelector('.selection');
selection.addEventListener('change',initialRendering);

// 搜索結果呈現
function result(num1){
  num = [];
  var num2 = (num1-1)*contentLen; //分業的第一筆資料
  var num3 = num1*contentLen; //分業的最後一筆資料
  list.innerHTML = ''; //先清空一次內容
  var len = jsonData.length;
  var area = selection.value;
  var str = '';

// 在下方的小標題顯示目前所選的區域  
  var currentArea = document.querySelector('.currentArea');
  currentArea.textContent = area;
  
// 如果資料的區域等於所選的區域，將此陣列放入num陣列中
  for (let i=0; i<len; i++){
    let zone = jsonData[i].Add;
    var catchAreaName = zone.split("")[6]+zone.split("")[7]+zone.split("")[8];
    if (area == catchAreaName){
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
    if (num[i].Ticketinfo ==''){
      num[i].Ticketinfo = '免費參觀';
    }    

// 將結果放入內容中UL LI底下
    var printAreaName = num[i].Add.split("")[6]+num[i].Add.split("")[7]+num[i].Add.split("")[8];
    var liList = '<li><div class="pic" style="background: url('+num[i].Picture1+')center no-repeat;background-size: 110%;"><h2>'+num[i].Name+'</h2><h3>'+printAreaName+'</h3></div><div class="detail"><div class="time"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="clock_icon" class="clock"></div><p>'+num[i].Opentime+'</p></div><div class="address"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="pin_icon" class="pin"></div><p>'+num[i].Add+'</p></div><div class="contact"><div class="number"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="phone_icon" class="phone"></div><p>'+num[i].Tel+'</p></div><div class="visit"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="ticket_icon"></div><p>參觀票價詳情<span class="ticketPopInfo">'+num[i].Ticketinfo+'</span></p></div></div></div></li>'
 
  str += liList;
  }
  list.innerHTML = str +'<div class="goToTopBox"><a href="#top" class="goToTop"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/btn_goTop.png" alt="goToTopIcon"></a></div>';
}

// 預設一頁顯示內容為6筆，點擊頁數觸發換頁
var contentLen = 6;
var page = document.querySelector('.page');
page.addEventListener('click',switchPage);

// 製作分頁頁數
function pagination(currentPage){
  var totalPages = Math.ceil(num.length/contentLen);
  var str = '';
  page.innerHTML = '';

  for (var i=0; i<totalPages; i++){
    str += '<li><a href="#" class="pagination" data-number="'+(i+1)+'">'+(i+1)+'</a></li>';
    }
  
    switch(true){
      case currentPage==1:
        page.innerHTML = '<li><a href="#" data-number="'+(currentPage-1)+'">< Prev</a></li>'+str+'<li><a href="#" data-number="'+(currentPage+1)+'" class="nextPage">Next ></a></li>';
        break;
      case currentPage>1 && currentPage<totalPages:
        page.innerHTML = '<li><a href="#" data-number="'+(currentPage-1)+'" class="previousPage">< Prev</a></li>'+str+'<li><a href="#" data-number="'+(currentPage+1)+'" class="nextPage">Next ></a></li>';
        break;
      case currentPage==totalPages:
        page.innerHTML = '<li><a href="#" data-number="'+(currentPage-1)+'" class="previousPage">< Prev</a></li>'+str+'<li><a href="#" data-number="'+(currentPage+1)+'">Next ></a></li>';
        break;}
}

var currentPage = '';

// 換頁，當前頁數前或後沒有資料時不會觸發
function switchPage(e){
  e.preventDefault();
  currentPage = parseInt(e.target.dataset.number);
  var element = e.target.nodeName;
  var totalPages = Math.ceil(num.length/contentLen);

  if (element !== 'A' || currentPage<1 || currentPage>totalPages){
    return;
  }
  result(currentPage);
  pagination(currentPage);
  pageColor(currentPage);

}

// 當前頁數的樣式渲染
function pageColor(e){
  var totalPages = Math.ceil(num.length/contentLen);
  page.childNodes[e].childNodes[0].style.backgroundColor = '#D1BBFF';
  
  switch(true){
    case e==1:
      page.childNodes[e-1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      break;
    
    case e==totalPages:
      page.childNodes[e+1].childNodes[0].style.color = 'rgba(74,74,74,0.5)';
      break;
  }
}

// 最後替熱門區域的按鈕加上功能，點擊更改表單區域
var hotlist = document.querySelector('.hotList');

hotlist.addEventListener('click',clickHotList);
function clickHotList(e){
  var selection = document.querySelector('.selection');
  if (e.target.nodeName !== 'BUTTON'){
    return;
  }
  var hotAreaName = e.target.textContent;
  selection.value = hotAreaName;
  initialRendering();
}


