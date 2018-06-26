
function store_rating(){
    document.location.href = './stage4.html';
}

/* For feedback slider */
var slider = document.getElementById("myRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}