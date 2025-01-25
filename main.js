import { hexToHsl } from './color-converter.js';
import { autocomplete } from './autocomplete.js';

let results = document.querySelector('.results');
let searchInput = document.querySelector('#search');
let hueSlider = document.querySelector('#hue');
let card = document.querySelector('.card');



fetch("shadelisting.shade.json").then(success => {
  success.json().then(data => {
    let shades = data.shade;

    let colorNames = shades.map(color => color.entityName);
    autocomplete(searchInput, colorNames);

    // Display initial results (filtered by page number 15 as example)
    let initialFilteredObjects = shades.filter(obj => obj.pageNumber === '15');
    displayResults(initialFilteredObjects);

    // Event listener for search input
    searchInput.addEventListener('input', () => searchShades(shades));

    // Event listener for hue slider
    hueSlider.addEventListener('change', () => {
      let hue = Number(hueSlider.value);
      let threshold = 10;
      let minHue = hue - threshold;
      let maxHue = hue + threshold;
      let filteredByHue = filterByHue(shades, minHue, maxHue);
      // Sort the filtered colors by lightness
      sortShades(filteredByHue)
      displayResults(filteredByHue);
      searchInput.blur()
    });
  });
});

function searchShades(shades) {
  let searchValue = searchInput.value;
  if (searchValue.length === 0) {
    return;
  }
  let foundObjects = shades.filter(obj =>
    obj.entityName.toLowerCase().includes(searchValue.toLowerCase()) ||
    obj.entityCode.toLowerCase().includes(searchValue)
  );

  if (foundObjects.length !== 0) {
    displayResults(foundObjects);
  } else {
    results.innerHTML = 'No Matches';
  }
}

function displayResults(objects) {
  results.innerHTML = '';
  objects.forEach(val => addCard(val));
}

let activeElement = null;
let activePopupCard = null;

function addCard(colorObj) {
  let colorBox = document.createElement('div');
  colorBox.className = 'colorBox';
  colorBox.style.background = colorObj.shadeHexCode;
  results.appendChild(colorBox);

  colorBox.addEventListener('click', e => {
    //console.log(colorObj);

    // If an active element exists, remove the 'active' class and the popupCard from it
    if (activeElement && activePopupCard) {
      if (colorBox == activeElement) return;
      activeElement.classList.remove('active');
      activeElement.removeChild(activePopupCard);
      activeElement.style.transform = ''
    }


    // Add the 'active' class to the clicked colorBox
    colorBox.classList.add('active');

    // Create and append the popupCard
    let popupCard = document.createElement('div');
    popupCard.className = 'popupCard';
    popupCard.innerHTML = `
    <div class="title">
      <span class="colorName">${colorObj.entityName}</span>
      <span class="colorCode">${colorObj.entityCode}</span>
    </div>
    <div class="colorCard" style="background:${colorObj.shadeHexCode}"></div>
    <button class="askBtn" onclick="sendMail('${colorObj.entityName}','${colorObj.entityCode}')">Ask Price</button>`;
    colorBox.appendChild(popupCard);
    setTimeout(() => {
      let rect = colorBox.getBoundingClientRect();
      let width = window.innerWidth
      let leftOffset = 0
      if (rect.left < 0) {
        console.log(rect.left)
        leftOffset = Math.abs(rect.left) + 10
      } else if (rect.right > width) {
        leftOffset = (width - rect.right) - 20
      }
      colorBox.style.transform = `translateX(${leftOffset}px) scale(4)`
    }, 200)

    // Update the active element and activePopupCard
    activeElement = colorBox;
    activePopupCard = popupCard;
  });
}

document.addEventListener('click', function(event) {
  if (activeElement && !activeElement.contains(event.target)) {
    activeElement.classList.remove('active');
    if (activePopupCard) {
      activeElement.removeChild(activePopupCard);
    }
    activeElement.style.transform = '';
    activeElement = null;
    activePopupCard = null;
  }
});


function filterByHue(array, minHue, maxHue) {
  return array.filter(obj => {
    let [h, , ] = hexToHsl(obj.shadeHexCode);
    return (h >= minHue && h <= maxHue);
  });
}

function sortShades(shades) {
  shades.sort((a, b) => {
    let [hA, sA, lA] = hexToHsl(a.shadeHexCode);
    let [hB, sB, lB] = hexToHsl(b.shadeHexCode);

    // First sort by lightness, then by saturation if lightness is equal
    /*
    if (lA === lB) {
      return sB - sA;
    } else {
      return lB - lA;
    }
    */
    return lB - lA;
    //return sB - sA;
  });
}

function _sortShades(shades) {
  shades.sort((a, b) => {
    let [hA, sA, lA] = hexToHsl(a.shadeHexCode);
    let [hB, sB, lB] = hexToHsl(b.shadeHexCode);

    // First sort by lightness, then by saturation if lightness is equal
    if (lA === lB) {
      return sB - sA;
    } else {
      return lB - lA;
    }
  });
}

function sendMail(name,code) {
  var recipient = "baatdekha@gmail.com";
  var subject = "Enquiry about Color Price";
  var body = `I want the following color.\nName - ${name} (${code}) color\nMy Mobile no. is - `;

  var mailtoLink = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  window.location.href = mailtoLink;
}
window.sendMail = sendMail
