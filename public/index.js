const app = function() {
  TicketMasterAPIKey =  // Insert Your API Key Here
  const city = 'Glasgow'

  const mapDiv = document.querySelector('#map');
  const initial = [0, 0];
  const zoomLevel = 1;
  mainMap = new MapWrapper(mapDiv, initial, zoomLevel);


  const cityButton = document.querySelector('#city');
  cityButton.addEventListener('click', function() {
    const city = document.querySelector('#selected-city').value;
    makeRequest(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&size=100&sort=date,asc&classificationName=music&apikey=${TicketMasterAPIKey}`, ticketMasterData)
    ;
  })
}

const makeRequest = function(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback, true);
  request.send();
}

const ticketMasterData = function () {
  if (this.status !== 200) return;
  const events = JSON.parse(this.response)['_embedded'].events;
  populateList(events);
  moveMap(events[0]['_embedded'].venues[0].location);
  populateMarkers(events);
  console.log(events);
  // console.log(Geohash.encode(events[0]['_embedded'].venues[0].location.longitude, events[0]['_embedded'].venues[0].location.latitude,4));
}

const populateList = function(events) {
  const eventSection = document.querySelector('#event-list');
  eventSection.innerHTML = '';
  events.forEach(function(event) {
    const newEvent = createIndividualEvent(event);
    eventSection.appendChild(newEvent);
  });
}

const createIndividualEvent = function(event) {
  const div = document.createElement('div');
  div.classList.add('event')

  const artistName = document.createElement('h3');
  artistName.textContent = event.name;

  const venue = document.createElement('h4');
  venue.textContent = event['_embedded'].venues[0].name;

  const year = event['dates'].start['localDate'].substr(0,4);
  const month = event['dates'].start['localDate'].substr(5,2);
  const day = event['dates'].start['localDate'].substr(8,2);
  const date = document.createElement('p');
  date.textContent = `${day}/${month}/${year}`;


  div.appendChild(artistName);
  div.appendChild(venue);
  div.appendChild(date);
  return div
}

const moveMap = function(coords) {
  mainMap.showCity([coords.latitude, coords.longitude]);
}

const populateMarkers = function(events) {
  for (let key in events) {
    console.log(events[key]['_embedded'].venues[0]);
    const coords = [events[key]['_embedded'].venues[0].location.latitude, events[key]['_embedded'].venues[0].location.longitude];
    mainMap.addMarker(coords, events[key]['_embedded'].venues[0]);
  }
}


window.addEventListener('load', app);
