document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton'); 
    const destinationInput = document.getElementById('destinationInput');
    const result = document.getElementById('result');
    const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const newYorkTime = new Date().toLocaleTimeString('en-US', options);
    console.log("Current time in New York:", newYorkTime);

    // Event listener for the search button
    searchButton.addEventListener('click', async () => {
        const searchTerm = destinationInput.value.toLowerCase().trim(); // 

        // Check if the search term is blank, if so, clear the result and return early
        if (searchTerm === '') {
            result.innerHTML = ''; 
            return; 
        }

        try {
            
            const response = await fetch('https://raw.githubusercontent.com/RussTP/spot_on_travel/d97b73a40630feeb5bc73aa887c60b8e1ae24361/travel_recommendation_api.json');
            
            
            if (!response.ok) {
                throw new Error('Response failed');
            }

            // Parse the JSON data asynchronously
            const data = await response.json();
            console.log('Fetched Data:', data); // Log fetched data for debugging

            const filteredData = [];

            // Search through countries and their cities
            if (Array.isArray(data.countries)) {
                data.countries.forEach(country => {
                    if (Array.isArray(country.cities)) {
                        country.cities.forEach(city => {
                            if (city.name.toLowerCase().includes(searchTerm)) {
                                filteredData.push({
                                    type: 'City',
                                    name: city.name,
                                    imageUrl: city.imageUrl,
                                    description: city.description
                                });
                            }
                        });
                    }
                });
            }

            // Search through temples
            if (Array.isArray(data.temples)) {
                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(searchTerm)) {
                        filteredData.push({
                            type: 'Temple',
                            name: temple.name,
                            imageUrl: temple.imageUrl,
                            description: temple.description
                        });
                    }
                });
            }

            // Search through beaches
            if (Array.isArray(data.beaches)) {
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(searchTerm)) {
                        filteredData.push({
                            type: 'Beach',
                            name: beach.name,
                            imageUrl: beach.imageUrl,
                            description: beach.description
                        });
                    }
                });
            }

            // Display filtered results
            result.innerHTML = ''; // Clear previous results
            if (filteredData.length === 0) {
                result.innerHTML = 'No matching destinations found.';
            } else {
                filteredData.forEach(item => {
                    const destinationDiv = document.createElement('div');
                    destinationDiv.innerHTML = `
                            <img src="${item.imageUrl}" alt="${item.name}" width="400" height="300">
                             <div class="destSearchContainer">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p><br>
                            <button class="visit">Visit</button>
                            <br>
                     </div>
                    `;
                    result.appendChild(destinationDiv);
                });
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            result.innerHTML = 'An error occurred while fetching data.';
        }
    });

    
    clearButton.addEventListener('click', () => {
        destinationInput.value = ''; 
        result.innerHTML = ''; 
    });
});
