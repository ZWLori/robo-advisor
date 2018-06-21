
var monthIndex = 0;
var totalInterval = 12;  // Investment horizon
var startY = 2016, startM = 1;
var principle = totalGain = 10000;
var low_mean = -0.03, low_var = 2.661;
var medium_mean = 0.452, medium_var = 2.661;
var high_mean = 1.158, high_var = 2.661;
var base_mean = 0.125;
var rangeLst = []; // store the user selected range value
var robo = [] // the returns from robo-advisor
var base = get_returns(base_mean, 0) // Fixed: annualized return
var user = [] // the returns for user TODO: fill-in the list
// datapoints
var dps_user = [], dps_base = [], dps_robo = [];


// add slider
$("#slider").roundSlider({
    radius: 85,
    sliderType: "min-range",
    value: 50,
    width: 25,

});

$("#performance-slider").roundSlider({
    min: 0,
    max: 10,
    step: 1,
    value: 5,
    radius: 85,
    width: 25,
    sliderType: "min-range"
});


$(window).on('load', function(){
    get_attrs();
});

function get_attrs() {
    var convStyle = sessionStorage.getItem("convStyle");
    // change the avatar based on requirements
    if (convStyle == 'dominant')
        $("#robo-image").attr("src", "images/avatar/D-Robo.png");
    else if (convStyle == 'submissive')
        $("#robo-image").attr("src", "images/avatar/S-Robo.png");
}

for (i=0; i<totalInterval; i++){
    if (startM % 12 == 1){
        startY += 1;
        startM = 1;
    }
    dps_user.push({x:new Date(startY, startM-1)});
    dps_base.push({x:new Date(startY, startM-1)});
    dps_robo.push({x:new Date(startY, startM-1)})
    startM += 1;
}

function read_slider_val(){
    var slider_obj = $("#slider").data("roundSlider");
    return slider_obj.option("value");
}

function read_performance_slider_val(){
    var slider_obj = $("#performance-slider").data("roundSlider");
    return slider_obj.option("value");
}

var performanceLevelInt = Math.floor(Math.random() * 3);
// performance level: 0 - "low", 1 - "medium", 2 -"high"
sessionStorage.setItem("performanceLevel", performanceLevelInt);
console.log("performance level: " + performanceLevelInt);

var chart = new CanvasJS.Chart("chartContainer", {
    title :{
        text: "Investment returns over time"
    },
    axisX: {
        title: "Time Horizon",
    },
    axisY: {
        title: "Net Asset Value",
        includeZero: false
    },
    data: [{
        type: "line",
        showInLegend: true,
        legendText: "Robo Advisor",
        dataPoints: dps_robo
    },
        {
            type: "line",
            showInLegend: true,
            legendText: "Bank Deposit",
            dataPoints: dps_base
        },
        {
            type: "line",
            showInLegend: true,
            legendText: "Your Potfolio",
            dataPoints: dps_user,
            borderWidth: 2
        }
    ]
});
chart.render();

var robo = []
var base = get_returns(base_mean, 0) // Fixed: annualized return
switch(performanceLevelInt) {
    case 0 : robo = get_returns(low_mean, low_var); break; // Low: annualized return = 6% +- 4%
    case 1 : robo = get_returns(medium_mean, medium_var); break; // Medium: annualized return = 10% +- 4%
    case 2 : robo = get_returns(high_mean, high_var); break; // High: annualized return = 18% +- 4%
}

// update the chart with corresponding return values
function updateChart(index) {
    dps_robo[index]["y"] = robo[index];
    dps_base[index]["y"] = base[index];
    dps_user[index]["y"] = user[index];
    chart.render();
};

function normal_random(n, mean, variance) {
    if (mean == undefined)
        mean = 0.0;
    if (variance == undefined)
        variance = 1.0;
    var V1, V2, S;

    result = [];
    for(i=0; i<n; i++) {
        do {
            var U1 = Math.random();
            var U2 = Math.random();
            V1 = 2 * U1 - 1;
            V2 = 2 * U2 - 1;
            S = V1 * V1 + V2 * V2;
        } while (S > 1);

        X = Math.sqrt(-2 * Math.log(S) / S) * V1;
        //  Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
        X = mean + Math.sqrt(variance) * X;
        //  Y = mean + Math.sqrt(variance) * Y ;
        result.push(X);
    }

    return result;
}

function get_returns(mean, sd){
    var rnorm = normal_random(n=totalInterval, mean=mean, sd=sd)
    var cumsum = [];
    rnorm.reduce(function(a,b,i) { return cumsum[i] = a+b; },0);
    cumsum.forEach(function(element, index) {
        // cumsum[index] = element + 10000;
        cumsum[index] = (element + 100) * 0.01 * principle;
    })
    return cumsum;
}

function confirm(){
    if (monthIndex >= totalInterval) {
        document.getElementById("demo").style.display = 'none';
        document.getElementById("demo-eval").style.display = 'block';
        return;
    }

    // range = slider.value;
    range = read_slider_val();

    // gain = corrsponding percentage * previous totalGain * gainRatio
    // monthly gain earned by robo & bank respectively
    if (monthIndex == 0) {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / principle - 1) ;
        bMGain = range * 0.01 * totalGain * (base[monthIndex] / principle - 1);
    } else {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / robo[monthIndex-1] - 1);
        bMGain = (1 - range * 0.01)  * totalGain * (base[monthIndex] / base[monthIndex-1] - 1);
    }

    totalGain = totalGain + rMGain + bMGain;
    margin = totalGain - principle;
    document.getElementById("total-return").innerHTML = Math.round(totalGain*100)/100;

    user.push(totalGain);
    rangeLst.push(range);
    updateChart(monthIndex);

    document.getElementById("1m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 1);
    document.getElementById("1m-base").innerHTML = calculatePastReturn(base, monthIndex, 1);
    document.getElementById("1m-user").innerHTML = calculatePastReturn(user, monthIndex, 1);
    if(monthIndex >= 2){
        document.getElementById("3m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 2);
        document.getElementById("3m-base").innerHTML = calculatePastReturn(base, monthIndex, 2);
        document.getElementById("3m-user").innerHTML = calculatePastReturn(user, monthIndex, 2);
    }
    if(monthIndex >= 5){
        document.getElementById("6m-robo").innerHTML = calculatePastReturn(robo, monthIndex, 5);
        document.getElementById("6m-base").innerHTML = calculatePastReturn(base, monthIndex, 5);
        document.getElementById("6m-user").innerHTML = calculatePastReturn(user, monthIndex, 5);
    }
    monthIndex += 1;
}

function calculatePastReturn(lst, index, num){
    if (index){
        pastReturn = lst[index] - lst[index-num];
        return (pastReturn/lst[index-num]*100).toFixed(3) + "%";
    }
    else {
        pastReturn = lst[index] - principle;
        return (pastReturn/principle*100).toFixed(3) + " %";
    }
}

function save(){
    console.log("manipulation" + read_performance_slider_val());

    $.post('/upload.php', {
        'stage':'demo',
        'id':sessionStorage.getItem('user_id'),
        'user_gain_list': user,
        'performance': performanceLevelInt
    })
    document.location.href = './exp.html';
}
