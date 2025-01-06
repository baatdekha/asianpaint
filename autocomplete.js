export function autocomplete(inputElement, suggestionsArray, maxSuggestions = 10) {
  let currentFocus;

  inputElement.addEventListener("input", function() {
    let suggestionContainer, suggestionItem, inputValue = this.value;
    closeAllSuggestions();
    if (!inputValue) return false;
    currentFocus = -1;

    suggestionContainer = document.createElement("DIV");
    suggestionContainer.setAttribute("id", this.id + "autocomplete-list");
    suggestionContainer.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(suggestionContainer);

    let suggestionCount = 0;
    for (let i = 0; i < suggestionsArray.length && suggestionCount < maxSuggestions; i++) {
      if (suggestionsArray[i].substr(0, inputValue.length).toUpperCase() == inputValue.toUpperCase()) {
        suggestionItem = document.createElement("DIV");
        suggestionItem.innerHTML = "<strong>" + suggestionsArray[i].substr(0, inputValue.length) + "</strong>";
        suggestionItem.innerHTML += suggestionsArray[i].substr(inputValue.length);
        suggestionItem.innerHTML += "<input type='hidden' value='" + suggestionsArray[i] + "'>";

        suggestionItem.addEventListener("click", function() {
          inputElement.value = this.getElementsByTagName("input")[0].value;
          let event = new Event('input');
          inputElement.dispatchEvent(event);
          closeAllSuggestions();
        });
        suggestionContainer.appendChild(suggestionItem);
        suggestionCount++;
      }
    }
  });

  inputElement.addEventListener("keydown", function(e) {
    let suggestionItems = document.getElementById(this.id + "autocomplete-list");
    if (suggestionItems) suggestionItems = suggestionItems.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      setActive(suggestionItems);
    } else if (e.keyCode == 38) {
      currentFocus--;
      setActive(suggestionItems);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (suggestionItems) suggestionItems[currentFocus].click();
      }
    }
  });

  function setActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (items.length - 1);
    items[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllSuggestions(element) {
    let items = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < items.length; i++) {
      if (element != items[i] && element != inputElement) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }

  document.addEventListener("click", function(e) {
    closeAllSuggestions(e.target);
  });
}