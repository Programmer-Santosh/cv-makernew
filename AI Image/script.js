const uploadPassport = document.getElementById('uploadPassport');
const passportImage = document.getElementById('passportImage');
const rawOCRTextDiv = document.getElementById('rawOCRText');
const parsedDetailsDiv = document.getElementById('parsedDetails');
const errorDiv = document.getElementById('error');
const showDetailsButton = document.getElementById('showDetailsButton');

let ocrTextCache = ''; // Cache OCR text to avoid re-scanning if already done

// Load nationalities data
let nationalitiesData = [];
async function loadNationalities() {
  try {
    const response = await fetch('./nationalities.json'); // Adjust path if necessary
    if (!response.ok) throw new Error('Failed to load nationalities.json');
    nationalitiesData = await response.json();
    console.log('Nationalities data loaded:', nationalitiesData);
  } catch (error) {
    console.error('Error loading nationalities:', error);
    nationalitiesData = []; // Ensure it's an empty array if loading fails
  }
}

// Load districts data
let districtsData = [];
async function loadDistricts() {
  try {
    const response = await fetch('./districts.json'); // Adjust path if necessary
    if (!response.ok) throw new Error('Failed to load districts.json');
    districtsData = await response.json();
    console.log('Districts data loaded:', districtsData);
  } catch (error) {
    console.error('Error loading districts:', error);
    districtsData = []; // Ensure it's an empty array if loading fails
  }
}

// Perform OCR with preprocessing
async function performOCRWithPreprocessing(file) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.src = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const rotations = [0, 90, 180, 270];
      let bestResult = { text: '', confidence: 0 };

      for (let angle of rotations) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        const imageData = canvas.toDataURL();

        try {
          const { data } = await Tesseract.recognize(imageData, 'eng', {
            logger: (info) => console.log(info),
          });

          if (data.confidence > bestResult.confidence) {
            bestResult = { text: data.text, confidence: data.confidence };
          }
        } catch (error) {
          console.error('OCR failed for one rotation:', error);
        }
      }

      if (bestResult.text) {
        resolve(bestResult.text.trim());
      } else {
        reject('OCR failed to extract text.');
      }
    };

    img.onerror = () => reject('Failed to load image.');
  });
}

// Match nationality using OCR text
function matchNationality(ocrText) {
  if (!nationalitiesData || !nationalitiesData.countries || nationalitiesData.countries.length === 0) {
    console.warn('Nationality data not loaded or invalid.');
    return 'Nationality data not loaded';
  }

  const matchedEntry = nationalitiesData.countries.find((entry) => {
    const countryRegex = new RegExp(`\\b${entry.country}\\b`, 'i');
    const nationalityRegex = new RegExp(`\\b${entry.nationality}\\b`, 'i');
    return countryRegex.test(ocrText) || nationalityRegex.test(ocrText);
  });

  return matchedEntry ? matchedEntry.nationality : 'Not Found';
}

// Match birthplace using OCR text
function matchBirthplace(ocrText) {
  if (!districtsData || !districtsData.districts || districtsData.districts.length === 0) {
    console.warn('Districts data not loaded or invalid.');
    return 'Districts data not loaded';
  }

  const matchedDistrict = districtsData.districts.find((district) => {
    const districtRegex = new RegExp(`\\b${district}\\b`, 'i');
    return districtRegex.test(ocrText);
  });

  return matchedDistrict || 'Not Found';
}

// Parse passport details
function parsePassportDetails(ocrText) {
  const details = {
    surname: '',
    givenNames: '',
    passportNumber: '',
    nationality: '',
    dob: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    birthplace: '', // Added birthplace field
  };

  details.surname = (ocrText.match(/SURNAME[:|]?\s*([A-Z]+)/i) || [])[1] || '';
  details.givenNames = (() => {
    const match = ocrText.match(/(?:GIVEN\s*?NAMES|givennames|Given\s*Names)[:|]?\s*([\w\s]+)/i);
    return match ? match[1].trim() : '';
  })();

  details.passportNumber = (() => {
    const matches = ocrText.match(/\b(?:[A-Z]{2}\d{6,8}|\d{8,9})\b/);
    if (matches && matches[0]) {
      const candidate = matches[0].replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (/^[A-Z]{2}\d{6,8}$/.test(candidate) || /^\d{8,9}$/.test(candidate)) {
        return candidate;
      }
    }
    return '';
  })();

  details.nationality = matchNationality(ocrText);
  details.birthplace = matchBirthplace(ocrText); // Match birthplace from districts.json

  details.dob = (() => {
    const dateMatches = ocrText.match(/\b\d{2}\s\w+\s\d{4}\b/g) || [];
    if (dateMatches.length > 0) {
      const parsedDates = dateMatches.map(dateStr => {
        const [day, month, year] = dateStr.split(' ');
        const monthIndex = new Date(`${month} 1, 2000`).getMonth();
        return new Date(parseInt(year), monthIndex, parseInt(day));
      });

      const oldestDate = parsedDates.reduce((oldest, current) => {
        return current < oldest ? current : oldest;
      }, parsedDates[0]);

      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return oldestDate.toLocaleDateString('en-GB', options).toUpperCase();
    }
    return '';
  })();

  details.dateOfIssue = (() => {
    const dateMatches = ocrText.match(/\b\d{2}\s\w+\s\d{4}\b/g) || [];
    if (dateMatches.length > 0) {
      const parsedDates = dateMatches.map(dateStr => {
        const [day, month, year] = dateStr.split(' ');
        const monthIndex = new Date(`${month} 1, 2000`).getMonth();
        return new Date(parseInt(year), monthIndex, parseInt(day));
      });

      const sortedDates = parsedDates.sort((a, b) => a - b);
      const dateOfIssue = sortedDates[1];

      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return dateOfIssue.toLocaleDateString('en-GB', options).toUpperCase();
    }
    return '';
  })();

  details.dateOfExpiry = (() => {
    const dateMatches = ocrText.match(/\b\d{2}\s\w+\s\d{4}\b/g) || [];
    if (dateMatches.length > 0) {
      const parsedDates = dateMatches.map(dateStr => {
        const [day, month, year] = dateStr.split(' ');
        const monthIndex = new Date(`${month} 1, 2000`).getMonth();
        return new Date(parseInt(year), monthIndex, parseInt(day));
      });

      const sortedDates = parsedDates.sort((a, b) => a - b);
      const dateOfExpiry = sortedDates[2];

      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return dateOfExpiry.toLocaleDateString('en-GB', options).toUpperCase();
    }
    return '';
  })();

  return details;
}

// Display parsed details
function displayParsedDetails(details) {
  parsedDetailsDiv.innerHTML = `
    <div><strong>Surname:</strong> ${details.surname || 'Not Found'}</div>
    <div><strong>Given Names:</strong> ${details.givenNames || 'Not Found'}</div>
    <div><strong>Passport Number:</strong> ${details.passportNumber || 'Not Found'}</div>
    <div><strong>Nationality:</strong> ${details.nationality || 'Not Found'}</div>
    <div><strong>Birthplace:</strong> ${details.birthplace || 'Not Found'}</div>
    <div><strong>Date of Birth:</strong> ${details.dob || 'Not Found'}</div>
    <div><strong>Date of Issue:</strong> ${details.dateOfIssue || 'Not Found'}</div>
    <div><strong>Date of Expiry:</strong> ${details.dateOfExpiry || 'Not Found'}</div>
  `;
}

// Handle file upload
uploadPassport.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  passportImage.src = URL.createObjectURL(file);
  rawOCRTextDiv.textContent = 'Processing OCR...';
  parsedDetailsDiv.textContent = 'Extracting details...';
  errorDiv.textContent = '';

  try {
    ocrTextCache = await performOCRWithPreprocessing(file);
    rawOCRTextDiv.textContent = ocrTextCache;
  } catch (error) {
    console.error(error);
    errorDiv.textContent = error.message || 'An error occurred during processing.';
    rawOCRTextDiv.textContent = 'No text extracted.';
    parsedDetailsDiv.textContent = 'No details extracted.';
  }
});

// Handle show details button click
showDetailsButton.addEventListener('click', () => {
  const ocrText = rawOCRTextDiv.textContent.trim() || ocrTextCache;
  if (!ocrText) {
    errorDiv.textContent = 'No OCR text found. Please upload an image or edit the text.';
    return;
  }
  const details = parsePassportDetails(ocrText);
  displayParsedDetails(details);
});

// Load nationalities and districts on page load
window.addEventListener('load', () => {
  loadNationalities();
  loadDistricts();
});
