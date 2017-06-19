<?php 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once('simple_html_dom.php');

$servicePath = 'http://askwcpl.wakegov.com/api_answers.php?';

$parameter = $_SERVER['QUERY_STRING'];

$combinedPath = $servicePath . $parameter;
echo file_get_contents($combinedPath);


?>