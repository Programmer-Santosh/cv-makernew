const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const dropzone = document.getElementById('dropzone');
const pdfPages = document.getElementById('pdfPages');
const downloadBtn = document.getElementById('downloadBtn');
const deleteZone = document.getElementById('deleteZone');

let pdfs = []; //puffer data store garna ko lagi
let images = []; // iage data store garna parxa
let totalPages = 0;

// Upload button logic
uploadBtn.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', handleFileUpload);
dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
dropzone.addEventListener('drop', handleFileDrop);

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
        const pdfIndex = dragging.dataset.pdfIndex;
        const pageNumber = dragging.dataset.pageNumber;
        const imageIndex = dragging.dataset.imageIndex;

        //  DOM dekgi page delete garna 
        dragging.remove();

        // Update internal data
        if (pdfIndex !== undefined) {
            pdfs[parseInt(pdfIndex, 10)] = null; // Mark PDF page as removed
        }
        if (imageIndex !== undefined) {
            images[parseInt(imageIndex, 10)] = null; // Mark image page as removed
        }

        // Update the total page count
        totalPages--;

        // Disable download button if no pages remain
        if (totalPages === 0) {
            downloadBtn.disabled = true;
        }
    }
});

// Handle drag-and-drop styling for the drop zone
function handleDragOver(event) {
    event.preventDefault();
    dropzone.classList.add('dragover');
}

function handleDragLeave() {
    dropzone.classList.remove('dragover');
}

async function handleFileDrop(event) {
    event.preventDefault();
    dropzone.classList.remove('dragover');
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
        await processFile(file);
    }
}

async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    for (const file of files) {
        await processFile(file);
    }
}

async function processFile(file) {
    try {
        if (file.type === 'application/pdf') {
            await processPDF(file);
        } else if (file.type.startsWith('image/')) {
            await processImage(file);
        } else {
            alert('Please upload a valid PDF or image file.');
        }
    } catch (error) {
        console.error('Error processing file:', error);
        alert('Failed to process the file. Please try again.');
    }
}

async function processPDF(file) {
    try {
        const pdfBytes = await file.arrayBuffer();
        pdfs.push(pdfBytes);

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdfDoc = await loadingTask.promise;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const pageElement = await renderPDFPage(pdfDoc, i, pdfs.length - 1);
            if (pageElement) {
                pdfPages.appendChild(pageElement);
                totalPages++;
            }
        }

        downloadBtn.disabled = false;
    } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Failed to process the PDF file.');
    }
}

async function processImage(file) {
    try {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;

        await new Promise((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);

                const imageDataUrl = canvas.toDataURL('image/jpeg');
                images.push(imageDataUrl);

                const pageDiv = document.createElement('div');
                pageDiv.classList.add('page');
                pageDiv.draggable = true;

                const pageImg = document.createElement('img');
                pageImg.src = imageDataUrl;
                pageDiv.appendChild(pageImg);

                pageDiv.dataset.imageIndex = images.length - 1;
                pdfPages.appendChild(pageDiv);

                pageDiv.addEventListener('dragstart', () => pageDiv.classList.add('dragging'));
                pageDiv.addEventListener('dragend', () => pageDiv.classList.remove('dragging'));

                resolve();
            };
            img.onerror = reject;
        });

        downloadBtn.disabled = false;
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process the image file.');
    }
}

async function renderPDFPage(pdfDoc, pageNumber, pdfIndex) {
    try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const img = document.createElement('img');
        img.src = canvas.toDataURL();

        const pageDiv = document.createElement('div');
        pageDiv.classList.add('page');
        pageDiv.draggable = true;
        pageDiv.appendChild(img);
        pageDiv.dataset.pdfIndex = pdfIndex;
        pageDiv.dataset.pageNumber = pageNumber - 1;

        pageDiv.addEventListener('dragstart', () => pageDiv.classList.add('dragging'));
        pageDiv.addEventListener('dragend', () => pageDiv.classList.remove('dragging'));

        return pageDiv;
    } catch (error) {
        console.error(`Error rendering PDF page ${pageNumber}:`, error);
        return null;
    }
}

downloadBtn.addEventListener('click', async () => {
    const reorderedPages = Array.from(pdfPages.children).map((pageDiv) => ({
        pdfIndex: pageDiv.dataset.pdfIndex,
        pageNumber: pageDiv.dataset.pageNumber,
        imageIndex: pageDiv.dataset.imageIndex,
    }));

    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (const { pdfIndex, pageNumber, imageIndex } of reorderedPages) {
        try {
            if (pdfIndex !== undefined && pdfs[parseInt(pdfIndex, 10)] !== null) {
                const pdfLibDoc = await PDFLib.PDFDocument.load(pdfs[parseInt(pdfIndex, 10)]);
                const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [parseInt(pageNumber, 10)]);
                newPdfDoc.addPage(copiedPage);
            } else if (imageIndex !== undefined && images[parseInt(imageIndex, 10)] !== null) {
                const imageBytes = await fetch(images[parseInt(imageIndex, 10)]).then((res) => res.arrayBuffer());
                const image = await newPdfDoc.embedJpg(imageBytes);

                const pageWidth = 595.28;
                const pageHeight = 841.89;

                const aspectRatio = image.width / image.height;
                let drawWidth, drawHeight;

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
        } catch (error) {
            console.error('Error adding page to the new PDF:', error);
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
