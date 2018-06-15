const app = function() {
  TicketMasterAPIKey =  // Insert Your API Key Here
  const city = 'Glasgow'

  const cityButton = document.querySelector('#city');
  cityButton.addEventListener('click', function() {
    makeRequest(`https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&size=200&apikey=${TicketMasterAPIKey}`, ticketMasterData);
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
  const allEvents = JSON.parse(this.response);
  console.log(allEvents);
}



window.addEventListener('load', app);
