$(document).ready(function() {
	$("#date").datepicker({ dateFormat: "yyyy-mm-dd" });
	$('#start').timepicker({ 'timeFormat': 'G:i' });
	$('#stop').timepicker({ 'timeFormat': 'G:i' });
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
		manageforum($(this).serialize());
	});
});

function manageforum(data) {
	//TODO: Send to php 
	resetForm("addEvent");
	}
	
function resetForm(id) {
   $('#' + id + ' :input').each(function(){ 
      $(this).val('');
   });
}
