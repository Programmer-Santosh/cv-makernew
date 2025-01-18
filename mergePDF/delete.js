const deleteZone = document.getElementById('deleteZone');

deleteZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    deleteZone.classList.add('dragover');
});

deleteZone.addEventListener('dragleave', () => {
    deleteZone.classList.remove('dragover');
});

deleteZone.addEventListener('drop', (event) => {
    event.preventDefault();
    deleteZone.classList.remove('dragover');

    const dragging = document.querySelector('.dragging');
    if (dragging) {
        const pageIndex = dragging.dataset.pageNumber || dragging.dataset.imageIndex;
        
        // Remove the dragged element from DOM
        dragging.remove();

        // Remove the page from the corresponding data array
        if (dragging.dataset.pdfIndex !== undefined) {
            const pdfIndex = parseInt(dragging.dataset.pdfIndex, 10);
            const pageNumber = parseInt(dragging.dataset.pageNumber, 10);

            // Handle removal for PDF pages
            pdfs[pdfIndex] = null; // Mark PDF as null (optional cleanup)
        } else if (dragging.dataset.imageIndex !== undefined) {
            const imageIndex = parseInt(dragging.dataset.imageIndex, 10);

            // Handle removal for image pages
            images[imageIndex] = null; // Mark image as null (optional cleanup)
        }

        // Update the total page count
        totalPages--;

        // Disable download button if no pages remain
        if (totalPages === 0) {
            downloadBtn.disabled = true;
        }
    }
});
