function loadDoc(button) {
  var source = button.getAttribute("data-source"); // Get the source URL from the button's data-source attribute
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", source, true); // Use the dynamic source URL
  xhttp.send();
}
