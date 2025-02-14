const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const dropzone = document.getElementById('dropzone');
const pdfPages = document.getElementById('pdfPages');
const downloadBtn = document.getElementById('downloadBtn');
const deleteZone = document.getElementById('deleteZone');

let pdfs = [];
let images = [];
let totalPages = 0;
const removedPages = {}; // Track deleted pages

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

        dragging.remove();
        totalPages--;

        if (pdfIndex !== undefined) {
            removedPages[pdfIndex].add(parseInt(pageNumber, 10));
        }
        if (imageIndex !== undefined) {
            images[parseInt(imageIndex, 10)] = null;
        }

        if (totalPages === 0) {
            downloadBtn.disabled = true;
        }
    }
});

function handleDragOver(event) {
    event.preventDefault();
    dropzone.classList.add('dragover');   // on this code pages are not serially downloaded and keep the original size of page do not stretch.
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
    }
}

async function processPDF(file) {
    const pdfBytes = await file.arrayBuffer();
    const pdfIndex = pdfs.length;
    pdfs.push(pdfBytes);
    removedPages[pdfIndex] = new Set();

    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdfDoc = await loadingTask.promise;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageElement = await renderPDFPage(pdfDoc, i, pdfIndex);
        if (pageElement) {
            pdfPages.appendChild(pageElement);
            totalPages++;
        }
    }

    downloadBtn.disabled = false;
}

async function processImage(file) {
    const imageUrl = URL.createObjectURL(file);
    images.push(imageUrl);

    const pageDiv = document.createElement('div');
    pageDiv.classList.add('page');
    pageDiv.draggable = true;
    pageDiv.dataset.imageIndex = images.length - 1;

    const pageImg = document.createElement('img');
    pageImg.src = imageUrl;
    pageDiv.appendChild(pageImg);
    pdfPages.appendChild(pageDiv);

    pageDiv.addEventListener('dragstart', () => pageDiv.classList.add('dragging'));
    pageDiv.addEventListener('dragend', () => pageDiv.classList.remove('dragging'));

    downloadBtn.disabled = false;
}

async function renderPDFPage(pdfDoc, pageNumber, pdfIndex) {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.3 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

    const pageDiv = document.createElement('div');
    pageDiv.classList.add('page');
    pageDiv.draggable = true;
    pageDiv.dataset.pdfIndex = pdfIndex;
    pageDiv.dataset.pageNumber = pageNumber;
    pageDiv.innerHTML = `<img src="${canvas.toDataURL()}" />`;

    pageDiv.addEventListener('dragstart', () => pageDiv.classList.add('dragging'));
    pageDiv.addEventListener('dragend', () => pageDiv.classList.remove('dragging'));

    return pageDiv;
}

// Enable drag reordering within the pdfPages container
pdfPages.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const target = e.target.closest('.page');
    if (!dragging || !target || dragging === target) return;
    const rect = target.getBoundingClientRect();
    const offset = rect.top + rect.height / 2;
    if (e.clientY > offset) {
         target.parentNode.insertBefore(dragging, target.nextSibling);
    } else {
         target.parentNode.insertBefore(dragging, target);
    }
});

downloadBtn.addEventListener('click', async () => {
    const newPdfDoc = await PDFLib.PDFDocument.create();
    const a4Width = 595.28;
    const a4Height = 841.89;
    const pageElements = Array.from(pdfPages.querySelectorAll('.page'));
    const loadedPDFs = {}; // Cache for loaded PDFLib documents

    // Process pages in the order they appear in the DOM
    for (const pageElement of pageElements) {
        if (pageElement.dataset.pdfIndex !== undefined && pageElement.dataset.pageNumber !== undefined) {
            // Process a PDF page
            const pdfIndex = parseInt(pageElement.dataset.pdfIndex, 10);
            const pageNumber = parseInt(pageElement.dataset.pageNumber, 10);
            if (!loadedPDFs[pdfIndex]) {
                loadedPDFs[pdfIndex] = await PDFLib.PDFDocument.load(pdfs[pdfIndex]);
            }
            const pdfLibDoc = loadedPDFs[pdfIndex];
            const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [pageNumber - 1]);

            // Compute scale to fit the copied page onto an A4 page without stretching
            const origWidth = copiedPage.getWidth();
            const origHeight = copiedPage.getHeight();
            const scaleFactor = Math.min(a4Width / origWidth, a4Height / origHeight);

            // Embed the copied page as an image so we can draw it on a blank A4 page
            const embeddedPage = await newPdfDoc.embedPage(copiedPage);
            const newPage = newPdfDoc.addPage([a4Width, a4Height]);
            const { width, height } = embeddedPage.scale(scaleFactor);
            const x = (a4Width - width) / 2;
            const y = (a4Height - height) / 2;
            newPage.drawPage(embeddedPage, { x, y, width, height });
        } else if (pageElement.dataset.imageIndex !== undefined) {
            // Process an image page
            const imageIndex = parseInt(pageElement.dataset.imageIndex, 10);
            const imageUrl = images[imageIndex];
            if (!imageUrl) continue;
            const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
            const image = await newPdfDoc.embedJpg(imageBytes);
            const { width, height } = image.scale(1);
            const scaleFactor = Math.min(a4Width / width, a4Height / height);
            const newWidth = width * scaleFactor;
            const newHeight = height * scaleFactor;
            const page = newPdfDoc.addPage([a4Width, a4Height]);
            const x = (a4Width - newWidth) / 2;
            const y = (a4Height - newHeight) / 2;
            page.drawImage(image, { x, y, width: newWidth, height: newHeight });
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
