/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla",
"Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria",
"Azerbaijan","Bahamas","Bahrain","Bangladesh","B"];

autocomplete(document.getElementById("myInput"), countries);

function autocomplete(inp, arr) {
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
  

// var search_terms = ['apple', 'apple watch', 'apple macbook', 'apple macbook pro', 'iphone', 'iphone 12'];
 
// function autocompleteMatch(input) {
//   if (input == '') {
//     return [];
//   }
//   var reg = new RegExp(input)
//   return search_terms.filter(function(term) {
// 	  if (term.match(reg)) {
//   	  return term;
// 	  }
//   });
// }
 
// function showResults(val) {
//   res = document.getElementById("result");
//   res.innerHTML = '';
//   let list = '';
//   let terms = autocompleteMatch(val);
//   for (i=0; i<terms.length; i++) {
//     list += '<li>' + terms[i] + '</li>';
//   }
//   res.innerHTML = '<ul>' + list + '</ul>';
// }