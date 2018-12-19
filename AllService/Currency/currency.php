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
    // public function DEL($where, $param)
    // {
    //     if(null !==$this->beginTransaction()){
    //         $this->beginTransaction();
    //     }
    //     $delete =$this->delete("feessettingss",$where,array($param));
    //     if ($delete) {
    //         $this->result = array("status" => "SuccesDel");
    //          $this->result;
    //          $this->DoOrDie(true);
    //     } else {
    //         $this->result = array("status" => "None");
    //          $this->result;
    //          $this->DoOrDie(false);
    //     }
    //     return $this->result;
    // }
} ?>