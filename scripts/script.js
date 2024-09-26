document.addEventListener('DOMContentLoaded', () => {
    const fromZoneSelect = document.getElementById('fromZone');
    const toZoneSelect = document.getElementById('toZone');
    const convertBtn = document.getElementById('convertBtn');
    const result = document.getElementById('result');

    // Fetch time zones from the API
    fetch('http://worldtimeapi.org/api/timezone')
        .then(response => response.json())
        .then(zones => {
            zones.forEach(zone => {
                const optionFrom = document.createElement('option');
                optionFrom.value = zone;
                optionFrom.textContent = zone;
                fromZoneSelect.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = zone;
                optionTo.textContent = zone;
                toZoneSelect.appendChild(optionTo);
            });
        })
        .catch(error => console.error('Error fetching time zones:', error));

    // Convert time on button click
    convertBtn.addEventListener('click', () => {
        const timeInput = document.getElementById('time').value;
        const fromZone = fromZoneSelect.value;
        const toZone = toZoneSelect.value;

        if (!timeInput || fromZone === toZone) {
            result.textContent = 'Please enter a valid time and select different time zones.';
            return;
        }

        // Convert time to UTC first
        const [hours, minutes] = timeInput.split(':').map(Number);
        const fromTime = new Date(Date.UTC(1970, 0, 1, hours, minutes));
        
        fetch(`http://worldtimeapi.org/api/timezone/${fromZone}`)
            .then(response => response.json())
            .then(data => {
                const utcOffset = data.utc_offset.split(':').map(Number);
                fromTime.setHours(fromTime.getHours() - utcOffset[0] - utcOffset[1] / 60);
                
                // Get the target zone offset
                return fetch(`http://worldtimeapi.org/api/timezone/${toZone}`);
            })
            .then(response => response.json())
            .then(data => {
                const targetOffset = data.utc_offset.split(':').map(Number);
                const targetTime = new Date(fromTime.getTime() + (targetOffset[0] * 3600000) + (targetOffset[1] * 60000));
                
                const options = { hour: '2-digit', minute: '2-digit', hour12: false };
                result.textContent = `Converted Time: ${targetTime.toLocaleTimeString('en-US', options)}`;
            })
            .catch(error => console.error('Error fetching time data:', error));
    });
});
