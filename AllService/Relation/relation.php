<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Relation extends database
{
    public $result = array();
    public function ADD($data)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($data); $i++) {
                $ardata = array(
                    "usid" => $data[$i]['usid'],
                    "btid" => $data[$i]['btid'],
                );
                // if(null !==$this->beginTransaction()){
                //     $this->beginTransaction();
                // }
                $addRows = $this->insert('autrelbrodtable', $ardata);
            }
            if ($addRows) {
                 $this->result = array("status" => "SuccesAdd");
                //  $this->DoOrDie(true);
            } else {
                 $this->result = array("status" => "None");
                //  $this->DoOrDie(false);
            }
        }
        return $this->result ;
    }
} ?>