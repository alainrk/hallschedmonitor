var imageArray;

$(document).ready(function() {
	
	fillTableEvent(getToday());
	
	imageArray = getImageArray();
	
	$('#title').val("Titolo Evento");
	$('#speaker').val("Relatore Principale");
	
	//$('#date').datepicker({ dateFormat: "yy-mm-dd" });
	//$('#date').datepicker( "option", "dateFormat", "yy-mm-dd" );
	$('#date').datepicker({ gotoCurrent: true });
	
	$('.timepick').timepicker({ 'timeFormat': 'H:i' });
	/* DEBUG: Puoi togliere il setTime */
	$('.timepick').timepicker('setTime', new Date());
	$('.timepick').timepicker('option', {
		'minTime': '06:00',
		'maxTime': '23:45',
		'step': 15	
		 });

	$('#table').dataTable();
	$("#tabs").tabs();

	$("form").on("submit",function(event) {
		$("form").validate({
			rules: {
				//FIXME: Check sulla data, anche se vuota accettata
				date: "required",
				start: "required",
				stop: "required",
				title: {
					required: true,
					minlength: 2,
					maxlength: 50
				},
				speaker: {
					required: false,
					minlength: 2,
					maxlength: 50
				}
			},
			messages: {
				date: "Inserire una data",
				start: function(){alert("Inserire orario di inizio")},
				stop: "Inserire orario di termine",
				title: {
					required: "Inserire un nome per l'evento",
					minlength: "L'evento deve avere almeno 2 caratteri"
				}
			}
		});
		event.preventDefault();
				
		/* Hack for stupid datepicker, it's impossible to change date format! */
		var uncorrectDateFormat = $("#date").val();
		var uncorrectDateFormatArray = uncorrectDateFormat.split('/');
		var dd = uncorrectDateFormatArray[1];
		var mm = uncorrectDateFormatArray[0];
		var yyyy = uncorrectDateFormatArray[2];
		var correctDateFormat = yyyy+"/"+mm+"/"+dd;
		$("#date").val(correctDateFormat);
		var serialized = $(this).serialize();

		console.log(serialized);
		manageform(serialized);
	});
	
	// Gallery
	setInterval(function() {
		rand = Math.floor(Math.random() * 4) + 1;
		$("div#back-image").css("background-image", "url(../images/slide_"+rand+".jpg)");
		//alert("url(../images/slide_"+rand+".jpg)");
	}, 5000);
	
});

function getImageArray(){
	var call = $.ajax({
      async: false,
	  type: "POST",
	  url: "cgi-bin/imagelist.php",
	  data: data
	});
	call.success(function(ret, textStatus) {
		console.log("Image array Request success: "+ret+", status: "+textStatus);
		imageArray = ret.split('&'); // GLOBAL
	});
	call.fail(function(jqXHR, textStatus) {
		console.log( "Image array Request failed: " + textStatus );
	});
	}

/* There isn't a default way to get date in this format in js??? */
function getToday(){
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
	var date = AAAA + "/" + MM + "/" + GG;
	return date;
	}

function manageform(data) {
	//TODO: Send to php
	resetForm("addEvent");
	sendData(data);
	}
	
function resetForm(id) {
   $('.toreset').each(function(){ 
      $(this).val('');
   });
}

function sendData(serialized){
	var sending = $.ajax({
	  type: "POST",
	  url: "cgi-bin/store.php",
	  data: serialized
	});
	sending.success(function(ret, textStatus) {
	  console.log("Dati salvati con successo: "+ret+", status: "+textStatus);
	  clearTableEvent()
	  fillTableEvent(getToday());
	});
	sending.fail(function(jqXHR, textStatus) {
	  console.log( "Request failed: " + textStatus );
	});
	}


// Fill the table with the passed date, getting xml from php
function fillTableEvent(dateTable){
	var xmlFrag;
	var xmlDoc;
	var xml;
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

		//xml.find('event').each(function(){
		events.each(function(){
			start = $(this).attr('start');
			stop = $(this).attr('stop');
			title = $(this).find('title').text();
			speaker = $(this).find('speaker').text();
			arrayTime = start.split(':');
			hour = arrayTime[0];
			if (hour <= 12) mps = 'm';
			else if (hour <= 19) mps = 'p';
			else mps = 's';
			writeInTdHTML (mps,auleArray[i],"<span style='font:bold;color:red'>"+start+" - "+stop+"</span><br/><span style='font:bold'>"+title+"</span><br/><span>"+speaker+"</span><br/>");
			//writeInTdHTML (mps,auleArray[i],"<p>"+title+"</p><p>"+speaker+"<br/>"+start+" - "+stop+"</p>");
	});

	}
}
	

function getEvents(aula,date){
	//aula="barcellona";
	//date="2013/07/07";
	xmlFrag="";
	success=0;
	data="aula="+aula+"&date="+date;
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
	//EXAMPLE: writeInTdHTML("p","laboratorio","<p>TEST</p><p>fessa<br/>12-45 asd qwe rty ahahahahahah</p>");
	$("td[time='"+t+"'][hall='"+h+"']").append(txt);
}

function clearTableEvent(){
	$("td[time='m']").html("");
	$("td[time='p']").html("");
	$("td[time='s']").html("");
}

	/*function xmlToString(xmlData) {
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
} */

/*function getEventsXML(aula,date){
	aula="barcellona";
	date="06/12/2013";
	//data="aula="+aula+"&date="+date;
	data='aula=barcellona&date=06/12/2013';
	var sending = $.ajax({
	headers: { 
        Accept: "Content-type: application/xml; charset=UTF-8"
    },
      async: false,
	  type: "POST",
	  url: "cgi-bin/load.php",
	  data: data
	});
	sending.success(function(ret, textStatus) {
	  console.log("Dati salvati con successo: "+ret+", status: "+textStatus);
	  return ret;
	});
	sending.fail(function(jqXHR, textStatus) {
	  console.log( "Request failed: " + textStatus );
	});
	
	}*/
