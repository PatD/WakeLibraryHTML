<?php 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

class XmlToJson {

	public static function Parse ($url) {

		$fileContents= file_get_contents($url);

		$fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);

		$fileContents = trim(str_replace('"', "'", $fileContents));	
		
		$simpleXml = simplexml_load_string($fileContents);

		$json = json_encode($simpleXml);
		
		// Removes a weird @ sign that's added sometimes
		$json = str_replace('@attributes', 'attributes', $json);


		return $json;

	}

}

// include_once('simple_html_dom.php');

$servicePath = 'https://catalog.wakegov.com/Search/Results?';

$parameter = $_SERVER['QUERY_STRING'];

$combinedPath = $servicePath . $parameter;
// echo file_get_contents($combinedPath);


print XmlToJson::Parse($combinedPath);

?>