document.getElementById("generate-btn").addEventListener("click", () => {
  const lastName = document.getElementById("last-name").value.toUpperCase();
  const firstName = document.getElementById("first-name").value.toUpperCase();
  const dob = document.getElementById("date-of-birth").value.toUpperCase();
 

  

  
  const qualification = document
    .getElementById("qualification")
    .value.toUpperCase();
  const cityBirth = document
    .getElementById("city-of-birth")
    .value.toUpperCase();
  const father = document.getElementById("father-name").value.toUpperCase();
  const mother = document.getElementById("mother-name").value.toUpperCase();
 
 
  const passport = document.getElementById("pp-no").value.toUpperCase();
  
  const issueDate = document.getElementById("issue-date").value.toUpperCase();
  const expDate = document.getElementById("exp-date").value.toUpperCase();
  const fullAddress = document
    .getElementById("full-address")
    .value.toUpperCase();
  const mStatus = document.getElementById("marital").value.toUpperCase();
 
  

  const workExperienceTable = document
    .getElementById("cvTable")
    .cloneNode(true);
  workExperienceTable.removeAttribute("id"); // Remove ID to prevent duplication
  workExperienceTable.style.marginTop = "20px";
  Array.from(workExperienceTable.rows).forEach((row) => {
    row.deleteCell(-1); // Remove the last column
  });

  const preview = `
      <h2 style="text-align: center;"><u>CURRICULUM VITAE</u></h2>
      <p>1.Numele [last Name]: ${lastName}</p>
      <p>2.Prenumele [Firstname]: ${firstName}</p>
      <p>3.Numele purtate anterior [Other names, maiden name]: </p>
      <p>4.Locul nasterii [Place of birth] Tara [Country]: NEPAL Localitatea [town/village]: ${cityBirth}</p>
      <p>5.Data nasterii [Date of birth]: ${dob}</p>
      <p>6.Parinti [parents]:- tata [father]: ${father}, mama [mother]: ${mother}</p>
      <p>7.Cetatenia [citizenship]: NEPAL</p>
      <p>8.Nationalitatea [nationality]: NEPALESE</p>
      <p>9.Documentul de trecere a frontierei [passport]: Nr. [No]: ${passport}, eliberat de autoritatile [issued by]:MOFA, DOP, NEPAL, la data [issue date]: ${issueDate}, valabil pana la [Validity]: ${expDate}</p>
      <p>10.Domiciliul [home address] Tara [country]: NEPAL, Localitatea [town/village]: ${fullAddress}</p>
      <p>11.Ultima resedinta [last address]: Tara [country]: NEPAL, Localitatea [town/village]: ${fullAddress}</p>
      <p>12.Stare civila [marital status]: ${mStatus}, copii aflati in intretinere [children]: NU</p>
      <p>13.Calificari profesionale [professional qualifications]: ${qualification} CLASE</p>
      <p>14. Traseu profesional (angajatori anteriori cu datele de identificare ale acestora, precum si functiile detinute):</p>
    `;

  const additionalContent = `
      <p>15.Profesia de baza [main profession]: GENERAL WORKER</p>
      <p>16.Limbi straine cunoscute [foreign languages]:  ENGLISH</p>
      <p>17.Alte mentiuni [other]: Declar pe proprie raspundere ca nu am antecedente penale, ca sunt apt de munca din punct de vedere medical si ca detin cunostinte minime de limba română si/sau o limba de circulatie internationala [I declare that i have no criminal record, that I am medically able to work, and I have minimal knowledge of Romanian and an international language].</p>
        <div style="text-align: right;"><p>Semnatura [Signature]:</p></div>
    `;

  const previewContainer = document.getElementById("cv-preview");
  previewContainer.innerHTML = preview;
  previewContainer.appendChild(workExperienceTable);
  previewContainer.innerHTML += additionalContent;
});
