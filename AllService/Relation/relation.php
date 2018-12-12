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
                $addRows = $this->insert('autrelbrodtable', $ardata);
            }
            if ($addRows) {
                return $this->result = array("status" => "SuccesAdd");
            } else {
                return $this->result = array("status" => "None");
            }
        }
    }
} ?>