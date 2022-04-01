// declare global {
//     namespace JSX {
//       interface IntrinsicElements {
//         'wc-auto-complete': { autocompletedata: [] };
//       }
//     }
//   }

export class AutoCompleteElement extends HTMLElement {
  private autoCompleteData: string[] = [];
  static autoCompleteValue: string = "";

  constructor() {
    super();

  }

  static get observedAttributes() {
    return ['autocompletedata'];
  }

  get autoCompleteDataInput(): string[] {
    return this.autoCompleteData; 
  }

  set autoCompleteDataInput(input: string[]) {
    this.autoCompleteData = input;
    var inp = this.querySelector("#myInput");
    this.autocomplete(inp, this.autoCompleteData, this);
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    if (oldValue != newValue) {
      this.autoCompleteData = newValue;
    }
  }

  connectedCallback() {
    this.innerHTML = this.innerHtml;
    
    var inp = this.querySelector("#autocompletediv");
    inp?.addEventListener("focusout", (event) => this.emitSelectedValue(new Event("Dummy")));
  }

  emitSelectedValue(event: Event) {
    console.log(AutoCompleteElement.autoCompleteValue);
    var customEvent = new CustomEvent('oncompletionselected', {
      detail: AutoCompleteElement.autoCompleteValue,
      bubbles: true,
      cancelable: false,
      composed: true
    });

    var div = document.getElementById("myInputautocomplete-list");
    var isFocused = (document.activeElement === div);

    this.dispatchEvent(customEvent);
  }

  autocomplete(inp: any, arr: any, that: any) {
    var currentFocus: any;

    
    inp.addEventListener("input", function (e: any) {
      var a, b, i, val = this.value; 
      AutoCompleteElement.autoCompleteValue = this.value;

      console.log("Ich hab grad:  " + this.value);

      closeAllLists(null);
      if (!val) { return false; }
      currentFocus = -1;

      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      this.parentNode.appendChild(a);

      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function (e) {
            AutoCompleteElement.autoCompleteValue = this.getElementsByTagName("input")[0].value;
            console.log("Bei click:    " + AutoCompleteElement.autoCompleteValue);
            //AutoCompleteElement.emitSelectedValue(null);
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists(null);
          });
          a.appendChild(b);
        }
      }

      return true;
    });

    inp.addEventListener("keydown", function (e: any) {
      var x = document.getElementById(this.id + "autocomplete-list");
      var y = null;
      if (x) y = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(y);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(y);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (y) {
            
            //AutoCompleteElement.autoCompleteValue = this.getElementsByTagName("input")[0].value;
            //console.log(AutoCompleteElement.autoCompleteValue);
            console.log("Hier bei enter");
            console.log(y[currentFocus]);
            
            //AutoCompleteElement.emitSelectedValue(null);
            y[currentFocus].click();
          } 
        }
      }
    });

    function addActive(x: any) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
      return true;
    }

    function removeActive(x: any) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt: any) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode?.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  private innerHtml : string = `
  <style>
  * {
  box-sizing: border-box;
}

body {
  font: 16px Arial;  
}

/*the container must be positioned relative:*/
.autocomplete {
  position: relative;
  display: inline-block;
}

input {
  border: 1px solid transparent;
  background-color: #f1f1f1;
  padding: 10px;
  font-size: 16px;
}

input[type=text] {
  background-color: #f1f1f1;
  width: 100%;
}

input[type=submit] {
  background-color: DodgerBlue;
  color: #fff;
  cursor: pointer;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  /*position the autocomplete items to be the same width as the container:*/
  top: 100%;
  left: 0;
  right: 0;
}

.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff; 
  border-bottom: 1px solid #d4d4d4; 
}

/*when hovering an item:*/
.autocomplete-items div:hover {
  background-color: #e9e9e9; 
}

/*when navigating through the items using the arrow keys:*/
.autocomplete-active {
  background-color: DodgerBlue !important; 
  color: #ffffff; 
}
  </style>
 <label>Try to find your name:</label>
 <form autocomplete="off">
 <div class="autocomplete" id="autocompletediv" style="width:300px;">
   <input id="myInput" type="text">
 </div>
 
</form>
 `;
}

window.customElements.get('wc-auto-complete') || window.customElements.define('wc-auto-complete', AutoCompleteElement);