<?php
include('../dbclas/pdocls.php');
// header("Content-Type: application/json; charset=UTF-8");
$db = new database("root", "", "localhost", "symposiumapp");
// echo  md5("1a78b")."_".date("dmy");
//  $arr[]=array(
//     "Operation"=>"EQ",
//     "PropertyName"=> "ad",
//     "PropertyValue"=>"mehmet",
//     "Operation"=>"EQ",
//     "PropertyName"=> "sss",
//     "PropertyValue"=>"sss",
//  );

$getRegisterRows = $db->select("registertemptable","1",array());
print_r($getRegisterRows);
?>