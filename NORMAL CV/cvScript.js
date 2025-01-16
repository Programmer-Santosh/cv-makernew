function previewImage(event) {
    const output = document.getElementById('imagePreview');
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader to read the file
      reader.onload = function() {
        output.src = reader.result; // Set the image preview to the data URL
        output.style.display = 'block'; // Show the image preview
      }
      reader.readAsDataURL(file); // Read the image as a data URL
    } else {
      output.style.display = 'none'; // Hide the preview if no file is selected
    }
  };


document.getElementById("generate-btn").addEventListener("click", () => {
  
    const imageUrl = document.getElementById('imagePreview').src;
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


const acLevel2 =document.getElementById("academic-level2").value;
const school2 =document.getElementById("school-name2").value;
const passDate2 =document.getElementById("pass-date2").value;

const acLevel3 =document.getElementById("academic-level3").value;
const school3 =document.getElementById("school-name3").value;
const passDate3 =document.getElementById("pass-date3").value;
const date1 = document.getElementById("start-date").value;
const date2 = document.getElementById("end-date").value;

const experience = document.getElementById("my-experience").value;
const experience2 = document.getElementById("my-experience2").value;
const experience3 = document.getElementById("my-experience3").value;

const passportNo = document.getElementById("pp-no").value;
const passportIssue = document.getElementById("issue-date").value;
const passportExp = document.getElementById("exp-date").value;



const citizenNo = document.getElementById("c-number").value;
const citizenIssue = document.getElementById("c-issue-date").value;
  const preview = ` <div>
                    <h2 style="text-align: center;">CURRICULUM VITAE</h2>
                    <p class="section-title"><b>Career Objective</b></p>
                    <p class="cv-details">
                       <i> To make an impact on the organization by providing effective, comprehensive services and enhance my ability continuously by learning new culture and behaviors.</i>
                    </p>
                   <div class="photoCV">
                <img src="${imageUrl}" alt="photo" style="width: 100px; height: 100px; object-fit: cover;" />
                   </div>
                    <div>
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
                    </div>
                    
                   
                    <p class="section-title"><b>Academic Qualification</b></p>
                    <p class="cv-details">
                        Completed ${acLevel} from ${school} in ${passDate}.
                    </p>
                     <p class="cv-details hide-on-empty ${school2.trim() === "" ? "hide" : ""}">
                    
                        Completed ${acLevel2} from ${school2} in ${passDate2}.
                    </p>
                     <p class="cv-details hide-on-empty ${acLevel3.trim() === "" ? "hide" : ""}">
                     <b>Trainings</b> <br/>
                        Completed ${passDate3}  ${acLevel3} Course from ${school3} starting from ${date1} to ${date2}.
                    </p>


                   <div class= "hide-on-empty ${passportNo.trim() === "" ? "hide" : ""}">

                    <p class="section-title "><b>Passport Details</b></p>
                    <p class="cv-details">Passport No <span class="colon-divider">:</span> <span class="data-placer">${passportNo}</span></p>
                    <p class="cv-details">Issue Date <span class="colon-divider">:</span><span class="data-placer">${passportIssue}</span></p>
                    <p class="cv-details">Expiry Date <span class="colon-divider">:</span> <span class="data-placer">${passportExp}</span></p>
                    <p class="cv-details">Issuing Authority <span class="colon-divider">:</span> <span class="data-placer">MOFA, Department of Passport</span></p>
                    </div>

                    <div class= "hide-on-empty ${citizenNo.trim() === "" ? "hide" : ""}">

                    <p class="section-title "><b>Citizenship Details</b></p>
                    <p class="cv-details">Citizenship No <span class="colon-divider">:</span> <span class="data-placer">${citizenNo}</span></p>
                    <p class="cv-details">Issue Date <span class="colon-divider">:</span><span class="data-placer">${citizenIssue}</span></p>

                    </div>
                    <p class="section-title"><b>Work Experience</b></p>
                    <p class="cv-experience">
                        ${experience}
                    </p>
                
                    <p class="cv-experience">
                        ${experience2}
                    </p>
                    <p class="cv-experience">
                        ${experience3}
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
