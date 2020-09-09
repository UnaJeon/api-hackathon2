
const searchButton = document.getElementById("searchButton")
const frontPage = document.getElementById('frontPage')
searchButton.addEventListener('click',addLoading)
const aboutParkName = document.getElementById('parkName')

const cardSection = document.querySelector("section.cardSection")
const currentWeather = document.getElementById('currentWeather')
const maxWeather = document.getElementById('maxWeather')
const minWeather = document.getElementById('minWeather')

const weatherIcon = document.querySelector('div.weatherIcon')
const forecastImg = document.getElementById('forecastImg')
const box = document.getElementById('box')
const contentBox = document.getElementById('contentBox')
const imgBox = document.getElementById('imgBox')
const parkPage = document.getElementById('parkPage')
// const parkInfo= document.getElementById('parkInfo')

const nameOfCity = document.getElementById('nameOfCity')
const moreInfo = document.getElementById('moreInfo')
const activTitle = document.getElementById('activTitle')
const linkToUrl = document.getElementById('linkToUrl')
const table= document.querySelector('table')
const sevenDayWeather = document.getElementById("sevenDayWeather")
$('.loading-text').hide()

function addLoading(){
  $('.loading-text').show()
  $('.main').hide()
  $('.bg-text').hide()
  getParkList()
}
function getParkList(){
  const inputField = document.getElementById("inputField")
  const state = inputField.value;
  $.ajax({
    method: "GET",
    url: "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
    success: parks => {
      $('.loading-text').hide()
      getList(parks)
    },
    error: error => {
      console.log(error)
    }
  })
}
const postcard = document.getElementById("loading-postcards")
const cards = ["npr-postcards-1.jpg", "npr-postcards-2.jpg", "npr-postcards-3.jpg", "npr-postcards-4.jpg", "npr-postcards-.jpg", "npr-postcards-6.jpg"]
function showPostcards(){
  if ($('.loading-text').show()){
    for(let i=0; i<cards.length; i++){
      postcard.setAttribute('src', 'images/' +cards[i])
    }
  } else if ($('.loading-text').hide()) {
    clearInterval(intervalId)
  }
}
const intervalId =setInterval(showPostcards,1000)
function getList(parks) {
  frontPage.setAttribute("class", "display")
  var getlist = parks.data
  //tableBody.textContent = ''

  for (let i = 0; i < getlist.length; i++) {
    const cardDiv = document.createElement('div')
    cardDiv.setAttribute("class", "card bg-dark text-white")
    // cardDiv.style.height = "20vh"
    const img = document.createElement('img')
    const url = getlist[i].images[0].url
    img.setAttribute('src', url)
    img.setAttribute('class', 'card-img')
    const cardBodyDiv = document.createElement('div')
    cardBodyDiv.setAttribute('class', 'card-img-overlay')
    const cardTitle = document.createElement('h5')
    cardTitle.setAttribute('class', 'card-title')
    cardTitle.textContent = getlist[i].fullName
    // const cardContent = document.createElement('p')
    // cardContent.setAttribute('class', 'card-text')
    // cardContent.textContent = "paragraph"
    cardDiv.setAttribute('id', getlist[i].parkCode)

    cardSection.append(cardDiv)
    cardDiv.append(img, cardBodyDiv)
    cardBodyDiv.append(cardTitle)
    cardDiv.addEventListener("click", getPark)

  }
    function getPark() {
    cardSection.className +=" display"
    console.log("this is the Park id: " +this.id)
    var parkId = this.id
    //console.log(parkId)
    getActivities(parkId)
    }
  }
function getActivities(parkIdParameter){
  const letsGoButton = parkIdParameter
    $.ajax({
      method: "GET",
      url: "https://developer.nps.gov/api/v1/parks?parkCode=" + letsGoButton + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
      success:
        parks => {
          //console.log(parks.data)
          getListOfActivities(parks)
        },
      error: error => {
        console.log(error)
      }
    })
  }

 function getListOfActivities(parks){
   console.log(parks.data)
   const activities = parks.data[0].activities
   const description = parks.data[0].description
   const cityName = parks.data[0].addresses[0].city
   const getParkImg = parks.data[0].images[1].url
   aboutParkName.textContent = parks.data[0].fullName
   //console.log(activities)
   const paragraph = document.createElement('p')
   const parkImage = document.createElement('img')
   parkImage.setAttribute('src',getParkImg)
   parkImage.setAttribute('class', 'parkImage')
   paragraph.textContent = description
   paragraph.setAttribute("class","city")
   paragraph.setAttribute("id", cityName)

   const ulList = document.createElement('ul')
   box.append(imgBox, contentBox)
   contentBox.append(paragraph)

   imgBox.append(parkImage)
   getWeather()
   activTitle.append(ulList)

   for(let i=0; i<activities.length; i++){
     const list = document.createElement('li')
     list.textContent = parks.data[0].activities[i].name
     ulList.append(list)
     linkToUrl.textContent =parks.data[0].url

     linkToUrl.setAttribute('href',parks.data[0].url)
     moreInfo.append(linkToUrl)

   }
}


function getWeather() {
  const getCityName = document.getElementsByClassName("city")[0].id
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+getCityName+"&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success: data => {
      //console.log(data.main.temp)
      parkPage.classList.remove("display")
      nameOfCity.textContent = getCityName
      renderCurrentWeather(data)
    },
    error: error => {
      console.log(error)
    }

  })
}
const sevenDays = document.getElementById("sevenDays")
function renderCurrentWeather(data){
  currentWeather.textContent = Math.floor(data.main.temp) + " °F"
  maxWeather.textContent = "Highest: " + Math.floor(data.main.temp_max) + " °F"
  minWeather.textContent = "Lowest: " + Math.floor(data.main.temp_min) + " °F"

  weatherIcon.setAttribute('class', data.weather[0].icon)
  const currentWeatherId = weatherIcon.getAttribute('class')

  const forecastRn = document.createElement('img')
  forecastRn.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentWeatherId + '@2x.png')

  forecastImg.append(forecastRn)
  var latitude = data.coord.lat
  var longitude = data.coord.lon

   getSevenDayWeather(latitude, longitude)

}

sevenDays.addEventListener('click', showTable)

function showTable(){
  table.classList.toggle('display')
}
function getSevenDayWeather(lat,long){

  $.ajax({
    method:"GET",
    url: "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=current,minutely,hourly&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success:data=>{
      //console.log(data.daily[0].weather[0].main)
      console.log(data)

      renderSevenDayWeather(data)
    },
    error:error=>{
      console.log(error)
    }
  })
}


function renderSevenDayWeather(data){
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
    sevenDayWeather.append(eachDayWeather)
    weatherIcon.append(weatherIconImg)

  }
}
