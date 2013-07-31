<?php

$aula = $_POST["aula"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("text.xml");
$xpathDOM = new DOMXPath($xmlDoc);

$query = '//aule/aula[@id="'.$aula.'"]/event';
$dateNode = $xpathDOM->query($query);
if ($dateNode->length == 0) {
	header('Content-type: text/plain');
	print "0";
	die();
	}

$root = $xmlDoc->createElement('root');
for ($i=0;$i<$dateNode->length;$i++){
	$root->appendChild($dateNode->item($i));
	}

$xml = new DOMDocument( "1.0", 'UTF-8' );
$root = $xml->importNode($root, true);
$xml->appendChild($root);

header('Content-type: text/plain');
print $xml->saveXML();
die();









































