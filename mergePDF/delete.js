const deleteZone = document.getElementById('deleteZone');

// Add dragover styling to the delete zone
deleteZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    deleteZone.classList.add('dragover');
});

// Remove dragover styling when dragging leaves the delete zone
deleteZone.addEventListener('dragleave', () => {
    deleteZone.classList.remove('dragover');
});

// Handle dropping pages into the delete zone
deleteZone.addEventListener('drop', (event) => {
    event.preventDefault();
    deleteZone.classList.remove('dragover');

    // Find the currently dragging element
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        const pageIndex = dragging.dataset.pageNumber;
        const pdfIndex = dragging.dataset.pdfIndex;
        const imageIndex = dragging.dataset.imageIndex;

        // Remove the page from the DOM
        dragging.remove();

        // Update the arrays
        if (pdfIndex !== undefined) {
            pdfs[parseInt(pdfIndex, 10)] = null; // Mark PDF page as removed
        }
        if (imageIndex !== undefined) {
            images[parseInt(imageIndex, 10)] = null; // Mark image page as removed
        }

        // Decrease the total page count
        totalPages--;

        // Disable the download button if no pages remain
        if (totalPages === 0) {
            downloadBtn.disabled = true;
        }
    }
});

// Ensure the download logic respects deleted pages
downloadBtn.addEventListener('click', async () => {
    const reorderedPages = Array.from(pdfPages.children).map((pageDiv) => ({
        pdfIndex: pageDiv.dataset.pdfIndex,
        pageNumber: pageDiv.dataset.pageNumber,
        imageIndex: pageDiv.dataset.imageIndex,
    }));

    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (const { pdfIndex, pageNumber, imageIndex } of reorderedPages) {
        if (pdfIndex !== undefined) {
            const pdfLibDoc = await PDFLib.PDFDocument.load(pdfs[parseInt(pdfIndex, 10)]);
            const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [parseInt(pageNumber, 10)]);
            newPdfDoc.addPage(copiedPage);
        } else if (imageIndex !== undefined) {
            const imageBytes = await fetch(images[parseInt(imageIndex, 10)]).then((res) => res.arrayBuffer());
            const image = await newPdfDoc.embedJpg(imageBytes);

            const pageWidth = 595.28;
            const pageHeight = 841.89;

            let drawWidth, drawHeight;
            const aspectRatio = image.width / image.height;

            if (aspectRatio > pageWidth / pageHeight) {
                drawWidth = pageWidth;
                drawHeight = pageWidth / aspectRatio;
            } else {
                drawHeight = pageHeight;
                drawWidth = pageHeight * aspectRatio;
            }

            const x = (pageWidth - drawWidth) / 2;
            const y = (pageHeight - drawHeight) / 2;

            const page = newPdfDoc.addPage([pageWidth, pageHeight]);
            page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
        }
    }

    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'organized.pdf';
    link.click();

    URL.revokeObjectURL(link.href);
});
