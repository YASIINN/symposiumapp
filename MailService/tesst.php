<?php
session_start();
include('../dbclas/pdocls.php');
// header("Content-Type: application/json; charset=UTF-8");
$db = new database("root", "", "localhost", "symposiumapp");
//    move_uploaded_file($_FILES['file']['tmp_name'],"http://localhost/symposiumapp/allword/");
// if($_FILES){
//     $tempPath = $_FILES['file']['tmp_name'];
//     $filename = bin2hex(openssl_random_pseudo_bytes(10));
//     $aa=$_POST['id'];
//     $filename=$filename."_".$aa;
//     move_uploaded_file($tempPath, "../allword/$filename.doc");
//     echo "gitti";
// }
// else{
//     echo "adasdsa";
// }
// if(file_exists("../sysword/sistem.docx")){
//     echo "sildim";
//     unlink("../sysword/sistem.docx");
// }else{
//     echo "dosya yok";
// }
rename("../sysword/asdsad.docx","../sysword/fff.docx");

?>