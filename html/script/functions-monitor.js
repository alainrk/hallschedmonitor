var imageArray="";
var swap;

$(document).ready(function() {
	swap = 0;
	//With date array
	fillTableEvent(getToday(1));
	
	imageArray = getImageArray();
	
	$('#table').dataTable();
	$("#tabs").tabs();
	
	// Gallery
	setInterval(function() {
		if (swap == 0){
			$('#table-div').hide();
			$('#image-div').show();
			swap = 1;
		}
		else {
			$('#table-div').show();
			$('#image-div').hide();
			swap = 0;
		}
		
		if (imageArray != "") {
			rand = Math.floor(Math.random() * imageArray.length);
			filerand = imageArray[rand];
			$("div#back-image").css("background-image", "url(../images/"+filerand+")");
		}
	}, 3000);
	
});

function getImageArray(){
	var images;
	var call = $.ajax({
      async: false,
	  type: "POST",
	  url: "cgi-bin/imagelist.php",
	});
	call.success(function(ret, textStatus) {
		console.log("Image array Request success: "+ret+", status: "+textStatus);
		images = ret;
	});
	call.fail(function(jqXHR, textStatus) {
		console.log( "Image array Request failed: " + textStatus );
	});
	return images.split('&');
	}

/* There isn't a default way to get date in this format in js??? */
function getToday(array){
	var today = new Date();
	var G = today.getDate();
	var M = ((today.getMonth()) + 1);

	if (G < 10){
		var GG = "0" + today.getDate();
	}
	else{
		var GG = today.getDate();
	}

	if (M < 10){
		var MM = "0" + ((today.getMonth()) + 1);
	}
	else{
		var MM = ((today.getMonth()) + 1);
	}

	var AAAA = today.getFullYear();
	
	if (array == 0) {
		var date = AAAA + "/" + MM + "/" + GG;
		return date;
	}
	else {
		var dateArray = new Array(GG,MM,AAAA);
		return dateArray;
		}
	}

// Fill the table with the passed date, getting xml from php
function fillTableEvent(dateTable){
	var xmlFrag;
	var xmlDoc;
	var xml;
	var timestamp;
	/*var day;
	var month;
	var year;*/
	var start;
	var stop;
	var title;
	var speaker;
	var arrayTime;
	var hour;
	var mps; // Mattina, pomeriggio, sera
	var auleArray = ['barcellona','newyork','londra','granada','laboratorio'];

	for (var i = 0; i < auleArray.length; i++) {
		xmlFrag = getEvents(auleArray[i],dateTable);
		if (xmlFrag == "0") 
			continue; // No events for today in this hall!
		xmlDoc = $.parseXML(xmlFrag);
		xml = $(xmlDoc);
		
		// TEST Order for hour
		var events = xml.find('event');
		events.sort(function(a, b){
			var a_time = $(a).attr('start');
			var b_time = $(b).attr('start');
			var a_timeArr = a_time.split(':');
			var b_timeArr = b_time.split(':');
			return (parseInt(a_timeArr[0] - b_timeArr[0]));
		});

		events.each(function(){
			timestamp = $(this).attr('timestamp');
			start = $(this).attr('start');
			stop = $(this).attr('stop');
			title = $(this).find('title').text();
			speaker = $(this).find('speaker').text();
			arrayTime = start.split(':');
			hour = arrayTime[0];
			if (hour <= 12) mps = 'm';
			else if (hour <= 19) mps = 'p';
			else mps = 's';
			writeInTdHTML (mps,auleArray[i],"<div id='"+timestamp+"'><span style='font:bold;color:red'>"+start+" - "+stop+"</span><br/><span style='font:bold'>"+title+"</span><br/><span>"+speaker+"</span><br/></div>");

		});

	}
}

function getEvents(aula,date){
	xmlFrag="";
	success=0;
	data="aula="+aula+"&day="+date[0]+"&month="+date[1]+"&year="+date[2];
	console.log(data);
	
	var sending = $.ajax({
      async: false,
	  type: "POST",
	  url: "cgi-bin/load.php",
	  data: data
	});
	sending.success(function(ret, textStatus) {
	  console.log("Dati salvati con successo: "+ret+", status: "+textStatus);
	  xmlFrag = ret;
	  success = 1;
	});
	sending.fail(function(jqXHR, textStatus) {
	  console.log( "Request failed: " + textStatus );
	  success = 0;
	});
	
	if (success == 1)
		return xmlFrag;
	else return 0;

	}


function writeInTdHTML (t, h, txt) {
	$("td[time='"+t+"'][hall='"+h+"']").append(txt);
}

function clearTableEvent(){
	$("td[time='m']").html("");
	$("td[time='p']").html("");
	$("td[time='s']").html("");
}
