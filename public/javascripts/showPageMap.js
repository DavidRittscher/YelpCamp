
mapboxgl.accessToken = 'pk.eyJ1IjoibWFzdGVybW90byIsImEiOiJjbGNhaGxvNnYyZ242M3BuendkbTRpOXRyIn0.NthuErVgNg0QL3dFUH3Asw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: campground.geometry.coordinates,
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${campground.title}</h6><p>${campground.location}</p>`
            ) // add popup

    )
    .addTo(map)

