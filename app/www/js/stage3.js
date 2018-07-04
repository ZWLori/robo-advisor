function store_rating(){
    // TODO obtain the real value
    sessionStorage.setItem('rating', 1);
    document.location.href = './stage4.html';
}

if (sessionStorage.getItem('convStyle') == 'dominant')
    $('#roboName').text("Max")
else
    $('#roboName').text("Linus")
    
