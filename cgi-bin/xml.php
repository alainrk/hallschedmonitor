<?php

/* aula=barcellona&date=06%2F12%2F2013&start=7%3A30am&stop=7%3A30am&title=sddd&speaker=dddddd */
echo $_POST["date"];

$aula = $_POST["aula"];
$date = $_POST["date"];
$start = $_POST["start"];
$stop = $_POST["stop"];
$title = $_POST["title"];
$speaker = $_POST["speaker"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("monitor.xml");
$xpathDOM = new DOMXPath($xmlDoc);

//$query = "/aule/aula[@id='"+$aula+"']";
//Query return a DOMnodelist
//$aulaNode = $xpathDOM->query($query);

$query = "/aule/aula[@id='"+$aula+"']/date[@id='"+$date+"']";
$dateNode = $xpathDOM->query($query);
if ($dateNode->length != 0) {
	$dateNode = $dateNode.item(0);
	}
else {
	$dateNode = $xmlDoc->createElement('date');
	$dateNode->setAttribute('id',$date);
	$xmlDoc->appendChild($dateNode);
	}
$eventNode = $xmlDoc->createElement('event');
$dateNode->appendChild($eventNode);

// To save 
$xmlDoc->save('text.xml');


die();

function pino(){
	/* Invece di questa roba prendere parte di file in cui viene 
	 * APERTO e LETTO un DOM
	 */
$imp = new DOMImplementation;
		$dtd = $imp->createDocumentType("root", "", LOCATIONS_DTD);
		$doc = $imp->createDocument("", "", $dtd);
		$doc->encoding = "UTF-8";
		$doc->formatOutput = true;
		
		$nevents = 0;
		
		/* TODO: Aprire documento monitor.xml
		 * -Creare nodo EVENT
		 * -Cercare in base ad aula
		 * -Al suo interno cercare la data
		 * 		-Se NON c'è creare nodo DATE con id la data, e metterci dentro EVENT creato prima
		 * 		-Se GIÀ c'è allora metterci dentro EVENT creato prima
		 */
		
		$locations = $doc->appendChild($doc->createElement("locations"));
		$metadata = $locations->appendChild($doc->createElement("metadata"));
		$ids = (array_keys($json[locations]));
		
		$nlocations = count($ids);
				
		//If there isn't any locations, stop here
		if ($nevents == 0)
			break;
		
		//Insert the metadata
		convertMetadataArrayToXml($json[metadata], $doc, $metadata);
		
		//Filling the document with the locations
		for($i = 0; $i < $nevents; $i++){
			$location = $locations->appendChild($doc->createElement("location"));
			$id = $ids[$i];
			convertLocationArrayToXml($json[locations][$id], $id, $doc, $location);
		}
}


/* Takes location array, its id, the DOM document and the location node of the DOM.
 * The last argument is filled with the values stored in the array */
function convertLocationArrayToXml(&$locationArray, $id, &$doc, &$location)
{
	
	if (is_array($locationArray[category]))
		$category = implode(',',$locationArray[category]);
	else
		$category = $locationArray[category];
	$name = $locationArray[name];
	$address = $locationArray[address];
	$tel = $locationArray[tel];
	$lat = $locationArray[lat];
	$long = $locationArray[long];
	$opening = $locationArray[opening];
	$closing = $locationArray[closing];
	
	$location->setAttribute("id", $id);
	$location->setAttribute("lat", $lat);
	$location->setAttribute("long", $long);
	
	$field = $location->appendChild($doc->CreateElement("category"));
	$field->appendChild($doc->createTextNode($category));
	$field = $location->appendChild($doc->CreateElement("name"));
	$field->appendChild($doc->createTextNode($name));
	$field = $location->appendChild($doc->CreateElement("address"));
	$field->appendChild($doc->createTextNode($address));
	if ($tel != NULL && $tel != ""){
		$field = $location->appendChild($doc->CreateElement("tel"));
		$field->appendChild($doc->createTextNode($tel));
	}
	$field = $location->appendChild($doc->CreateElement("opening"));
	$field->appendChild($doc->createTextNode($opening));
	$field = $location->appendChild($doc->CreateElement("closing"));
	$field->appendChild($doc->createTextNode($closing));
}

?>
