// False: lab experiment; True: online version
var online_version = false;
var chosen_options = [];
var roboName = "";
var convStyle = "";
// Generate random user id, a 6-digit value
// var user_id = Math.floor(Math.random() * 900000) + 100000;
// sessionStorage.setItem('user_id', user_id);


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

function store_matric_no() {
    document.location.href = './stage0.html';
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

