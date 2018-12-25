<?php
/**
 * Created by PhpStorm.
 * User: Yasin
 * Date: 24.12.2018
 * Time: 17:52
 */
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class ProformaImg extends database
{
    public $result = array();
    public function GET()
    {
        $gsettings = $this->select("proformaimage", "1", array());
        if (count($gsettings) == 0) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            for ($i = 0; $i < count($gsettings); $i++) {
                $this->result[] = array("status" => "Okey", "pimgid" =>
                    $gsettings[$i]['pimgid'],
                    "pheaderimg" => "data:image/jpeg:image/png;base64,".base64_encode($gsettings[$i]['pheaderimg']),
                    "pfooterimg" =>"data:image/jpeg:image/png;base64,".base64_encode($gsettings[$i]['pfooterimg']),
                );
            }
            return $this->result;
        }
    }
    public function SET($data)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "pheaderimg"=>base64_decode($data[$index]['pheaderimg']),
                    "pfooterimg"=> base64_decode($data[$index]['pfooterimg']),
                );
                $upP = $this->insert("proformaimage", $sdata);
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
    public function DEL($where, $param)
    {
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $delete =$this->delete("proformaimage",$where,array($param));
        if ($delete) {
            $this->result = array("status" => "SuccesDel");
            $this->DoOrDie(true);
        } else {
            $this->result = array("status" => "None");
            $this->DoOrDie(false);
        }
        return $this->result;
    }
} ?>