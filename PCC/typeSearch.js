document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('typeSearchButton');
    const sInput = document.getElementById('typeSearch');

    searchButton.addEventListener('click', () => {
        // Get the search term in lowercase
        const searchTerm = sInput.value.trim().toLowerCase();
        
        // Get the rows of the table
        const rows = document.getElementById('recordsTable').getElementsByTagName('tr');

        // Loop through the rows of the table (start from 1 to skip the header row)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const statusCell = row.cells[2]; // The 4th column (index 3) contains the status

            if (statusCell) {
                // Get the status in lowercase
                const status = statusCell.innerText.toLowerCase(); 

                // Compare the status and search term in lowercase (case-insensitive)
                if (status.includes(searchTerm)) {
                    row.style.display = ''; // Show the row
                } else {
                    row.style.display = 'none'; // Hide the row if it doesn't match the search term
                }
            }
        }
    });
});
