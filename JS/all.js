var xhr = new XMLHttpRequest();
xhr.open('get','https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c',true);
xhr.send(null);

var areaArray = [];
var jsonData = {};

xhr.onload = function load(){
  print();
}

function print(){
  
  var dataContent = JSON.parse(xhr.responseText);
  jsonData = dataContent.data.XML_Head.Infos.Info;
  var len = jsonData.length;

  let noRepeatingZone;

  for (let i=0; i<len; i++){
  let str = jsonData[i].Add;
  var catchAreaName = str.split("")[6]+str.split("")[7]+str.split("")[8];
  areaArray.push(catchAreaName);

  noRepeatingZone = areaArray.filter(function(item,index,array){
    return array.indexOf(item)===index;
  });
  }
  

  var areaList = document.querySelector('.areaList');

  var zoneLen = noRepeatingZone.length;
  for (let i=0; i<zoneLen; i++){
    
    var option = document.createElement('option');
    option.textContent = noRepeatingZone[i];
    option.value = noRepeatingZone[i];
    areaList.appendChild(option);
  }
  initialRendering();
  }


var list = document.querySelector('.list');
var selection = document.querySelector('.selection');
selection.addEventListener('change',initialRendering);

function initialRendering(){
  result(1);
  pagination(1)
  pageColor(1);
}

function result(num1){
  num = [];
  var num2 = (num1-1)*contentLen;
  var num3 = num1*contentLen;
  list.innerHTML = '';

  var len = jsonData.length;
  var area = selection.value;
  var currentArea = document.querySelector('.currentArea');

  var str = '';

  currentArea.textContent = area;
  for (let i=0; i<len; i++){
    let zone = jsonData[i].Add;
    var catchAreaName = zone.split("")[6]+zone.split("")[7]+zone.split("")[8];
    if (area == catchAreaName){

      num.push(jsonData[i]);
    }
  } 

  if (num3>num.length){
    num3 = num.length;
  }

  for (let i=num2; i<num3; i++){

    if (num[i].Ticketinfo ==''){
      num[i].Ticketinfo = '免費參觀';
    }    

    var printAreaName = num[i].Add.split("")[6]+num[i].Add.split("")[7]+num[i].Add.split("")[8];

    var liList = '<li><div class="pic" style="background: url('+num[i].Picture1+')center no-repeat;background-size: 110%;"><h2>'+num[i].Name+'</h2><h3>'+printAreaName+'</h3></div><div class="detail"><div class="time"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_clock.png" alt="clock_icon" class="clock"></div><p>'+num[i].Opentime+'</p></div><div class="address"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_pin.png" alt="pin_icon" class="pin"></div><p>'+num[i].Add+'</p></div><div class="contact"><div class="number"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_phone.png" alt="phone_icon" class="phone"></div><p>'+num[i].Tel+'</p></div><div class="visit"><div class="icon"><img src="https://hexschool.github.io/JavaScript_HomeWork/assets/icons_tag.png" alt="ticket_icon"></div><p>參觀票價詳情<span class="ticketPopInfo">'+num[i].Ticketinfo+'</span></p></div></div></div></li>'
 
  str += liList;
  }

  list.innerHTML = str;
  
}

var contentLen = 6;
var page = document.querySelector('.page');
page.addEventListener('click',switchPage);


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

var hotlist = document.querySelector('.hotList');

hotlist.addEventListener('click',test);
function test(e){
  var selection = document.querySelector('.selection');
  if (e.target.nodeName !== 'BUTTON'){
    return;
  }
  var hotAreaName = e.target.textContent;
  selection.value = hotAreaName;
  initialRendering();
}