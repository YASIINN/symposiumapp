<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class HeaderSettings extends database
{
    public $result = array();
    public function GET()
    {
            $gsettings = $this->select("headersettings", "1", array());
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "hsid" => 
                    $gsettings[$i]['hsid'], 
                    "hslink" => $gsettings[$i]['hslink'],
                    "hsimg" =>$gsettings[$i]['hsimg'],
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
                    "hslink"=>$data[$index]['hslink'],
                    "hsimg"=> $data[$index]['hsimg'],
                );
                $upP = $this->insert("headersettings", $sdata);
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
        $delete =$this->delete("headersettings",$where,array($param));
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