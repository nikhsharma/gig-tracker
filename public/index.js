const app = function() {
  TicketMasterAPIKey =  // Insert Your API Key Here
  const city = 'Glasgow'

  const cityButton = document.querySelector('#city');
  cityButton.addEventListener('click', function() {

    const city = document.querySelector('#selected-city').value;
    makeRequest(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&size=100&apikey=${TicketMasterAPIKey}`, ticketMasterData);
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

  div.appendChild(artistName);
  div.appendChild(venue);
  return div
}


window.addEventListener('load', app);
