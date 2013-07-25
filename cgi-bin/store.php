<?php

/* aula=barcellona&timestamp=1374749097219&start=12:42&stop=12:42&title=Titolo Evento&speaker=Relatore Principale&day=09&month=07&year=2013 */

$aula = $_POST["aula"];
$timestamp = $_POST["timestamp"];
$start = $_POST["start"];
$stop = $_POST["stop"];
$day = $_POST["day"];
$month = $_POST["month"];
$year = $_POST["year"];
$title = $_POST["title"];
$speaker = $_POST["speaker"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("text.xml");
$xpathDOM = new DOMXPath($xmlDoc);

$query = '//aule/aula[@id="'.$aula.'"]'; //FIXME Probabilmente ci vuole escape per stringa
//Query return a DOMnodelist
$aulaNode = $xpathDOM->query($query);

if ($aulaNode->length == 1) { /* Dovrebbe essere sempre 1, essendovi un elemento aula per ognuna */
	$aulaNode = $aulaNode->item(0);
	}
else {
	echo "Error: two \"aula\" elements in xml";
	die();
	}

//$query2 = '//aule/aula[@id="'.$aula.'"]/date[@id="'.$date.'"]';
//$query2 = '//aule/aula[@id="'.$aula.'"]/date[@day="'.$day.' and @month='.$month.' and @year='.$year.'"]'; // TODO Sistema query
$query2 = '//aule/aula[@id="'.$aula.'"]/date[@day="'.$day.'"][@month="'.$month.'"][@year="'.$year.'"]';
$dateNode = $xpathDOM->query($query2);
if ($dateNode->length != 0) {
	$dateNode = $dateNode->item(0);
	}
else {
	$dateNode = $xmlDoc->createElement('date');
	$dateNode->setAttribute('day',$day);
	$dateNode->setAttribute('month',$month);
	$dateNode->setAttribute('year',$year);
	$xmlDoc->appendChild($dateNode);
	}
$eventNode = $xmlDoc->createElement('event');
$eventNode->setAttribute('timestamp',$timestamp);
$eventNode->setAttribute('start',$start);
$eventNode->setAttribute('stop',$stop);

$titleNode = $xmlDoc->createElement('title');
$titleNode->appendChild($xmlDoc->createTextNode($title));

$speakerNode = $xmlDoc->createElement('speaker');
$speakerNode->appendChild($xmlDoc->createTextNode($speaker));

$eventNode->appendChild($titleNode);
$eventNode->appendChild($speakerNode);

$dateNode->appendChild($eventNode);
$aulaNode->appendChild($dateNode);

// To save 
$xmlDoc->save('text.xml');
die();

