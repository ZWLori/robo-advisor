function verification(){
    if ($('#verificationCode').val() != '345')
        alert("Wrong verification code! Please answer the questions and provide the correct code.")
    else {
        $.post('/upload.php',{
            'stage': 'final',
            'matric_number': sessionStorage.getItem('matricNum'),
            'bonus': sessionStorage.getItem('bonus'),
            'rating': sessionStorage.getItem('rating')
        })
        document.location.href = './end.html'
    }
}

$("#bonus").text(sessionStorage.getItem('bonus'));

if (sessionStorage.getItem("online"))
    $("#uniqueId").text("Your auto-generated ID is " + sessionStorage.getItem("matricNum") + " .");
else
    $("#uniqueId").text("Your ID would be the same as your matric number.");
    