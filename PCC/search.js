document.addEventListener('DOMContentLoaded', () => {
  // Search function to filter table rows by name
  document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchName = document.getElementById('searchName').value.trim().toLowerCase(); // Convert input to lowercase
    const rows = document.getElementById('recordsTable').getElementsByTagName('tr'); // Get all table rows
    const messageContainer = document.getElementById('messageContainer'); // For status messages

    let found = false; // Track if any results match

    // Loop through rows and filter by name (start from 1 to skip header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const nameCell = row.cells[0]; // Assuming the first column contains names

      if (nameCell) {
        const fullName = nameCell.innerText.trim().toLowerCase();

        // Check if the search term is part of the name
        if (fullName.includes(searchName)) {
          row.style.display = ''; // Show the matching row
          found = true;
        } else {
          row.style.display = 'none'; // Hide non-matching rows
        }
      }
    }

    // Display a message if no matches were found
    if (!found) {
      messageContainer.textContent = 'No records found.';
    } else {
      messageContainer.textContent = ''; // Clear any previous message
    }

    // Reset search if input is empty
    if (searchName.length === 0) {
      messageContainer.textContent = ''; // Clear message
      for (let i = 1; i < rows.length; i++) {
        rows[i].style.display = ''; // Show all rows
      }
    }
  });
});
