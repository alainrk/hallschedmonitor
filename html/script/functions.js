$(document).ready(function() {
	// DEBUG
	$('#title').val("Titolo Evento");
	$('#speaker').val("Relatore Principale");
	//
	$('#date').datepicker({ dateFormat: "yyyy-mm-dd" });
	$('#date').datepicker({ gotoCurrent: true });
	
	$('.timepick').timepicker({'timeFormat': 'G:i'});
	$('.timepick').timepicker('setTime', new Date());
	$('.timepick').timepicker({ 'forceRoundTime': true });
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
				data: "required",
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
				data: "Inserire una data",
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

function writeInTd (t, h, txt) {

	$("td[time='"+t+"'][hall='"+h+"']").text(txt);
	}
	
function writeInTdHTML (t, h, txt) {
	//EXAMPLE: writeInTdHTML("p","laboratorio","<p>TEST</p><p>fessa<br/>12-45 asd qwe rty ahahahahahah</p>");
	$("td[time='"+t+"'][hall='"+h+"']").text(txt);
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
	  url: "cgi-bin/xml.php",
	  data: serialized
	});
	sending.success(function(ret, textStatus) {
	  alert("Dati salvati con successo: "+ret+", status: "+textStatus);
	});
	sending.fail(function(jqXHR, textStatus) {
	  alert( "Request failed: " + textStatus );
	});
	}
