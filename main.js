
const searchButton = document.getElementById("searchButton")
const tableRow = document.querySelector('tr')
const tableBody = document.querySelector('tbody')
const main = document.querySelector('div.main')
searchButton.addEventListener('click',getParkList)

function getParkList(){
  const inputField = document.getElementById("inputField")
  const state = inputField.value;
  $.ajax({
    method: "GET",
    url: "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=dI78ci2wrHGtsbYSYfGzs5d4kgbVX8KZODm1zstV",
    success: parks => {
      getList(parks)
      //console.log(parks)
    },
    error: error => {
      console.log(error)
    }
  })
}
// function removeInput(){

// }


function getList(parks){
  main.setAttribute("class", "display")
  var getlist = parks.data
  // console.log(getlist)
  // console.log(getlist[6].images[0].url)
  var parkName = document.createElement('th');
  var parkImg = document.createElement('th');
  var buttonHead = document.createElement('th')

  parkName.textContent = "Park Name"
  parkImg.textContent = "Park Image"
  buttonHead.textContent = "Find Activities"

  tableRow.append(parkName, parkImg, buttonHead)

  tableBody.textContent = ''
  for (var i = 0; i < getlist.length; i++) {
    var tr = document.createElement('tr');
    var parkNameTd = document.createElement('td')
    parkNameTd.textContent = getlist[i].fullName

    var parkImgTd = document.createElement('td')
    var img = document.createElement('img')
    img.setAttribute('src', getlist[i].images[0].url)
    var buttondTd = document.createElement('td')

    var button = document.createElement('button')
    button.setAttribute("class", getlist[i].parkCode)
    button.textContent = "Let's Go"

    tableBody.append(tr);
    buttondTd.append(button)
    tr.append(parkNameTd, parkImgTd, buttondTd)
    parkImgTd.append(img)

    button.addEventListener("click", getPark)
    function getPark(){
      const table1 = document.getElementById('table1')
      table1.setAttribute("class", "display")


    }
 }
}
