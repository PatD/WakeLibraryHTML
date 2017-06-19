<?php 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once('simple_html_dom.php');

/*
$parts = parse_url($url);
parse_str($parts['query'], $query);

echo $query['email'];
*/


$servicePath = 'http://askwcpl.wakegov.com/api_qa.php?';

$parameter = $_SERVER['QUERY_STRING'];

// echo $servicePath;
// echo  $parameter;

$combinedPath = $servicePath . $parameter;
//echo $combinedPath;
// echo file_get_html($combinedPath)->plaintext;
echo file_get_contents($combinedPath);


// echo htmlspecialchars($_GET["s"]);

// echo file_get_html('http://askwcpl.wakegov.com/api_qa.php?iid=294&qid=54540&format=json')->plaintext;


?>