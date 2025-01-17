document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('convertBtn').addEventListener('click', convertToPDF);

let imagesArray = []; // To store the images in order

// Handle the image files selected by the user
function handleFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.innerHTML = '';  // Clear the previous images

    imagesArray = []; // Reset the image array

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.draggable = true;
            imgElement.addEventListener('dragstart', dragStart);
            imgElement.addEventListener('dragover', dragOver);
            imgElement.addEventListener('drop', dropImage);
            imgElement.dataset.index = imagesArray.length; // Store the index of the image
            imagesArray.push(imgElement);

            previewContainer.appendChild(imgElement);
        };

        reader.readAsDataURL(file);
    });
}

// Handle drag start (when an image is being dragged)
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

// Handle drag over (allow drop)
function dragOver(event) {
    event.preventDefault();
}

// Handle image drop (reorder the images)
function dropImage(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('text/plain');
    const targetIndex = event.target.dataset.index;
    
    // Swap images in the array
    const draggedImage = imagesArray[draggedIndex];
    const targetImage = imagesArray[targetIndex];

    const draggedSrc = draggedImage.src;
    draggedImage.src = targetImage.src;
    targetImage.src = draggedSrc;

    // Swap the dataset.index too
    draggedImage.dataset.index = targetIndex;
    targetImage.dataset.index = draggedIndex;

    // Rebuild the image preview order
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.innerHTML = '';
    imagesArray.forEach(img => previewContainer.appendChild(img));
}

// Convert the images to a PDF
function convertToPDF() {
    if (imagesArray.length === 0) {
        alert('Please upload at least one image!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    imagesArray.forEach((imgElement, index) => {
        const img = new Image();
        img.src = imgElement.src;

        img.onload = function () {
            if (index > 0) {
                pdf.addPage(); 
            }

            
            const imgWidth = 180;
            const imgHeight = (img.height / img.width) * imgWidth;

            pdf.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);

            
            if (index === imagesArray.length - 1) {
                pdf.save('images.pdf');
            }
        };
    });
}
