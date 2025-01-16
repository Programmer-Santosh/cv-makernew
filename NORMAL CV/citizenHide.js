document.getElementById('citizenShowButton').addEventListener('click', function() {
    const citizen = document.getElementById('citizen');
    
    if (citizen.style.display === 'none' || citizen.style.display === '') {
      citizen.style.display = 'block';
    } else {
      citizen.style.display = 'none';
    }
   
  });