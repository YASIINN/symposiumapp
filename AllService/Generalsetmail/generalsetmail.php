<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Generalsetmail extends database
{
    public $result = array();
    public function GET()
    {
            $gsettings = $this->select("generalsettingsmail", "1", array());
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "gsmid" => 
                    $gsettings[$i]['gsmid'], 
                    "gsmname" => $gsettings[$i]['gsmname'],
                    "gsmpass" => $gsettings[$i]['gsmpass'],
                );
                }
                return $this->result;
            }
    }
    public function SET($data, $where, $param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "gsmname"=>$data[$index]['gsmname'],
                    "gsmpass"=>$data[$index]['gsmpass']
                );
                $upP = $this->update("generalsettingsmail", $sdata, $where, array($param));
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