function addRow() {
    const table = document
      .getElementById("cvTable")
      .getElementsByTagName("tbody")[0];
    const firstRow = table.rows[0];
    const newRow = firstRow.cloneNode(true);
  
    const inputs = newRow.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
  
    table.appendChild(newRow);
  }
  
  function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const table = row.parentNode;
  
    
    if (row === table.rows[0]) {
      alert("The first row cannot be deleted.");
      return;
    }
  
    row.parentNode.removeChild(row);
  }
  