<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class BroadcastType extends database
{
    public $result = array();
    public function GETTYPE()
    {
        if (isset($_SESSION["UNM"])) {
            $broadcasttypetable = $this->select("abstracttypetable","1",array());
            if (count($broadcasttypetable) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($broadcasttypetable); $i++) {
                    $this->result[] = array("status" => "Okey", "absid" => $broadcasttypetable[$i]['absid'], "abstxt" => $broadcasttypetable[$i]['abstxt']);
                }
                return $this->result;
            }
        }
    }
} ?>