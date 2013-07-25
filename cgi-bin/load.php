<?php

$aula = $_POST["aula"];
$day = $_POST["day"];
$month = $_POST["month"];
$year = $_POST["year"];

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

//$query = '//aule/aula[@id="'.$aula.'"]/date[@day="'.$day.' and @month='.$month.' and @year='.$year.'"]';
$query = '//aule/aula[@id="'.$aula.'"]/date[@day="'.$day.'"][@month="'.$month.'"][@year="'.$year.'"]';
$dateNode = $xpathDOM->query($query);
if ($dateNode->length == 0) {
	header('Content-type: text/plain');
	print "0";
	die();
	}
$dateNode = $dateNode->item(0);

$xml = new DOMDocument( "1.0", 'UTF-8' );
$domNode = $xml->importNode($dateNode, true);
$xml->appendChild($domNode);

// To save and send
//header ("Content-type: application/xml; charset=UTF-8");
header('Content-type: text/plain');
print $xml->saveXML();
die();









































