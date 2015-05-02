importScripts("math.min.js");

var dataForTest = [];

var xmlHttp = new XMLHttpRequest();

try
{
    xmlHttp.onreadystatechange = handleStateChange;
    xmlHttp.open("GET", "data.json", true);
    xmlHttp.send(null);
}
catch(exception)
{
    alert("xmlHttp Fail");
}


function handleStateChange()
{   
    if(xmlHttp.readyState == 4)
    {       
        if (xmlHttp.status == 200 || xmlHttp.status == 0)
        {
            var result = xmlHttp.responseText;
            var json = eval("(" + result + ")");
        	dataForTest = json;
        }
    }
}


onmessage = function(event){
	var real = math.matrix(event.data.real);
	var test = dataForTest;
	var results = [];
	for(var i in test){
		var testMat = math.matrix(test[i].value);
		var label = test[i].num;
		var result = math.sum(math.square(math.subtract(real,testMat)));
		results.push({label:label,score:result});
	}
	var kNNOrigins = results.sort(function(a,b){
		return a.score-b.score;
	});
	var result = kNN(kNNOrigins,3);
	postMessage(result);
}

function kNN(kNNOrigins,n){
	var result = {};
	var maxLabel = "";
	for(var i=0;i<n;i++){
		var label = kNNOrigins[i].label;
		if(!result[label]){
			result[label] = 0;
		}
		result[label]++;
	}
	for(var key in result){
		if(maxLabel === ""){
			maxLabel = key;
		}else if(result[key]>result[maxLabel]){
			maxLabel = key;
		}
	}
	return key;
}