document.getElementById('showButton').addEventListener('click', function() {
    const trainingDiv = document.getElementById('trainingDiv');
    
    if (trainingDiv.style.display === 'none' || trainingDiv.style.display === '') {
      trainingDiv.style.display = 'block';
    } else {
      trainingDiv.style.display = 'none';
    };
   
  });