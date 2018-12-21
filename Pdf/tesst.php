<?php
session_start();
include('../dbclas/pdocls.php');
require_once("dompdf/autoload.inc.php");
use Dompdf\Dompdf;

$dompdf=new Dompdf();
// $dompdf->loadHtml("<table border='1'><tr><td>School 1</td><td>Percent1</td></tr><tr><td> School 2</td><td> Percent2</td></tr><tr><td> School 3</td><td> Percent3</td></tr></table>");
ob_start();
include "test.php";
$html = ob_get_clean();
$dompdf->loadHtml($html,'UTF-8');
$dompdf->setPaper('A4','landscape');
$dompdf->render();
 $dompdf->stream("aaa",array('Attachment'=>0));
$db = new database("root", "", "localhost", "symposiumapp");


?>