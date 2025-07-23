mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker({ color: "black" })
    .setLngLat(coordinates)
    .addTo(map);