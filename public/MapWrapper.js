const MapWrapper = function(element, coords, zoom) {
  const osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  this.map = L.map(element)
  .addLayer(osmLayer)
  .setView(coords, zoom);
  this.map.options.minZoom = 2
}

MapWrapper.prototype.showCity = function(coords) {
  this.map.flyTo(coords, 11);
}

MapWrapper.prototype.addMarker = function(coords, venue, venueLink) {
  L.marker(coords, {title: venue.name}).addTo(this.map).bindPopup(venueLink);
  // const marker = L.marker(coords, ).addTo(this.map)

}
