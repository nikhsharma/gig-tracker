const app = function() {
  TicketMasterAPIKey = // Insert Your API Key Here
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
  // console.log(Geohash.encode(events[0]['_embedded'].venues[0].location.longitude, events[0]['_embedded'].venues[0].location.latitude,4));
}

const populateList = function(events) {
  const eventSection = document.querySelector('#event-list');
  eventSection.innerHTML = '';
  events.forEach(function(event) {
    eventSection.appendChild(createIndividualEvent(event));
  });
}

const createIndividualEvent = function(event) {
  const div = document.createElement('div');
  div.classList.add('event')
  if (event['_embedded'].venues[0].images) {
    div.style.background = event['_embedded'].venues[0].images[0];
  }
  div.appendChild(createArtistName(event));
  div.appendChild(createVenue(event));
  div.appendChild(createDate(event));
  div.appendChild(createButton(event));

  return div
}

const createArtistName = function(event) {
  const artistName = document.createElement('h3');
  artistName.textContent = event.name;
  return artistName;
}

const createVenue = function(event) {
  const venue = document.createElement('h4');
  venue.textContent = event['_embedded'].venues[0].name;
  return venue;
}

const createDate = function(event) {
  const year = event['dates'].start['localDate'].substr(0,4);
  const month = event['dates'].start['localDate'].substr(5,2);
  const day = event['dates'].start['localDate'].substr(8,2);
  const date = document.createElement('p');
  date.textContent = `${day}/${month}/${year}`;
  return date;
}

const createButton = function(event) {
  const button = document.createElement('button');
  button.textContent = 'Show More'
  button.addEventListener('click', function() {
    const selected = document.querySelector('#selected');
    populateSelected(selected, event);
  })
  return button;
}

const populateSelected = function(selected, event) {
  selected.innerHTML = '';
  selected.appendChild(createArtistName(event));
  if (event['_embedded'].attractions) {
    selected.appendChild(createArtistImg(event));
  }


  selected.appendChild(createVenue(event));
  const button = document.createElement('button');
  button.textContent = `All Events Here (${event['_embedded'].venues[0].upcomingEvents._total})`
  button.addEventListener('click', function() {
    makeRequest(`https://app.ticketmaster.com/discovery/v2/events.json?venueId=${event['_embedded'].venues[0].id}&size=${event['_embedded'].venues[0].upcomingEvents._total}&sort=date,asc&classificationName=music&apikey=${TicketMasterAPIKey}`, ticketMasterData)
  })
  selected.appendChild(button);
  selected.appendChild(createDate(event));

  return selected;
}

const createArtistImg = function(event) {
  const img = document.createElement('img');
  if (event['_embedded'].attractions[0].images) {
    img.src = event['_embedded'].attractions[0].images[0].url;
    img.height = 100;
  }
  return img;
}

const moveMap = function(coords) {
  mainMap.showCity([coords.latitude, coords.longitude]);
}

const populateMarkers = function(events) {
  for (let key in events) {
    if (events[key]['_embedded'].venues[0].location) {
      const coords = [events[key]['_embedded'].venues[0].location.latitude, events[key]['_embedded'].venues[0].location.longitude];

      const venueLink = document.createElement('button');
      venueLink.textContent = `${events[key]['_embedded'].venues[0].name}: Show All Events Here (${events[key]['_embedded'].venues[0].upcomingEvents._total})`;
      venueLink.addEventListener('click', function() {
        makeRequest(`https://app.ticketmaster.com/discovery/v2/events.json?venueId=${events[key]['_embedded'].venues[0].id}&size=${events[key]['_embedded'].venues[0].upcomingEvents._total}&sort=date,asc&classificationName=music&apikey=${TicketMasterAPIKey}`, ticketMasterData)
      })

      // const venueLink = events[key]['_embedded'].venues[0].upcomingEvents._total
      mainMap.addMarker(coords, events[key]['_embedded'].venues[0], venueLink);
    }
  }
}

window.addEventListener('load', app);
