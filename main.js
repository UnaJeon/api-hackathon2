
const searchButton = document.getElementById("searchButton")
const tableRow = document.querySelector('tr')
const tableBody = document.querySelector('tbody')
const main = document.querySelector('div.main')
searchButton.addEventListener('click',getParkList)
const aboutParkName = document.getElementById('parkName')

const currentWeather = document.getElementById('currentWeather')
const parkPage = document.getElementById('parkPage')
const parkInfo= document.getElementById('parkInfo')

const nameOfCity = document.getElementById('nameOfCity')
const moreInfo = document.getElementById('moreInfo')
const activTitle = document.getElementById('activTitle')
const linkToUrl = document.getElementById('linkToUrl')
const tenDayWeather = document.getElementById("tenDayWeather")

function getParkList(){
  const inputField = document.getElementById("inputField")
  const state = inputField.value;
  $.ajax({
    method: "GET",
    url: "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
    success: parks => {
      getList(parks)
    },
    error: error => {
      console.log(error)
    }
  })
}


function getList(parks){
  main.setAttribute("class", "display")

  var getlist = parks.data
  //console.log(getlist)
  //console.log(getlist[6].images[0].url)
  const parkName = document.createElement('th');
  const parkImg = document.createElement('th');
  const buttonHead = document.createElement('th')

  parkName.textContent = "Park Name"
  parkImg.textContent = "Park Image"
  buttonHead.textContent = "Find Activities"

  tableRow.append(parkImg,parkName,  buttonHead)

  tableBody.textContent = ''
  for (let i = 0; i < getlist.length; i++) {
    const tr = document.createElement('tr');
    const parkNameTd = document.createElement('td')
    parkNameTd.textContent = getlist[i].fullName

    const parkImgTd = document.createElement('td')
    const img = document.createElement('img')
    const url = getlist[i].images[0].url
    img.setAttribute('src', url)
    img.setAttribute('class','parkImg')
    const buttondTd = document.createElement('td')

    const button = document.createElement('button')
    button.setAttribute("id", getlist[i].parkCode)
    button.setAttribute("class", "letsGo")
    button.textContent = "Let's Go"

    tableBody.append(tr);
    buttondTd.append(button)
    tr.append(parkImgTd,parkNameTd, buttondTd)
    parkImgTd.append(img)

    button.addEventListener("click", getPark)

    }
  function getPark() {
    const table1 = document.getElementById('table1')
    table1.setAttribute("class", "display")
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
   const activities = parks.data[0].activities
   const description = parks.data[0].description
   const cityName = parks.data[0].addresses[0].city
   aboutParkName.textContent = parks.data[0].fullName
   //console.log(activities)
   const paragraph = document.createElement('p')
   paragraph.textContent = description
   paragraph.setAttribute("class","city")
   paragraph.setAttribute("id", cityName)
   const ulList = document.createElement('ul')
   parkInfo.append(paragraph)
   activTitle.append(ulList)

   for(let i=0; i<activities.length; i++){
     const list = document.createElement('li')
     list.textContent = parks.data[0].activities[i].name
     ulList.append(list)
     linkToUrl.textContent =parks.data[0].url


     linkToUrl.setAttribute('href',parks.data[0].url)
     moreInfo.append(linkToUrl)
   }
   getWeather()
}


function getWeather() {
  const getCityName = document.getElementsByClassName("city")[0].id
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+getCityName+"&units=imperial&appid=44c444f17511a8bb6a7a59dcf93e8f54",
    success: data => {
      console.log(data)
      //console.log(data.main.temp)
      parkPage.classList.remove("display")
      nameOfCity.textContent = getCityName

      currentWeather.textContent = Math.floor(data.main.temp) + " °F"
      const maxWeather = document.getElementById('maxWeather')
      maxWeather.textContent = Math.floor(data.main.temp_max) + " °F"
      const minWeather = document.getElementById('minWeather')
      minWeather.textContent = Math.floor(data.main.temp_min) + " °F"

      const weatherIconText = document.getElementById('weatherIconText')
      weatherIconText.setAttribute('class', data.weather[0].icon)
      const currentWeatherId = weatherIconText.getAttribute('class')
      const forecastImg = document.getElementById('forecastImg')
      const forecastRn = document.createElement('img')
      forecastRn.setAttribute('src', 'http://openweathermap.org/img/wn/' + currentWeatherId + '@2x.png')

      forecastImg.append(forecastRn)
      var latitude = data.coord.lat
      var longitude = data.coord.lon
      // console.log(data.coord.lat)
      // console.log(data.coord.lon)
      getSevenDayWeather(latitude,longitude)

    },
    error: error => {
      console.log(error)
    }

  })
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
    tenDayWeather.append(eachDayWeather)
    weatherIcon.append(weatherIconImg)

  }
}
