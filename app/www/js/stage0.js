// False: lab experiment; True: online version
var online_version = false;
var chosen_options = []
var roboName = ""
// Generate random user id, a 6-digit value
var user_id = Math.floor(Math.random() * 900000) + 100000;
sessionStorage.setItem('user_id', user_id);


$(window).on('load', function () {
    if (online_version) {
        rand_int = Math.random() > 0.5 ? 1 : 0;
        if (rand_int)
            var convStyle = 'submissive';
        else
            var convStyle = 'dominant';
    }

})

function get_attrs() {
    roboName = document.getElementById("name").value;
    gender = document.getElementById("gender");
    gender = gender.options[gender.selectedIndex].value;

    // store the info
    sessionStorage.setItem("roboName", roboName);
    sessionStorage.setItem("roboGender", gender);

    if (!online_version) {
        convStyle = document.getElementById("convStyle");
        convStyle = convStyle.options[convStyle.selectedIndex].value;
        sessionStorage.setItem("convStyle", convStyle);
    }
    else{
        sessionStorage.setItem("convStyle", convStyle);
    }

    store_user_input();
}

function store_user_input() {

    try {
        $.post('/upload.php', {
            'stage': 'orientation',
            'id': user_id,
            'name': $("#user_name").val(),
            'gender': $('#user_gender').find(':selected').text(),
            'marital_status': $('#marital_status').find(':selected').text(),
            'child_num': $('#child_num').find(':selected').text(),
            'annual_income': $('#annual_income').val(),
            'expectation': $('#user_exp').val()

        })

        document.location.href = './stage1.html';
    }
    catch(err) {
        document.location.href = './stage1.html';
    }


}
