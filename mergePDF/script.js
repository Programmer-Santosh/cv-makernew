const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const dropzone = document.getElementById('dropzone');
const pdfPages = document.getElementById('pdfPages');
const downloadBtn = document.getElementById('downloadBtn');

let pdfs = []; // To store PDF ArrayBuffer data
let images = []; // To store uploaded image data
let totalPages = 0;

uploadBtn.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', handleFileUpload);
dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
dropzone.addEventListener('drop', handleFileDrop);

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
    if (file.type === 'application/pdf') {
        await processPDF(file);
    } else if (file.type.startsWith('image/')) {
        await processImage(file);
    } else {
        alert('Please upload a valid PDF or image file.');
    }
}

async function processPDF(file) {
    const pdfBytes = await file.arrayBuffer();
    pdfs.push(pdfBytes);

    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdfDoc = await loadingTask.promise;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageElement = await renderPDFPage(pdfDoc, i, pdfs.length - 1);
        pdfPages.appendChild(pageElement);
        totalPages++;
    }

    downloadBtn.disabled = false;
}

async function processImage(file) {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageUrl;

    await new Promise((resolve) => {
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
    });

    downloadBtn.disabled = false;
}

async function renderPDFPage(pdfDoc, pageNumber, pdfIndex) {
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
}

pdfPages.addEventListener('dragover', (event) => {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(pdfPages, event.clientX);
    if (afterElement == null) {
        pdfPages.appendChild(dragging);
    } else {
        pdfPages.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.page:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

downloadBtn.addEventListener('click', async () => {
    const reorderedPages = Array.from(pdfPages.children).map((pageDiv) => ({
        pdfIndex: pageDiv.dataset.pdfIndex,
        pageNumber: pageDiv.dataset.pageNumber,
        imageIndex: pageDiv.dataset.imageIndex,
    }));

    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (const { pdfIndex, pageNumber, imageIndex } of reorderedPages) {
        if (pdfIndex !== undefined) {
            const pdfLibDoc = await PDFLib.PDFDocument.load(pdfs[pdfIndex]);
            const [copiedPage] = await newPdfDoc.copyPages(pdfLibDoc, [pageNumber]);
            newPdfDoc.addPage(copiedPage);
        } else if (imageIndex !== undefined) {
            const imageBytes = await fetch(images[imageIndex]).then((res) => res.arrayBuffer());
            const image = await newPdfDoc.embedJpg(imageBytes);

            // A4 page size in points
            const pageWidth = 595.28;
            const pageHeight = 841.89;

            // Calculate the image dimensions while maintaining aspect ratio
            const imageWidth = image.width;
            const imageHeight = image.height;
            const aspectRatio = imageWidth / imageHeight;

            let drawWidth, drawHeight;

            if (aspectRatio > pageWidth / pageHeight) {
                drawWidth = pageWidth;
                drawHeight = pageWidth / aspectRatio;
            } else {
                drawHeight = pageHeight;
                drawWidth = pageHeight * aspectRatio;
            }

            // Center the image on the page
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
