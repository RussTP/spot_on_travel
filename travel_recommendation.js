document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const destinationInput = document.getElementById('destinationInput');
    const result = document.getElementById('result');

    searchButton.addEventListener('click', () => {
        const searchTerm = destinationInput.value.toLowerCase();

        // Fetch the JSON data
        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Response failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched Data:', data); // Log fetched data

                // Filter data by country or temple
                const filteredData = data.filter(item => {
                    return item.country.toLowerCase().includes(searchTerm) ||
                           item.temple.toLowerCase().includes(searchTerm);
                });

                // Display filtered results
                result.innerHTML = ''; // Clear previous results
                if (filteredData.length === 0) {
                    result.innerHTML = 'No matching destinations found.';
                } else {
                    filteredData.forEach(item => {
                        const destinationDiv = document.createElement('div');
                        destinationDiv.innerHTML = `
                            <strong>Country: ${item.country}</strong><br>
                            <strong>Temple: ${item.temple}</strong><br>
                            <p>${item.description}</p>
                        `;
                        result.appendChild(destinationDiv);
                    });
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                result.innerHTML = 'An error occurred while fetching data.';
            });
    });
});
