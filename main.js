const searchButton = document.getElementById("searchButton")
const inputField = document.getElementById("inputField")
searchButton.addEventListener('click',checkStatecode)
const cardSection = document.querySelector("section.cardSection")
const parkPage = document.getElementById('parkPage')
const modal = document.getElementById('modal')
const loader = document.getElementById('loader')
const rowDiv = document.getElementById('rowDiv')
const selectRowDiv2 = document.getElementById('rowDiv2')
loader.classList.add("display")

function checkStatecode() {
  const modalDiv = document.createElement("div")
  modalDiv.setAttribute("class", "modal-overlay")
  const modalSecondDiv = document.createElement("div")
  modalSecondDiv.setAttribute("class", "modal-content")
  const pElement = document.createElement("p")
  pElement.setAttribute("id", "pElement")
  const modalButton = document.createElement("button")
  modalButton.setAttribute("class","btn btn-primary")
  modalButton.textContent = "Close"
  modalSecondDiv.append(pElement, modalButton)
  modalDiv.append(modalSecondDiv)
  modal.append(modalDiv)
  modalButton.addEventListener("click",closeModal)

  const stateCode = ["wa", "or", "ca", "nv", "ak", "az", "nm", "tx", "ut", "co", "wy", "id", "mt", "wy", "nd", "sd", "mn", "mi", "il", "mo", "ar", "tn", "hy", "oh", "in", "va", "nc", "sc", "fl", "me", "as", "hi", "vi"]
  for (let i = 0; i < stateCode.length; i++) {
    if (!inputField.value) {
      const cardSection = document.getElementById("cardSection")
      if(cardSection.firstChild){
        removeParkList()
        removeParkInfo()
        pElement.textContent = "Please fill in the box"
        modal.classList.remove('display')
      }else{
        pElement.textContent = "Please fill in the box"
      }
    } else if (inputField.value !==stateCode[i]) {
      removeParkList()
      removeParkInfo()
      pElement.textContent = "Please write correct state code"
      modal.classList.remove('display')
    }else{
      modal.setAttribute("class","display")
      loader.classList.remove("display")
      getParkList()
      inputField.value = ''
    }
  }
}

function closeModal(){
  modal.setAttribute("class", "display")
}

function getParkList(){
  const state = inputField.value;
  if(!state){
    checkStatecode()
  }
  $.ajax({
    method: "GET",
    url: "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
    success: parks => {
      $('.loader').hide()
      getList(parks)
    },
    error: error => {
      console.log(error)
      handleParklistError()
    }
  })
  removeParkList();
}
function getList(parks) {
  var getlist = parks.data

  for (let i = 0; i < getlist.length; i++) {
    const cardDiv = document.createElement('div')
    cardDiv.setAttribute("class", "card bg-dark text-white")
    const img = document.createElement('img')
    const url = getlist[i].images[0].url
    img.setAttribute('src', url)
    img.setAttribute('class', 'card-img')
    const cardBodyDiv = document.createElement('div')
    cardBodyDiv.setAttribute('class', 'card-img-overlay')
    const cardTitle = document.createElement('h5')
    cardTitle.setAttribute('class', 'card-title')
    cardTitle.textContent = getlist[i].fullName
    cardDiv.setAttribute('id', getlist[i].parkCode)
    cardSection.append(cardDiv)
    cardDiv.append(img, cardBodyDiv)
    cardBodyDiv.append(cardTitle)
    cardDiv.addEventListener("click", getPark)
  }

function getPark() {
    var parkId = this.id
    getActivities(parkId)
    setTimeout(()=> {
    document.getElementById('parkPage').scrollIntoView({ behavior: 'smooth' })
    },700)

  removeParkInfo()
   }
  }

function getActivities(parkIdParam){
  const letsGoButton = parkIdParam
    $.ajax({
      method: "GET",
      url: "https://developer.nps.gov/api/v1/parks?parkCode=" + letsGoButton + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
      success:
        parks => {
          getParkInfo(parks)
          getListOfActivities(parks)
        },
      error: error => {
        console.log(error)
      }
    })
  }

function getParkInfo(parks){
    const description = parks.data[0].description
    const cityName = parks.data[0].addresses[0].city
    const getParkImg = parks.data[0].images[0].url
    const parkName = parks.data[0].fullName
    const parkNameTitle = document.createElement('h3')
    parkNameTitle.setAttribute("class","parkTitle pt-4")
    parkNameTitle.textContent = parkName
    const topContainerDiv = document.createElement("div")
    topContainerDiv.setAttribute("id", "top-container")
    topContainerDiv.setAttribute("class", "top-container")
    const imgbox = document.createElement("div")
    imgbox.setAttribute("class", "imgbox")
    const contentBox = document.createElement('div')
    contentBox.setAttribute("class", "contentBox")
    const paragraph = document.createElement('p')
    const parkImage = document.createElement('img')
    parkImage.setAttribute('src', getParkImg)
    parkImage.setAttribute('class', 'parkImage')
    paragraph.textContent = description
    paragraph.setAttribute("class", "city")
    paragraph.setAttribute("id", cityName)
    const weather = document.createElement('div')
    weather.setAttribute("class", "weather")
    const cityDiv = document.createElement("div")
    cityDiv.setAttribute("id", "nameOfCity")
    const tempDiv = document.createElement('div')
    tempDiv.setAttribute("class", "temp")
    tempDiv.setAttribute("id", "currentWeather")
    const weatherIconDiv = document.createElement('div')
    weatherIconDiv.setAttribute('id', "forecastImg")
    const maxDiv = document.createElement("div")
    const minDiv = document.createElement("div")
    maxDiv.setAttribute("id", "maxWeather")
    minDiv.setAttribute("id", "minWeather")
    const moreInfoP = document.createElement('p')
    moreInfoP.textContent = "Visit Website for More Info: "
    const link = document.createElement("a")
    link.setAttribute("target", "_blank")
    link.setAttribute("href", parks.data[0].url)
    link.textContent = parks.data[0].url

    moreInfoP.append(link)
    weather.append(cityDiv, tempDiv, weatherIconDiv, maxDiv, minDiv)
    imgbox.append(parkImage)
    topContainerDiv.append(weather,imgbox, contentBox)
    contentBox.append(paragraph)
    rowDiv.append(parkNameTitle, topContainerDiv, moreInfoP)
    parkPage.append(rowDiv)
    getWeather()
}

 function getListOfActivities(parks){

    const activities = parks.data[0].activities
    const activitiesDiv = document.createElement('div')
    activitiesDiv.setAttribute("class", "activities d-flex")
    activitiesDiv.setAttribute("id", "activities")
    const activityTitle = document.createElement('h4')
    activityTitle.textContent = "Activities You Can Do..."
    activitiesDiv.append(activityTitle)
    const ulList = document.createElement('ul')
    activityTitle.append(ulList)
    for (let i = 0; i < activities.length; i++) {
      const list = document.createElement('li')
      list.textContent = parks.data[0].activities[i].name
      ulList.append(list)
    }
    parkPage.append(selectRowDiv2)
    selectRowDiv2.append(activitiesDiv)

}

function getWeather() {
  const getCityName = document.getElementsByClassName("city")[0].id
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+getCityName+"&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success: data => {
      //console.log(data.main.temp)
      parkPage.classList.remove("display")
      const nameOfCity = document.getElementById('nameOfCity')
      nameOfCity.textContent = getCityName
      renderCurrentWeather(data)
    },
    error: error => {
      console.log(error)
    }
  })
}

function renderCurrentWeather(data){
  const currentWeather = document.getElementById('currentWeather')
  const maxWeather = document.getElementById('maxWeather')
  const minWeather = document.getElementById('minWeather')
  currentWeather.textContent = Math.floor(data.main.temp) + " °F"
  maxWeather.textContent = "Highest: " + Math.floor(data.main.temp_max) + " °F"
  minWeather.textContent = "Lowest: " + Math.floor(data.main.temp_min) + " °F"
  const weatherIcon = document.getElementById('forecastImg')

  weatherIcon.setAttribute('class', data.weather[0].icon)
  const currentWeatherId = weatherIcon.getAttribute('class')

  const forecastRn = document.createElement('img')
  forecastRn.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentWeatherId + '@2x.png')

  weatherIcon.append(forecastRn)
  var latitude = data.coord.lat
  var longitude = data.coord.lon

  getSevenDayWeather(latitude, longitude)
}

function getSevenDayWeather(lat,long){
  $.ajax({
    method:"GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=current,minutely,hourly&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success:data=>{
      renderSevenDayWeather(data)
    },
    error:error=>{
      console.log(error)
    }
  })
}

function renderSevenDayWeather(data){
  const sevenDaysTable = document.createElement("div")
  sevenDaysTable.setAttribute("class", "sevenDayTable d-flex")
  const weatherTable = document.createElement("table")
  weatherTable.setAttribute("class", "table")
  const thead = document.createElement('thead')
  const tr = document.createElement("tr")
  const dayth = document.createElement("th")
  const highth = document.createElement("th")
  const lowth = document.createElement("th")
  const weatherth = document.createElement("th")
  const forecastth = document.createElement("th")
  dayth.textContent = "Day"
  highth.textContent ="High"
  lowth.textContent = "Low"
  weatherth.textContent = "Weather"
  forecastth.textContent = "Forecast"
  const tbody = document.createElement("tbody")
  tbody.setAttribute("id", "sevenDayWeather")
  tr.append(dayth,highth,lowth,weatherth,forecastth)
  thead.append(tr)
  weatherTable.append(thead,tbody)
  sevenDaysTable.append(weatherTable)
  const rowDiv2 = document.getElementById('rowDiv2')
  rowDiv2.append(sevenDaysTable)

  for (let i=0;i<data.daily.length; i++){
    const eachDayWeather = document.createElement('tr')
    const max10Weather =document.createElement('td')
    max10Weather.textContent = Math.floor(data.daily[i].temp.max) + "°F"
    const min10Weather= document.createElement('td')
    min10Weather.textContent = Math.floor(data.daily[i].temp.min) + "°F"
    const weatherCondition = document.createElement('td')
    weatherCondition.textContent = data.daily[i].weather[0].main
    const dayofWeather =document.createElement('td')

    var day = new Date((data.daily[i].dt) * 1000)
    var dayArray =['Sun','Mon','Tue','Wed','Thur','Fri','Sat','Sun']
    var getDay = dayArray[day.getDay()]
    dayofWeather.textContent = getDay
    const weatherIcon = document.createElement('td')
    const weatherIconImg = document.createElement('img')
    weatherIcon.setAttribute('id', data.daily[i].weather[0].icon)
     var weatherId = weatherIcon.getAttribute('id')
    weatherIconImg.setAttribute('src', 'http://openweathermap.org/img/wn/'+weatherId+'@2x.png')
    eachDayWeather.append(dayofWeather,max10Weather,min10Weather,weatherCondition,weatherIcon)
    tbody.append(eachDayWeather)
    weatherIcon.append(weatherIconImg)
  }
}

function removeParkList() {
  while (cardSection .firstElementChild) {
    cardSection.firstElementChild.remove()
  }
}

function removeParkInfo(){
let rowDiv = document.getElementById("rowDiv")
while(rowDiv.firstChild){
rowDiv.removeChild(rowDiv.lastChild)
}
let rowDiv2 = document.getElementById("rowDiv2")
while(rowDiv2.firstChild){
  rowDiv2.removeChild(rowDiv2.lastChild)
}
}
function handleParklistError(){
  if(loader){
    loader.classList.add("display")
  }
parkPage.classList.remove("display")
var errorDiv = document.createElement('div')
var errorParagraph = document.createElement('p')
errorDiv.setAttribute("class", "error")
errorParagraph.textContent = "National Parks could not be retrieved. Please try again."
errorDiv.append(errorParagraph)
rowDiv.append(errorDiv)
}
