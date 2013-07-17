<?php

/* aula=barcellona&date=06%2F12%2F2013&start=7%3A30am&stop=7%3A30am&title=sddd&speaker=dddddd */

$aula = $_POST["aula"];
$date = $_POST["date"];
$start = $_POST["start"];
$stop = $_POST["stop"];
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

$query2 = '//aule/aula[@id="'.$aula.'"]/date[@id="'.$date.'"]';
$dateNode = $xpathDOM->query($query2);
if ($dateNode->length != 0) {
	$dateNode = $dateNode->item(0);
	}
else {
	$dateNode = $xmlDoc->createElement('date');
	$dateNode->setAttribute('id',$date);
	$xmlDoc->appendChild($dateNode);
	}
$eventNode = $xmlDoc->createElement('event');
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

