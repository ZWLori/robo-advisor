var slider = document.getElementById("mySlider");
var output = document.getElementById("range");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}

var monthIndex = 0;
var totalInterval = 24;
var startY = 2016, startM = 1;
var principle = totalGain = 10000;
var low_mean = 0.25, low_var = 2;
var medium_mean = 0.8125, medium_var = 4;
var high_mean = 1.5, high_var = 4;
var base_mean = 0.25;
var roboMonthGainLst = [], bankMonthGainLst = [], totalLst = [], rangeLst = []; // for data record purpose, not in use now
// datapoints
var dps = [], dps_base = [];
for (i=0; i<totalInterval; i++){
    if (startM % 12 == 0){
        startY += 1;
        startM = 1;
    }
    dps.push({x:new Date(startY, startM-1)});
    dps_base.push({x:new Date(startY, startM-1)});
    startM += 1;
}

var chart = new CanvasJS.Chart("chartContainer", {
    title :{
        text: "Robo-Advisor"
    },
    axisX: {
        title: "Time horizon", 
    },
    axisY: {
        title: "Cumulative Returns",
        includeZero: false
    },      
    data: [{
            type: "line",
            showInLegend: true,
            legendText: "Robo-Advisor",
            dataPoints: dps
        },
        {
            type: "line",
            showInLegend: true,
            legendText: "Bank Deposit",
            dataPoints: dps_base
        }
    ]
});
chart.render();

var robo = []   
var base = get_returns(base_mean, 0) // Fixed: annualized return
var performanceLevels = ["low", "medium", "high"];
var randInt = Math.floor(Math.random() * 3);
document.getElementById("level").innerHTML = performanceLevels[randInt];
switch(randInt) {
    case 0 : robo = get_returns(low_mean, low_var); break; // Low: annualized return = 6% +- 4%
    case 1 : robo = get_returns(medium_mean, medium_var); break; // Medium: annualized return = 10% +- 4%
    case 2 : robo = get_returns(high_mean, high_var); break; // High: annualized return = 18% +- 4%
}

// update the chart with corresponding return values
function updateChart(index) {
    dps[index]["y"] = robo[index];
    dps_base[index]["y"] = base[index];
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
        alert("Finish the showcase demo!");
        save();
        return;
    }

    range = slider.value;
    updateChart(monthIndex); 

    // gain = corrsponding percentage * previous totalGain * gainRatio
    if (monthIndex == 0) {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / principle - 1) ;
        bMGain = (1 - range * 0.01)  * totalGain * (base[monthIndex] / principle - 1);
    } else {
        rMGain = range * 0.01 * totalGain * (robo[monthIndex] / robo[monthIndex-1] - 1);
        bMGain = (1 - range * 0.01)  * totalGain * (base[monthIndex] / base[monthIndex-1] - 1);
    }
    document.getElementById("rMGain").innerHTML = Math.round(rMGain*100)/100;
    document.getElementById("bMGain").innerHTML = Math.round(bMGain*100)/100;

    totalGain = totalGain + rMGain + bMGain;
    margin = totalGain - principle;
    document.getElementById("return").innerHTML = Math.round(totalGain*100)/100;

    document.getElementById("comparison").innerHTML = "(placehoder) Robo-Advisor outperforms Bank Deposit"; // to be changed

    roboMonthGainLst.push(rMGain);
    bankMonthGainLst.push(bMGain);
    totalLst.push(totalGain);
    rangeLst.push(range);

    monthIndex += 1;
}

function save(){
    // save the necessary info for later reference
    // jsnObj = {
    //     "performance level":performanceLevels[randInt],
    //     "robo-advisor monthly gain":roboMonthGainLst,
    //     "bank deposit monthly gain":bankMonthGainLst,
    //     "total gain":totalLst,
    //     "user selected ranges":rangeLst
    // };
   
}
