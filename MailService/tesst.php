<?php
session_start();
include('../dbclas/pdocls.php');
// header("Content-Type: application/json; charset=UTF-8");
$db = new database("root", "", "localhost", "symposiumapp");
echo "";
//    move_uploaded_file($_FILES['file']['tmp_name'],"http://localhost/symposiumapp/allword/");
$tempPath = $_FILES['file']['tmp_name'];
//    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'allword' . DIRECTORY_SEPARATOR ."yasindeneme";
$aa = $_POST['id'];
move_uploaded_file($tempPath, "../allword/xyz.docx");
echo "<script>alert('$aa')</script>";
echo "<script>alert('dosya yuklendı')</script>";

?>