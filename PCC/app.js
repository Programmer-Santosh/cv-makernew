document.addEventListener('DOMContentLoaded', () => {
    // Function to validate and convert date format
    function validateAndConvertDate(dateString) {
        dateString = dateString.replace(/[\/\.\s]/g, '-');
        const yyyyMmDdRegex = /^\d{4}-\d{2}-\d{2}$/;
        const mmDdYyyyRegex = /^\d{2}-\d{2}-\d{4}$/;

        if (yyyyMmDdRegex.test(dateString)) {
            const [year, month, day] = dateString.split('-');
            return `${month}-${day}-${year}`;
        } else if (mmDdYyyyRegex.test(dateString)) {
            return dateString;
        }
        return dateString;
    }

    // Function to add data to Firestore
    document.getElementById('addRecordForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value.trim().toUpperCase();
        const email = document.getElementById('email').value.trim().toUpperCase();
        const type = document.getElementById('type-pcc').value;
        
        let dispatchDate = document.getElementById('dispatchDate').value;
        const sDate = new Date();
        const appliedDate =sDate.toISOString().split('T')[0];

        if (!fullName || !email) {
            alert("Full Name and Email are required.");
            return;
        }

        if (dispatchDate) {
            dispatchDate = validateAndConvertDate(dispatchDate);
        }

        try {
            await db.collection('policeReports').add({
                fullName,
                email,
                type,
                appliedDate,
                // dispatchDate: dispatchDate || null,
                timestamp: new Date(),
            });

            alert('Record added successfully!');
            document.getElementById('addRecordForm').reset();
            displayRecords();
        } catch (error) {
            console.error('Error adding document:', error);
            alert('Failed to add record.');
        }
    });

    // Function to fetch and display data from Firestore
    async function displayRecords() {
        const recordsContainer = document.getElementById('recordsContainer');
        const rowCountDisplay = document.getElementById('rowCount');
        recordsContainer.innerHTML = '<p>Loading...</p>';

        try {
            const querySnapshot = await db.collection('policeReports').orderBy('timestamp', 'desc').get();
            recordsContainer.innerHTML = '';
            const table = document.createElement('table');
            table.id = 'recordsTable';
            const tableHead = `
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Type</th>
                      
                        <th>Applied On</th>
                          <th>Dispatch Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            `;
            table.innerHTML = tableHead;
            const tableBody = document.createElement('tbody');
            let rowCount = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const formattedDispatchDate = data.dispatchDate ? validateAndConvertDate(data.dispatchDate) : 'OLD CLIENT';
                const status = getStatus(formattedDispatchDate);
                const stype = data.dispatchDate ? '' : (data.type || "");

                const recordRow = document.createElement('tr');
                recordRow.innerHTML = `
                    <td>${data.fullName}</td>
                    <td>${data.email}</td>
                    <td>${stype || ""}</td>
                    <td>${data.appliedDate || ""}</td>
                    <td>${formattedDispatchDate}</td>
                    <td>${status}</td>
                    <td>
                        <button class="delete-button" data-id="${doc.id}">Delete</button>
                        <button class="update-button" data-id="${doc.id}" data-date="${data.dispatchDate}">Update</button>
                    </td>
                `;
                tableBody.appendChild(recordRow);
                rowCount++; // Increment row count for each record
            });

            table.appendChild(tableBody);
            recordsContainer.appendChild(table);

            // Update the row count display
            rowCountDisplay.textContent = `Total Records: ${rowCount}`;
        } catch (error) {
            console.error('Error fetching documents:', error);
            recordsContainer.innerHTML = '<p>Error loading records.</p>';
        }
    }

    // Event delegation for delete buttons
    document.getElementById('recordsContainer').addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const docId = event.target.getAttribute('data-id');
            const confirmDelete = confirm("Are you sure you want to delete this record?");
            if (confirmDelete) {
                try {
                    await db.collection('policeReports').doc(docId).delete();
                    alert('Record deleted successfully!');
                    displayRecords();
                } catch (error) {
                    console.error('Error deleting document:', error);
                    alert('Failed to delete record.');
                }
            }
        }
    });

    // Event delegation for update buttons
    document.getElementById('recordsContainer').addEventListener('click', async (event) => {
        if (event.target.classList.contains('update-button')) {
            const docId = event.target.getAttribute('data-id');
            const currentDate = event.target.getAttribute('data-date');
            const newDate = prompt("Enter new Dispatch Date (YYYY-MM-DD):", currentDate);
            if (newDate && newDate !== currentDate) {
                try {
                    const docRef = db.collection('policeReports').doc(docId);
                    await docRef.update({ dispatchDate: validateAndConvertDate(newDate) || null });
                    alert('Dispatch date updated successfully!');
                    displayRecords();
                } catch (error) {
                    console.error('Error updating document:', error);
                    alert('Failed to update dispatch date.');
                }
            }
        }
    });

    // Handle JSON input
    document.getElementById('submitJsonButton').addEventListener('click', async () => {
        const jsonInput = document.getElementById('jsonInput').value.trim();

        if (!jsonInput) {
            alert('Please paste JSON data.');
            return;
        }

        try {
            const parsedData = JSON.parse(jsonInput);
            if (!Array.isArray(parsedData)) {
                alert('JSON data should be an array of records.');
                return;
            }

            for (const record of parsedData) {
                let { fullName, email, dispatchDate } = record;
                if (!fullName || !email) {
                    alert('Each record must include fullName and email.');
                    return;
                }

                if (dispatchDate) {
                    dispatchDate = validateAndConvertDate(dispatchDate);
                }

                await db.collection('policeReports').add({
                    fullName,
                    email,
                    dispatchDate: dispatchDate || null,
                    timestamp: new Date(),
                });
            }

            alert('Records added successfully!');
            displayRecords();
        } catch (error) {
            console.error('Error processing JSON or adding to Firestore:', error);
            alert('Failed to process JSON or add records.');
        }
    });

    displayRecords();

    // Function to determine the status based on the dispatch date
    function getStatus(dispatchDate) {
        if (!dispatchDate || dispatchDate === 'N/A') return 'N/A';
        const dateParts = dispatchDate.split('-');
        const formattedDate = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const timeDiff = currentDate - formattedDate;
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        if (isNaN(formattedDate.getTime())) {
            console.error('Invalid dispatch date:', dispatchDate);
            return 'Invalid Date';
        }

        if (daysDiff < 90) {
            return 'Valid';
        } else if (daysDiff >= 90 && daysDiff <= 178) {
            return 'Reapply Now';
        } else if (daysDiff > 178) {
            return 'Expired';
        } else {
            return 'N/A';
        }
    }
});
