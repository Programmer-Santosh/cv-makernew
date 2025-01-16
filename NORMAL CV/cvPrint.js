document.getElementById("print-btn").addEventListener("click", () => {
    const printContent = document.getElementById("cv-preview").innerHTML; // Get the preview content
    const originalContent = document.body.innerHTML; // Store the original page content

    // Replace the body with the preview content
    document.body.innerHTML = `<div id="cv-preview">${printContent}</div>`;

    // Trigger the print dialog
    window.print();

    // Restore the original content
    document.body.innerHTML = originalContent;

    // Rebind events (if necessary)
    location.reload(); // Optional: Refresh page to restore functionality
});
  