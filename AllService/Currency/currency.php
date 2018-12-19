<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Currency extends database
{
    public $result = array();
    public function GET()
    {
            $gsettings = $this->select("fbtype","1",array());
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "fbtpid" => 
                    $gsettings[$i]['fbtpid'], 
                    "fbtxt" => $gsettings[$i]['fbtxt']
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
        $delete =$this->delete("fbtype",$where,array($param));
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
                    "fbtxt"=>$data[$i]['fbtxt'],
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('fbtype', $sdata);
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
                    "fbtxt"=>$data[$index]['fbtxt'],
                );
                $upP = $this->update("fbtype", $sdata, $where, array($param));
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