<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    include('../dbclas/pdocls.php');
    require 'PHPMailer/PHPMailer/src/Exception.php';
    require 'PHPMailer/PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/PHPMailer/src/SMTP.php';
    header("Content-Type: application/json; charset=UTF-8");
    $result = false;
    $mail = new PHPMailer(true);
    $ead = "";
    $epass = "";

    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    $db = new database("root", "", "localhost", "symposiumapp");
    $sysrows = $db->select("generalsettingsmail","1",array());
    $ead =$sysrows[0]['gsmname'];

    //  $_POST['maildata'][0]['mail'];
    $epass =$sysrows[0]['gsmpass'];
    //  "4d32adf5";
    // $_POST['maildata'][0]['epass'];
    $subject= $_POST['maildata'][0]['subject'];
    $messega = $_POST['maildata'][0]['messega'];
    $mail->addAddress( $_POST['maildata'][0]['mail'], '');
    $mail->Username = $ead;
    $mail->Password = $epass;
    $mail->setFrom($ead, 'qqqq');
    $mail->addReplyTo($ead, '');
    $mail->isHTML(true);
    $mail->Subject =$subject;
    $mail->Body = $messega;
    $mail->AltBody = ' ';
    if ($mail->Send()) {
        $result = true;
    } else {
        $result = false;
    }
    if ($result == true) {
        $result = array("status" => "Succes");
        echo json_encode($result);
    } else {
        $result = array("status" => "None");
        echo json_encode($result);
    }
    ?>