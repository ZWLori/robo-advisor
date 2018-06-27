// False: lab experiment; True: online version
var online_version = false;
var chosen_options = [];
var convStyle = "";

$(window).on('load', function () {
    if (online_version) {
        rand_int = Math.random() > 0.5 ? 1 : 0;
        if (rand_int)
            var convStyle = 'submissive';
        else
            var convStyle = 'dominant';
    }

})

$('.btn-conv').click(function(){
    sessionStorage.setItem("convStyle", this.value);
});


$('.btn-study').click(function(){
    sessionStorage.setItem("studyNum", this.value);
})

function store_matric_no() {
    sessionStorage.setItem("matricNum", $('input').val());
    document.location.href = "./stage1.html";

}