$(document).ready(function() {
	alert("ciao");
	$("#datepicker").datepicker({ dateFormat: "yyyy/mm/dd" });
	$('#timepicker-start').timepicker({ 'timeFormat': 'G:i' });
	$('#timepicker-stop').timepicker({ 'timeFormat': 'G:i' });
});
