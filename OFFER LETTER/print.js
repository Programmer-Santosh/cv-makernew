document.getElementById("print-btn").addEventListener("click", () => {
    const printContent = document.getElementById("cv-preview").outerHTML; // Get the entire content of the preview element
    const originalContent = document.body.innerHTML; // Store the original page content

    // Temporarily isolate the print content
    document.body.innerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Print Preview</title>
            <style>
                /* Preserve existing styles */
                ${Array.from(document.styleSheets)
                    .map(sheet => {
                        try {
                            return Array.from(sheet.cssRules || [])
                                .map(rule => rule.cssText)
                                .join("\n");
                        } catch (e) {
                            return ""; // Ignore CORS-restricted stylesheets
                        }
                    })
                    .join("\n")}
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `;

    // Trigger the print dialog
    window.print();

    // Restore the original content
    document.body.innerHTML = originalContent;

    // Rebind events (if necessary)
    setTimeout(() => {
        location.reload(); // Optional: Refresh page to restore functionality
    }, 0);
});
