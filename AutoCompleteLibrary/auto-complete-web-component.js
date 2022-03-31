// create type for React app
// declare global {
//     namespace JSX {
//       interface IntrinsicElements {
//         'wc-auto-complete': { count: [] };
//       }
//     }
//   }

class AutoCompleteElement extends HTMLElement {
  static get observedAttributes() {
   return ['autocompletedata'];
 }

 constructor() {
   super();    
   var list = this.getAttribute("autocompletedata");

   if (list !== null) {
     this.autoCompleteData = JSON.parse(list);
   }
 }

 autoCompleteData = ["Daniel","Felix","Niklas","Sebastian","Fendrich","Bernhard",
  "Stefan","Lukas","Benny","Karin","Sarah","Resa",
  "Lisa","Helena","Claudia","Katrin", "Benjamin"];

 //autoCompleteData = [];

 attributeChangedCallback(name, oldValue, newValue) {   

   if (oldValue != newValue) {
     this.autoCompleteData = newValue;
     var input = this.querySelector("#myInput");
     //this.autocomplete(input, this.autoCompleteData);
   }
 }

 get autoCompleteData() {
   return this.autoCompleteData || [];
 }

 set autoCompleteData(data) {
   this.autoCompleteData = data;
   this.autocomplete(input, this.autoCompleteData);
 }

 connectedCallback() {
   //this.setAttribute('autoCompleteData', '[]');
   this.innerHTML = `
   <label>Try to find your name:</label>
   <form autocomplete="off">
   <div class="autocomplete" style="width:300px;">
     <input id="myInput" type="text">
   </div>
   
 </form>
   `;

   //var input = this.querySelector("#myInput");
   //this.autocomplete(input, this.autoCompleteData);
 }

autocomplete(inp, arr) {
   var currentFocus;

   inp.addEventListener("input", function(e) {
       var a, b, i, val = this.value;
       closeAllLists();
       if (!val) { return false;}
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
           b.addEventListener("click", function(e) {
               inp.value = this.getElementsByTagName("input")[0].value;
               closeAllLists();
           });
           a.appendChild(b);
         }
       }
   });

   inp.addEventListener("keydown", function(e) {
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
           if (y) y[currentFocus].click();
         }
       }
   });

   function addActive(x) {
     if (!x) return false;
     removeActive(x);
     if (currentFocus >= x.length) currentFocus = 0;
     if (currentFocus < 0) currentFocus = (x.length - 1);
     x[currentFocus].classList.add("autocomplete-active");
   }

   function removeActive(x) {
     for (var i = 0; i < x.length; i++) {
       x[i].classList.remove("autocomplete-active");
     }
   }

   function closeAllLists(elmnt) {
     var x = document.getElementsByClassName("autocomplete-items");
     for (var i = 0; i < x.length; i++) {
       if (elmnt != x[i] && elmnt != inp) {
         x[i].parentNode.removeChild(x[i]);
       }
     }
   }

   document.addEventListener("click", function (e) {
       closeAllLists(e.target);
   });
 }
}

window.customElements.get('wc-auto-complete') || window.customElements.define('wc-auto-complete', AutoCompleteElement);