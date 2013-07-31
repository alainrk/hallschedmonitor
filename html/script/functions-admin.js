$(document).ready(function() {

	$('#title').val("Titolo Evento");
	$('#speaker').val("Relatore Principale");
	
	$('#date').datepicker({ gotoCurrent: true });
	
	$('.timepick').timepicker({ 'timeFormat': 'H:i' });
	/* DEBUG: Puoi togliere il setTime */
	$('.timepick').timepicker('setTime', new Date());
	$('.timepick').timepicker('option', {
		'minTime': '06:00',
		'maxTime': '23:45',
		'step': 15
		 });

	$("form#addEvent").on("submit",function(event) {
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
		
		// Creo il serialized a mano, dovendo prendere valori anche da select-option
		var serialized;
		var aula = $("select#aula option:selected").val();
		var start = $("#start").val();
		var stop = $("#stop").val();
		var title = $("#title").val();
		var speaker = $("#speaker").val();
		var timestamp = new Date().getTime();
		serialized = 'aula='+aula+'&timestamp='+timestamp+'&start='+start+'&stop='+stop+'&title='+title+'&speaker='+speaker+'&day='+dd+'&month='+mm+'&year='+yyyy;
		//alert(serialized);
		//////////////////////////////////////////////////////////////////////////
		
		//var serialized = $(this).serialize();

		console.log(serialized);
		manageform(serialized);
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
	var date = AAAA + "/" + MM + "/" + GG;
	return date;
	}

function manageform(data) {
	resetForm("addEvent");
	addEvent(data);
	}
	
function resetForm(id) {
   $('.toreset').each(function(){ 
      $(this).val('');
   });
}

function addEvent(serialized){
	var sending = $.ajax({
	  type: "POST",
	  url: "cgi-bin/store.php",
	  data: serialized
	});
	sending.success(function(ret, textStatus) {
	  console.log("Request accepted: "+ret+", status: "+textStatus);
	});
	sending.fail(function(jqXHR, textStatus) {
	  console.log("Request failed: " + textStatus );
	});
	}

function deleteEvent (timestamp) {
	var res;
	var req = "timestamp="+timestamp;
	var request = $.ajax({
	  type: "POST",
	  url: "cgi-bin/delete.php",
	  data: req
	});
	request.success(function(ret, textStatus) {
	  console.log("Request accepted: "+ret+", status: "+textStatus);
	  res = ret;
	});
	request.fail(function(jqXHR, textStatus) {
	  console.log("Request accepted: " + textStatus);
	  res = -1;
	});
	return res;
}

function editEvent (timestamp, serialized) {
	var res = deleteEvent (timestamp);
	// Success --> Add new event with same timestamp
	if (res == 1){
		addEvent(serialized);
	}
	else {
		alert ("Error, event does not exist!");
	}
}
