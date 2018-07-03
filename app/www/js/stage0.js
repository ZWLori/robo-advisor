// False: lab experiment; True: online version
var online_version = true;
var chosen_options = [];

$(window).on('load', function () {
    if (online_version) {
        rand_int = Math.random() > 0.5 ? 1 : 0;
        if (rand_int)
            sessionStorage.setItem('convStyle', 'submissive');
        else
            sessionStorage.setItem('convStyle', 'dominant');
        sessionStorage.setItem('online', online_version);
        sessionStorage.setItem('matricNum', (Math.floor(Math.random()*900000) + 100000));
        document.location.href = "./stage1.html";
    }
    else 
        $('#attrForm').css('display', 'block');

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