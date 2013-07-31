<?php

include ("timeFunctions.php");

/* aula=barcellona&timestamp=1374749097219&start=12:42&stop=12:42&title=Titolo Evento&speaker=Relatore Principale&day=09&month=07&year=2013 */

/*function checkConflict ($start1, $stop1, $start2, $stop2) {
	$arrStart1 = explode(":", $start1);
	$arrStop1 = explode(":", $stop1);
	$arrStart2 = explode(":", $start2);
	$arrStop2 = explode(":", $stop2);

	$hourStart1 = $arrStart1[0];
	$minuteStart1 = $arrStart1[1];
	$hourStop1 = $arrStop1[0];
	$minuteStop1 = $arrStop1[1];
	$hourStart2 = $arrStart2[0];
	$minuteStart2 = $arrStart2[1];
	$hourStop2 = $arrStop2[0];
	$minuteStop2 = $arrStop2[1];

	if ($hourStart1 == $hourStar2 .......)

}*/


$aula = $_POST["aula"];
$timestamp = $_POST["timestamp"];
$start = $_POST["start"];
$stop = $_POST["stop"];
$day = $_POST["day"];
$month = $_POST["month"];
$year = $_POST["year"];
$title = $_POST["title"];
$speaker = $_POST["speaker"];

// If start is LATER stop -> ERROR, DIE!
if (checkTimeConsistence($start, $stop) == 1){
	echo "Error: START time is LATER then STOP time!";
	die();
}

$xmlDoc = new DOMDocument();
$xmlDoc->load("text.xml");
$xpathDOM = new DOMXPath($xmlDoc);

$query = '//aule/aula[@id="'.$aula.'"]';
//Query return a DOMnodelist
$aulaNode = $xpathDOM->query($query);

if ($aulaNode->length == 1) { /* Dovrebbe essere sempre 1, essendovi un elemento aula per ognuna */
	$aulaNode = $aulaNode->item(0);
	}
else {
	echo "Error: two \"aula\" elements in xml";
	die();
	}

/****** CHECK IF ALREADY EXIST EVENT AT SAME TIME ******/

$queryCheck = '//aule/aula[@id="'.$aula.'"]/event[@day="'.$day.'"][@month="'.$month.'"][@year="'.$year.'"]';
$nodes = $xpathDOM->query($queryCheck);
if ($nodes->length == 0) {
	// OK, it's possible to add the new event because no events for this day
	$correct = 1;
	}
else {
	// Check conflicting time for each node in this AULA and in this DAY
	foreach($nodes as $node) {
		$storedStart = $node->getAttribute('start');
		$storedStop = $node->getAttribute('stop');
		// If there is ANOTHER event conflicting with the new one -> ERROR
		if (checkConflict ($storedStart, $storedStop, $start, $stop) == 1) {
			echo "Error: there is another event conflicting with this. Remove that before!";
			die();
		}
	}
	//for ($i=0;$i<$nodes->length;$i++){
	//	$root->appendChild($dateNode->item($i));
	//}
}

/*******************************************************/
	
	
$eventNode = $xmlDoc->createElement('event');
$eventNode->setAttribute('timestamp',$timestamp);
$eventNode->setAttribute('day',$day);
$eventNode->setAttribute('month',$month);
$eventNode->setAttribute('year',$year);
$eventNode->setAttribute('start',$start);
$eventNode->setAttribute('stop',$stop);

$titleNode = $xmlDoc->createElement('title');
$titleNode->appendChild($xmlDoc->createTextNode($title));

$speakerNode = $xmlDoc->createElement('speaker');
$speakerNode->appendChild($xmlDoc->createTextNode($speaker));

$eventNode->appendChild($titleNode);
$eventNode->appendChild($speakerNode);
$aulaNode->appendChild($eventNode);

// To save 
$xmlDoc->save('text.xml');
echo "Success: event added!";
die();

