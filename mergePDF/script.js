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

downloadBtn.addEventListener('click', async () => {
    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (let pdfIndex = 0; pdfIndex < pdfs.length; pdfIndex++) {
        if (!pdfs[pdfIndex]) continue;

        const pdfLibDoc = await PDFLib.PDFDocument.load(pdfs[pdfIndex]);
        const pageCount = pdfLibDoc.getPageCount();

        for (let i = 0; i < pageCount; i++) {
            if (removedPages[pdfIndex].has(i + 1)) continue;
            const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [i]);
            newPdfDoc.addPage(copiedPage);
        }
    }

    for (const imageUrl of images) {
        if (!imageUrl) continue;
        const imageBytes = await fetch(imageUrl).then(res => res.arrayBuffer());
        const image = await newPdfDoc.embedJpg(imageBytes);

        const page = newPdfDoc.addPage([595.28, 841.89]);
        page.drawImage(image, { x: 50, y: 200, width: 495, height: 441.89 });
    }

    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'organized.pdf';
    link.click();

    URL.revokeObjectURL(link.href);
});
