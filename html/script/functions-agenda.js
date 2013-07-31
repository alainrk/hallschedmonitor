var hallCalendar=[];

$(document).ready(function() {

	// Default
	hallCalendar = getHallCalendar($("select#aula option:selected").val());
	
	$("#refreshCalendar").click(function(event) {
		var aula = $("select#aula option:selected").val();
		hallCalendar=[];
		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('removeEventSource');
		hallCalendar = getHallCalendar(aula);
		$('#calendar').fullCalendar('addEventSource', hallCalendar);
		//$('#calendar').fullCalendar('refetchEvents');
	});
	
	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		eventClick: function(calEvent, jsEvent, view) {
			var conf = confirm('Vuoi cancellare l\'evento: ' + calEvent.title + "?");
			if (conf) {
				var res = deleteEvent(calEvent.id);
					if (res != -1) {
						$(this).remove();
					}
					else {
						alert ("Error on server");
						}
			}			
		},
		selectable: false,
		selectHelper: false,
		editable: false,
		droppable: false,
		className: "cursorEvent",
		events: hallCalendar
	});
	//$(".cursorEvent").css("cursor","pointer");
});

// Get ALL events for a specific 'aula' and fill into a returned array
function getHallCalendar(aula){
	xmlFrag="";
	success = 0;
	data="aula="+aula;

	var sending = $.ajax({
      async: false,
	  type: "POST",
	  url: "cgi-bin/getHallCalendar.php",
	  data: data
	});
	sending.success(function(ret, textStatus) {
	  console.log("Dati salvati con successo: "+ret+", status: "+textStatus);
	  xmlFrag = ret;
	  if (ret == '0') 
		success = 0;
	  else 
		success = 1;
	});
	sending.fail(function(jqXHR, textStatus) {
	  console.log( "Request failed: " + textStatus );
	  success = 0;
	});
	
	if (success == 1) {
		var day;
		var month;
		var year;
		var start;
		var stop;
		var title;
		var speaker;
		var hourStart;
		var minuteStart;
		var hourStop;
		var minuteStop;
		var arrayTime;
		var xmlDoc = $.parseXML(xmlFrag);
		var xml = $(xmlDoc);
		var arr = [];
		
		var events = xml.find('event');
		/*events.sort(function(a, b){
			var a_time = $(a).attr('start');
			var b_time = $(b).attr('start');
			var a_timeArr = a_time.split(':');
			var b_timeArr = b_time.split(':');
			return (parseInt(a_timeArr[0] - b_timeArr[0]));
		});*/

		var obj;
		events.each(function(){
			timestamp = $(this).attr('timestamp');
			day = $(this).attr('day');
			month = $(this).attr('month')-1; //For calendar (Jan = 0)
			year = $(this).attr('year');
			start = $(this).attr('start');
			stop = $(this).attr('stop');
			title = $(this).find('title').text();
			speaker = $(this).find('speaker').text();
			arrayTime = start.split(':');
			hourStart = arrayTime[0];
			minuteStart = arrayTime[1];
			arrayTime = stop.split(':');
			hourStop = arrayTime[0];
			minuteStop = arrayTime[1];
			obj = {
				id: timestamp,
				title: speaker+': '+title,
				start: new Date(year, month, day, hourStart, minuteStart),
				end: new Date(year, month, day, hourStop, minuteStop),
				allDay: false
				//url: 'http://google.com/'
			};
			//alert("ID: "+obj.id+". Title: "+obj.title+". START: "+obj.start+". STOP: "+obj.end+". AllDay: "+obj.allDay);
			console.log("ID: "+obj.id+". Title: "+obj.title+". START: "+obj.start+". STOP: "+obj.end+". AllDay: "+obj.allDay);
			arr.push(obj);
		});
		return arr;
	}
		
	else return arr;
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
