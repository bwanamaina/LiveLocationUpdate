const position = { latitude: -1.300355, longitude: 36.77385 };
const deltas = 100;
const delay = 10; //milliseconds
let index = 0;
let deltaLat;
let deltaLng;
let map;
let marker;
let interval = 5000;

const locations = [
	{ latitude: '-1.300355', longitude: '36.773850' },
	{ latitude: '-1.300184', longitude: '36.776811' },
	{ latitude: '-1.299840', longitude: '36.779386' },
	{ latitude: '-1.298897', longitude: '36.779407' },
	{ latitude: '-1.299004', longitude: '36.777841' },
	{ latitude: '-1.298982', longitude: '36.776811' },
	{ latitude: '-1.297459', longitude: '36.776747' },
	{ latitude: '-1.296193', longitude: '36.776726' },
	{ latitude: '-1.296097', longitude: '36.779236' },
	{ latitude: '-1.296151', longitude: '36.777637' },
	{ latitude: '-1.296215', longitude: '36.776693' },
	{ latitude: '-1.294252', longitude: '36.776586' },
	{ latitude: '-1.294048', longitude: '36.776790' },
	{ latitude: '-1.293973', longitude: '36.779118' },
	{ latitude: '-1.292622', longitude: '36.779075' },
	{ latitude: '-1.291844', longitude: '36.779049' },
	{ latitude: '-1.291879', longitude: '36.778389' },
];

const initialize = () => {
	const latlng = new google.maps.LatLng(locations[0].latitude, locations[0].longitude);
	const options = {
		zoom: 16,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	map = new google.maps.Map(window.document.getElementById('map'), options);
	marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'Latitude:' + position.latitude + ' | Longitude:' + position.longitude,
		//icon: 'https://images.sendyit.com/web_platform/vendor_type/top/2.svg',
	});
	const infowindow = new google.maps.InfoWindow({
		maxWidth: 1500,
	});
	infowindow.setContent('Not drawing route, just animating...');
	infowindow.open(map, marker);
	google.maps.event.addListener(marker, 'click', () => {
		infowindow.open(map, marker);
	});
	let timer = 0;
	for (let index = 0; index < locations.length; index++) {
		window.setTimeout(() => {
			const { latitude } = locations[index];
			const { longitude } = locations[index];
			animation([latitude, longitude]);
			if (index === locations.length) {
				const route = window.document.getElementById('route');
				if (route) route.innerHTML = '';
			}
		}, (timer += interval));
	}
};

const animation = result => {
	index = 0;
	deltaLat = (result[0] - position.latitude) / deltas;
	deltaLng = (result[1] - position.longitude) / deltas;
	animateMarker();
	const route = window.document.getElementById('route');
	if (route) {
		const div = window.document.createElement('DIV');
		div.classList.add('route-stopover');
		getstreet(result[0], result[1], street => {
			div.innerHTML =
				'Latitude :' + result[0] + '<br/> Longitude :' + result[1] + '<br/>Street : ' + street;
		});
		route.appendChild(div);
	}
};

const animateMarker = () => {
	position.latitude += deltaLat;
	position.longitude += deltaLng;
	const latlng = new google.maps.LatLng(position.latitude, position.longitude);
	marker.setTitle('Latitude:' + position.latitude + ' | Longitude:' + position.longitude);
	marker.setPosition(latlng);
	map.setCenter(latlng);
	if (index != deltas) {
		index++;
		window.setTimeout(animateMarker, delay);
	}
};

const refreshpage = () => {
	window.location.reload();
};

const getstreet = (latitude, longitude, callback) => {
	const geocoder = new google.maps.Geocoder();
	geocoder.geocode(
		{
			location: new google.maps.LatLng(latitude, longitude),
		},
		(results, status) => {
			if (status === 'OK') {
				if (results[1]) {
					const street = results[1].formatted_address;
					return callback(street);
				} else {
					callback('Unkown location');
				}
			} else {
				callback('Unkown location');
			}
		},
	);
};

/**
*@description
Load google map mrthod is attached to DOM event window.onload
am using ES6 syntax
*/

window.addEventListener('load', initialize);
