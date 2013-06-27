<?php

$aula = $_POST["aula"];
$date = $_POST["date"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("text.xml");
$xpathDOM = new DOMXPath($xmlDoc);

/*
$query = '//aule/aula[@id="'.$aula.'"]';
$aulaNode = $xpathDOM->query($query);
if ($aulaNode->length == 1) {
	$aulaNode = $aulaNode->item(0);
	}
else {
	echo "Error: two \"aula\" elements in xml";
	die();
	}
*/

$query = '//aule/aula[@id="'.$aula.'"]/date[@id="'.$date.'"]';
$dateNode = $xpathDOM->query($query);
if ($dateNode->length != 1) {
	echo "Error: there is not the correct data for hall or date in xml!";
	die();
	}
$dateNode = $dateNode->item(0);

$xml = new DOMDocument( "1.0", 'UTF-8' );
$domNode = $xml->importNode($dateNode, true);
$xml->appendChild($domNode);

// To save and send
header ("Content-type: application/xml; charset=UTF-8");
print $xml->saveXML();
die();

