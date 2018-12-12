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
                $addRows = $this->insert('phonetable', $data);
            }
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                return $this->result;
            } else {
                $this->result = array("status" => "None");
                return $this->result;
            }

        }
    }
} ?>