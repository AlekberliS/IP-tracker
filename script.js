document.addEventListener('DOMContentLoaded', function() {
    // Default  Baku, Azerbaijan
    const defaultLat = 40.4093;
    const defaultLng = 49.8671;
    const defaultIp = '192.168.0.1';
    const defaultLocation = 'Baku, Azerbaijan';
    const defaultTimezone = 'UTC+4';
    const defaultIsp = 'Azercell';

    //  using library for showing search area
    const map = L.map('map').setView([defaultLat, defaultLng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    let marker = L.marker([defaultLat, defaultLng]).addTo(map)
        .bindPopup('Baku, Azerbaijan')
        .openPopup();

    // default information in the tracker details
    document.querySelector('.ip-add').textContent = defaultIp;
    document.querySelector('.location').textContent = defaultLocation;
    document.querySelector('.timezone').textContent = defaultTimezone;
    document.querySelector('.isp').textContent = defaultIsp;

    document.getElementById('fetchBtn').addEventListener('click', function() {
        const ipInput = document.getElementById('ipInput');
        const ipAddress = ipInput.value.trim();
        const apiKey = 'at_nJje2rY8zG0xa0uDqBZVxZf1xgVP0';

        // Clear previous results
        document.querySelector('.ip-add').textContent = 'Loading...';
        document.querySelector('.location').textContent = 'Loading...';
        document.querySelector('.timezone').textContent = 'Loading...';
        document.querySelector('.isp').textContent = 'Loading...';

        // Basic validation to check if the input is a valid IP address or domain
        if (isValidIpAddress(ipAddress) || isValidDomain(ipAddress)) {
            const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    document.querySelector('.ip-add').textContent = data.ip;
                    document.querySelector('.location').textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
                    document.querySelector('.timezone').textContent = `UTC ${data.location.timezone}`;
                    document.querySelector('.isp').textContent = data.isp;

                    
                    const lat = data.location.lat;
                    const lng = data.location.lng;
                    updateMap(lat, lng);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    document.querySelector('.ip-add').textContent = 'Error';
                    document.querySelector('.location').textContent = 'Error';
                    document.querySelector('.timezone').textContent = 'Error';
                    document.querySelector('.isp').textContent = 'Error';
                });
        } else {
            alert('Please enter a valid IP address or domain name.');
            document.querySelector('.ip-add').textContent = 'Invalid Input';
            document.querySelector('.location').textContent = 'Invalid Input';
            document.querySelector('.timezone').textContent = 'Invalid Input';
            document.querySelector('.isp').textContent = 'Invalid Input';
        }
    });

    function isValidIpAddress(ip) {
        //  validate IP address
        const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
        return ipPattern.test(ip);
    }

    function isValidDomain(domain) {
        // validate domain name
        const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
        return domainPattern.test(domain);
    }

    function updateMap(lat, lng) {
        map.setView([lat, lng], 12);
        marker.setLatLng([lat, lng])
            .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
            .openPopup();
    }
});
