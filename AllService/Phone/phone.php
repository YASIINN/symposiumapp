<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Phone extends database
{
    public $result = array();
    public function ADD($pdata)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($pdata); $i++) {
                $data = array(
                    "pnmbr" => $pdata[$i]['pnmbr'],
                    "uid" => $pdata[$i]['uid']
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('phonetable', $data);
            }
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                $this->result;
                $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                $this->result;
                $this->DoOrDie(false);
            }

        }
        return $this->result;
    }
} ?>