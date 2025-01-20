document.getElementById('recordsContainer').addEventListener('click', async (event) => {
    if (event.target.classList.contains('update-button')) {
      const docId = event.target.getAttribute('data-id');
      const currentDate = event.target.getAttribute('data-date');
  
      const newDate = prompt("Enter new Dispatch Date (YYYY-MM-DD):", currentDate);
      if (newDate && newDate !== currentDate) {
        console.log(`Updating dispatch date to: ${newDate}`);
        
        const docRef = db.collection('policeReports').doc(docId);
        await docRef.update({ dispatchDate: newDate });
  
        // Confirming success after the update
        const updatedDoc = await docRef.get();
        if (updatedDoc.exists && updatedDoc.data().dispatchDate === newDate) {
          alert('Dispatch date updated successfully!');
          displayRecords(); // Refresh the displayed records
          window.location.reload(); // Reload the page to reflect changes
        }
      }
    }
  });
  