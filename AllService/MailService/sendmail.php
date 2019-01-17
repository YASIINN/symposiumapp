<?php
/**
 * Created by PhpStorm.
 * User: Yasin
 * Date: 3.01.2019
 * Time: 19:14
 */

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
require_once('../dbclas/pdocls.php');

    require 'PHPMailer/PHPMailer/src/Exception.php';
    require 'PHPMailer/PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/PHPMailer/src/SMTP.php';
    header("Content-Type: application/json; charset=UTF-8");

class MailService extends database
{
    public $results;
    function  sendmail($hostname,$mailname,$mpassword,$subjectm,$messagem,$maildata)
    {
        $result = false;
        $mail = new PHPMailer(true);
        $ead = "";
        $epass = "";
        $mail->isSMTP();
        $mail->Host = $hostname;
        //'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        $ead = $mailname;
        $epass = $mpassword;
        $subject = $subjectm;
        $messega =$messagem;
        $mail->addAddress($maildata, '');
        $mail->Username = $ead;
        $mail->Password = $epass;
        $mail->setFrom($ead, '');
        $mail->addReplyTo($ead, '');
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $messega;
        $mail->AltBody = ' ';
        if ($mail->Send()) {
            $result = true;
        } else {
            $result = false;
        }
        if ($result == true) {
           return $this->results= array("status" => "Succes");
        } else {
           return $this->results= array("status" => "None");
        }
    }
}
    ?>