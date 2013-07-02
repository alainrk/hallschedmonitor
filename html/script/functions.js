$(document).ready(function() {
	
	fillTableEvent(getToday());
	
	$('#title').val("Titolo Evento");
	$('#speaker').val("Relatore Principale");
	
	$('#date').datepicker({ dateFormat: "yyyy-mm-dd" });
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
				username: {
					required: true,
					minlength: 2
				},
				title: {
					required: true,
					minlength: 2,
					maxlength: 50
				},
				speaker: {
					required: false,
					minlength: 2,
					maxlength: 50
				},
				email: {
					required: true,
					email: true
				},
				topic: {
					required: "#newsletter:checked",
					minlength: 2
				},
				agree: "required"
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
		console.log($(this).serialize());
		manageform($(this).serialize());
		
	});
	
});

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
	var date = GG + "/" + MM + "/" + AAAA;
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
	  alert("Dati salvati con successo: "+ret+", status: "+textStatus);
	});
	sending.fail(function(jqXHR, textStatus) {
	  alert( "Request failed: " + textStatus );
	});
	}


// Fill the table with the passed date, getting xml from php
function fillTableEvent(dateTable){
	// PHP request for the xml fragment with ALL events for today!!
	var xmlFrag;
	 
	xmlFrag = getEvents('barcellona',dateTable);
	
	var xmlDoc = $.parseXML(xmlFrag);
	var $xml = $(xmlDoc);alert("primo: "+$xml);alert("second: "+xmlFrag);
    $title = $($xml).find('event').each(function(){
		var start = $(this).attr('start');
		var stop = $(this).attr('stop');
		var title = $(this).find('title').text();
		var speaker = $(this).find('title').text();
		alert("Barcellona: "+start+stop+title+speaker);
	});
    
    
	/*xmlFrag = getEvents("newyork",dateTable);
	xmlFrag = getEvents("londra",dateTable);
	xmlFrag = getEvents("granada",dateTable);
	xmlFrag = getEvents("laboratorio",dateTable);*/
	
	writeInTdHTML ("p","laboratorio","<p>TEST</p><p>cristo<br/>12-45 asd qwe rty ahahahahahah</p>");
	writeInTdHTML ("m","barcellona","<p>BAHBAH</p><p>prova<br/>01-4 asd qwe rty pino</p>");
	writeInTdHTML ("s","laboratorio","<p>pRovasdlkfjsldkf sdflkjsdflksjdf</p><p>bah<br/>02-45 asd qwe rty sdfsdf</p>");
}
	
function writeInTdHTML (t, h, txt) {
	//EXAMPLE: writeInTdHTML("p","laboratorio","<p>TEST</p><p>fessa<br/>12-45 asd qwe rty ahahahahahah</p>");
	$("td[time='"+t+"'][hall='"+h+"']").html(txt);
}

function getEvents(aula,date){
	aula="barcellona";
	date="06/12/2013";
	//data="aula="+aula+"&date="+date;
	data='aula=barcellona&date=06/12/2013';
	var sending = $.ajax({
	headers: { 
        Accept: "Content-type: application/xml; charset=UTF-8"
    },
	  type: "POST",
	  url: "cgi-bin/load.php",
	  data: data
	});
	sending.success(function(ret, textStatus) {
	  alert("Dati salvati con successo: "+ret+", status: "+textStatus);
	  return ret;
	});
	sending.fail(function(jqXHR, textStatus) {
	  alert( "Request failed: " + textStatus );
	});
	
	}
