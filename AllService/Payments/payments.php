<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Payments extends database
{
    public $result = array();
    public function GET()
    {
            $gsettings = $this->select("paymentway","1",array());
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "pwid" => 
                    $gsettings[$i]['pwid'], 
                    "pwtxt" => $gsettings[$i]['pwtxt'],
                );
                }
            }
            return $this->result;

    }
    public function DEL($where, $param)
    {
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $delete =$this->delete("paymentway",$where,array($param));
        if ($delete) {
            $this->result = array("status" => "SuccesDel");
             $this->DoOrDie(true);
        } else {
            $this->result = array("status" => "None");
             $this->DoOrDie(false);
        }
        return $this->result;
    }
    public function ADD($data)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($data); $i++) {
                $sdata = array(
                    "pwtxt"=>$data[$i]['pwtxt'],
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('paymentway', $sdata);
            }
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                $this->DoOrDie(false);
            }

        }
        return $this->result;
    }
    public function SET($data, $where, $param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "pwtxt"=>$data[$index]['pwtxt'],
                );
                $upP = $this->update("paymentway", $sdata, $where, array($param));
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
} ?>