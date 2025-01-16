document.getElementById("generate-btn").addEventListener("click", () => {
  
const experience = document.getElementById("my-experience").value;
const apName= document.getElementById("full-name").value;
const dob =document.getElementById("date-of-birth").value;
const gender = document.getElementById("gender").value;
  const preview = ` <div>
                    <h2 style="text-align: center;">CURRICULUM VITAE</h2>
                    <p class="section-title">Career Objective</p>
                    <p class="cv-details">
                        To make an impact on the organization by providing effective, comprehensive services and enhance my ability continuously by learning new culture and behaviors.
                    </p>
                    
                    <p class="section-title">Personal Details</p>
                    <p class="cv-details">Name <span class="colon-divider">:</span> <span class="data-placer">${apName}</span></p>
                    <p class="cv-details">Date of Birth <span class="colon-divider">:</span><span class="data-placer">${dob}</span></p>
                    <p class="cv-details">Gender <span class="colon-divider">:</span> <span class="data-placer">${gender}</span></p>
                    <p class="cv-details">Nationality <span class="colon-divider">:</span> Nepalese</p>
                    <p class="cv-details">Religion <span class="colon-divider">:</span> Hindu</p>
                    <p class="cv-details">Marital Status <span class="colon-divider">:</span> Married</p>
                    <p class="cv-details">Father’s Name <span class="colon-divider">:</span> Dinanath Bhurtel</p>
                    <p class="cv-details">Mother’s Name <span class="colon-divider">:</span> Yamkala Bhurtel</p>
                    <p class="cv-details">Wife’s Name <span class="colon-divider">:</span> Amisha Bashyal</p>
                    <p class="cv-details">Birth Place <span class="colon-divider">:</span> Parbat, Nepal</p>
                    <p class="cv-details">Permanent Address <span class="colon-divider">:</span> Laxmipur, Devchuli 12, Nawalparasi (East), Nepal</p>
                    <p class="cv-details">Temporary Address <span class="colon-divider">:</span> Maharajgunj, Kathmandu, Nepal</p>
                    <p class="cv-details">Language Known <span class="colon-divider">:</span> Nepali, Hindi & English</p>
                    <p class="cv-details">Contact No <span class="colon-divider">:</span> +977 9813525182‬</p>
                    <p class="cv-details">Email <span class="colon-divider">:</span> bhurtelbhai77@gmail.com</p>
                    
                    <p class="section-title">Academic Qualification</p>
                    <p class="cv-details">
                        Completed SLC (10) from Shree Parbat English Boarding Secondary School, Parbat, Nepal in April, 2014 A.D.
                    </p>

                    <p class="section-title"><b>Passport Details</b></p>
                    <p class="cv-details">Passport No <span class="colon-divider">:</span> PA3569588</p>
                    <p class="cv-details">Issue Date <span class="colon-divider">:</span> 16 Dec 2024</p>
                    <p class="cv-details">Expiry Date <span class="colon-divider">:</span> 15 Dec 2034</p>
                    <p class="cv-details">Issuing Authority <span class="colon-divider">:</span> MOFA, Department of Passport</p>

                    <p class="section-title"><b>Work Experience</b></p>
                    <p class="cv-experience">
                        ${experience}
                    </p>

                    <p class="section-title"><b>Declaration</b></p>
                    <p class="cv-details">
                        I hereby declare that all information given above are true and correct to the best of my knowledge and belief.
                    </p>
                </div>
      
    `;

  const previewContainer = document.getElementById("cv-preview");
  previewContainer.innerHTML = preview;
  previewContainer.appendChild(workExperienceTable);
  previewContainer.innerHTML += additionalContent;
});
