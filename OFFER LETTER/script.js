document.getElementById("generate-btn").addEventListener("click", () => {
 
 const fullName = document.getElementById("full-name").value.toUpperCase();
 const cityOfBirth = document.getElementById("city-of-birth").value.toUpperCase();
 const countryOfBirth = document.getElementById("country-of-birth").value.toUpperCase();
 const passportNo = document.getElementById("pp-no").value.toUpperCase();
 const passportIssue = document.getElementById("issue-date").value.toUpperCase();
 const salary = document.getElementById("salary").value.toUpperCase();
 const offerValidity = document.getElementById("offer-date").value.toUpperCase();
  

 

  const preview = `
<div class="header">
<h3>INSTORE PEOPLE PROVIDER SRL</h3>
<p>Str. Dionisie Lupu, Nr. 70-72, Parter, Biroul P-03, Sector 1, Bucurestisti</p>
<p>J40/10750/2016</p>
 <p>36417573</p>
</div>
<div class="  main-body">

<!--romanian-->
<div class="romanian">
<h4>OFERTĂ FERMĂ DE ANGAJARE</h4>
<p> Subscrisa SC INSTORE PEOPLE PROVIDER SRL, cu sediul în Str.
 Dionisie Lupu, nr. 70-72, Parter, Biroul P-03, Bucuresti, 
 înregistrată în Registrul Comerțului 
sub nr. J40/10750/2016, cod unic de înregistrare 36417573,
aduce la cunoștința Candidatului, oferta fermă de angajare a 
acestuia, având conținutul și prevederile contractului individual 
de muncă de mai jos: 

</p>

 
<b>1. Identificarea părților contractului individual de muncă </b>
<p>a) Angajator. SC INSTORE PEOPLE PROVIDER SRL, cu sediul în Str.
 Dionisie Lupu, nr. 70-72, Parter, Biroul P-03, Bucuresti, înregistrată
  în Registrul Comerțului sub nr. J40/10750/2016, cod unic de înregistrare 
  36417573, si,</p>

<p>b) Angajat.<b>${fullName}</b>, cetățean ${countryOfBirth}, domiciliat în <b>${cityOfBirth}</b>,
<b>${countryOfBirth}</b>,
 identificat cu pașaport tip P,<span contenteditable ="true"> NPL</span>,
  Nr. <b>${passportNo}</b>emis de <span contenteditable="true">MOFA</span> la data de ${passportIssue}  </p> 
<p><b>2. Locul de muncă </b></p>
   <p> Bucuresti, Romania</P>
 <p><b>3. Funcția ocupată </b></p>
<P contenteditable="true" >Muncitor Necalificat </P>
 <p><b>4. Atribuții </b></p>
<p>Atribuțiile sunt prezentate în fișa postului. </p>

<p><b>5. Data începerii activității </b></p>
<p>Imediat după obținerea vizei și venirea Candidatului pe teritoriul României. </P>


<p><b>6. Durata contractului </b></p>
<p>Durata contractului individual de muncă este nedeterminat. </P>



 <p><b>7. Concediul de odihnă </b></p>

<p>Durata concediului de odihnă este de 20 de zile lucrătoare. </p>


<p><b>8. Salariul </b></p>
Salariul de bază brut este de ${salary} RON,
 plata făcându-se în data de 15 ale lunii următoare. 

<p><b>9. Timpul de muncă </b></p>
8 ore pe zi, 6 zile pe săptămână 

<p><b>10. Regulamentul intern </b></p>
Regulamentul intern se aduce 
la cunoștința Candidatului prin grija administratorului 
și își produce efectele față de Candidat din momentul încunoștințării acestuia. 

<p><b>11. Perioada de probă </b></p>
Perioada de probă este de 90 de zile calendaristice. 

<p><b>12. Preavizul </b></p>
În cazul concedierii sau demisiei durata preavizului 
va fi de 20 de zile lucrătoare. 

Prezenta ofertă fermă de angajare este valabilă până 
la data de ${offerValidity}. 
<p class ="overlay-stamp"><img src="./sc instore stamp.png" alt = "stamp" height="115 px" /></p>

<div><p><b>SC INSTORE PEOPLE PROVIDER SRL</b></p>

<p>Administrator/Director: </p>

<p><b>Corniciuc Ionut-Valeriu</b></p>

<p>Semnătura/Signature____________________</P></div>

</div>

<!--english-->
<div class = "english">

<h4>BINDING EMPLOYMENT OFFER</h4>
<p> The undersigned, SC INSTORE PEOPLE PROVIDER SRL,
 with its registered address at, district 1, Str. Dionisie Lupu,
  nr. 70-72, Office P-03, Bucharest registered with the Trade Registry 
  under no. J40/10750/2016, unique registration code 36417573,
informs the Candidate of its binding employment offer, having 
the content and provisions of the individual employment contract below: 

</p>
<b>1. Identification of the parties to the individual employment contract </b>
<p>a) Employer. SC INSTORE PEOPLE PROVIDER SRL, with its registered address at, 
district 1, Str. Dionisie Lupu, nr. 70-72, Office P-03, Bucharest registered
 with the Trade Registry under no. J40/10750/2016, unique registration code 
 36417573 and,</p>

<p>b) Employee<b>${fullName}</b>, ${countryOfBirth} citizen, domiciled in  
<b>${cityOfBirth}</b>, <b>${countryOfBirth}</b>, 
identified with passport type <span contenteditable ="true"> NPL</span>, No. <b>${passportNo}</b> issued by
 <span contenteditable ="true">MOFA<span> on ${passportIssue}. </p>


<p><b>2. The workplace </b></P>
Bucharest, Romania. 


<p><b>3. Occupied position </b></P>
<P contenteditable="true" >Unskilled workers </P>


<p><b>4. Duties </b></P>
The duties are presented in the job description.


<p><b>5. Date of commencement of the activity </b></P>
Immediately after obtaining the visa and the arrival of the Candidate on the Romanian territory. 


<p><b>6. Contract term </b></P>
The term of the individual employment contract is indefinite. 



<p><b>7. Rest leave</b></P>

The term of the rest leave is 20 working days. 



<p><b>8. Salary </b></p>
The gross basic salary is RON ${salary},
the payment being made on the 15th  of the following month. 

<p><b>9. Working time </b></p>
8 hours per day, 6 days per week. 

<p><b>10. Internal regulations </b></p>
The internal regulations are brought to the notice 
of the Candidate through the care of the director and 
produce their effects towards the Candidate from the moment of informing him. 

<p><b>11. Probationary period </b></p>
The probationary period is 90 calendar days. 

<p><b>12. The notice </b></p>
In case of dismissal or resignation, the notice period will be 20 working days. 

This binding employment offer is valid until ${offerValidity}. 


<p><b>Angajat/Employee: ${fullName}</b></p>
<p>Semnătura/Signature____________________</P>


</div>

</div>
      
    `;

 
    

  const previewContainer = document.getElementById("cv-preview");
  previewContainer.innerHTML = preview;
 
  previewContainer.innerHTML ;
});
