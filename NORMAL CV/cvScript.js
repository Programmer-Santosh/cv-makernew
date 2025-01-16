document.getElementById("generate-btn").addEventListener("click", () => {
  
const experience = document.getElementById("my-experience").value;
const apName= document.getElementById("full-name").value;
const dob =document.getElementById("date-of-birth").value;
const gender = document.getElementById("gender").value;
const nationality =document.getElementById("nationality").value;
const religion = document.getElementById("religion").value;
const maritalStatus = document.getElementById("marital").value;
const fatherName = document.getElementById("father-name").value;
const motherName = document.getElementById("mother-name").value;
const wifeName = document.getElementById("wife-name").value;
const birthPlace= document.getElementById("city-of-birth").value;
const mainAddress= document.getElementById("full-address").value;

const tempAdd = document.getElementById("temp-address").value;
const phone = document.getElementById("contact").value;

const emailAdd = document.getElementById("email").value.toLowerCase();

const acLevel =document.getElementById("academic-level").value;
const school =document.getElementById("school-name").value;
const passDate =document.getElementById("pass-date").value;
  const preview = ` <div>
                    <h2 style="text-align: center;">CURRICULUM VITAE</h2>
                    <p class="section-title"><b>Career Objective</b></p>
                    <p class="cv-details">
                       <i> To make an impact on the organization by providing effective, comprehensive services and enhance my ability continuously by learning new culture and behaviors.</i>
                    </p>
                    
                    <p class="section-title"><b>Personal Details</b></p>
                    <p class="cv-details">Name <span class="colon-divider">:</span> <span class="data-placer">${apName}</span></p>
                    <p class="cv-details">Date of Birth <span class="colon-divider">:</span><span class="data-placer">${dob}</span></p>
                    <p class="cv-details">Gender <span class="colon-divider">:</span> <span class="data-placer">${gender}</span></p>
                    <p class="cv-details">Nationality <span class="colon-divider">:</span> <span class="data-placer">${nationality}</span></p>
                    <p class="cv-details">Religion <span class="colon-divider">:</span><span class="data-placer">${religion}</span></p>
                    <p class="cv-details">Marital Status <span class="colon-divider">:</span> <span class="data-placer">${maritalStatus}</span></p>
                    <p class="cv-details">Father Name <span class="colon-divider">:</span><span class="data-placer">${fatherName}</span></p>
                    <p class="cv-details">Mother Name <span class="colon-divider">:</span> <span class="data-placer">${motherName}</span></p>
                    <p class="cv-details hide-on-empty ${wifeName.trim() === "" ? "hide" : ""}">Wife Name <span class="colon-divider">:</span> <span class="data-placer">${wifeName}</span></p>
                    <p class="cv-details">Birth Place <span class="colon-divider">:</span> <span class="data-placer">${birthPlace}</span></p>
                    <p class="cv-details">Permanent Address <span class="colon-divider">:</span> <span class="data-placer">${mainAddress}</span></p>
                    <p class="cv-details hide-on-empty ${tempAdd.trim() === "" ? "hide" : ""}">Temporary Address <span class="colon-divider">:</span><span class="data-placer">${tempAdd}</span></p>
                    <p class="cv-details">Language Known <span class="colon-divider">:</span> <span class="data-placer" contenteditable="true">Nepali, English & Hindi</span></p>
                    <p class="cv-details">Contact No <span class="colon-divider">:</span> <span class="data-placer" contenteditable="true">+977 ${phone}</span></p>
                    <p class="cv-details hide-on-empty ${emailAdd.trim() === "" ? "hide" : ""}"">Email <span class="colon-divider">:</span> <span class="data-placer">${emailAdd}</span></p>
                    
                    <p class="section-title"><b>Academic Qualification</b></p>
                    <p class="cv-details">
                        Completed ${acLevel} from ${school} in ${passDate} A.D.
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
