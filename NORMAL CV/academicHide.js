document.getElementById('academicShowButton').addEventListener('click', function() {
    const trainingDiv1 = document.getElementById('trainingDiv1');
    
    if (trainingDiv1.style.display === 'none' || trainingDiv1.style.display === '') {
      trainingDiv1.style.display = 'block';
    } else {
      trainingDiv1.style.display = 'none';
    }
   
  });