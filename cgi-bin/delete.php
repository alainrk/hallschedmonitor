<?php

/* aula=barcellona&timestamp=1374749097219&start=12:42&stop=12:42&title=Titolo Evento&speaker=Relatore Principale&day=09&month=07&year=2013 */

$timestamp = $_POST["timestamp"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("text.xml");
$xpathDOM = new DOMXPath($xmlDoc);

$query = '//event[@timestamp="'.$timestamp.'"]';
$events = $xpathDOM->query($query);

if ($events->length == 1) { // Dovrebbe esservi al massimo 1 elemento 
	$event = $events->item(0);
	}
else {
	echo "-1";
	die();
	}

$event->parentNode->removeChild($event);

$xmlDoc->save('text.xml');
echo "1";
die();

