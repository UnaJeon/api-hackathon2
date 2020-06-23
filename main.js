
const searchButton = document.getElementById("searchButton")
const tableRow = document.querySelector('tr')
const tableBody = document.querySelector('tbody')
const main = document.querySelector('div.main')
searchButton.addEventListener('click',getParkList)
const parkPage = document.querySelector('div.parkPage')

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
  console.log(getlist)
  //console.log(getlist[6].images[0].url)
  const parkName = document.createElement('th');
  const parkImg = document.createElement('th');
  const buttonHead = document.createElement('th')

  parkName.textContent = "Park Name"
  parkImg.textContent = "Park Image"
  buttonHead.textContent = "Find Activities"

  tableRow.append(parkName, parkImg, buttonHead)

  tableBody.textContent = ''
  for (let i = 0; i < getlist.length; i++) {
    const tr = document.createElement('tr');
    var parkNameTd = document.createElement('td')
    parkNameTd.textContent = getlist[i].fullName

    const parkImgTd = document.createElement('td')
    const img = document.createElement('img')
    img.setAttribute('src', getlist[i].images[0].url)
    var buttondTd = document.createElement('td')

    const button = document.createElement('button')
    button.setAttribute("id", getlist[i].parkCode)
    button.setAttribute("class", "letsGo")
    button.textContent = "Let's Go"

    tableBody.append(tr);
    buttondTd.append(button)
    tr.append(parkNameTd, parkImgTd, buttondTd)
    parkImgTd.append(img)

    button.addEventListener("click", getPark)
    //const buttonClass =button.className
    }
  function getPark() {
    const table1 = document.getElementById('table1')
    table1.setAttribute("class", "display")
    getActivities()
 }
}

function getActivities(parks){
  const letsGoButton = document.getElementsByClassName("letsGo")[0].id
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
   console.log(activities)
   const paragraph = document.createElement('p')
   paragraph.textContent = description
   const ulList = document.createElement('ul')
   parkPage.append(paragraph,ulList)

   for(let i=0; i<activities.length; i++){
     const list = document.createElement('li')
     list.textContent = parks.data[0].activities[i].name
     ulList.append(list)

   }

}
