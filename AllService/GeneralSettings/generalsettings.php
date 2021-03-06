<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class GeneralSettings extends database
{
    public $result = array();
    public function GETGSETTİNGS()
    {
            $gsettings = $this->select("generalsettings", "1", array());
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "gsid" => $gsettings[$i]['gsid'], "gsbegdt" => $gsettings[$i]['gsbegdt'],
                    "gsenddt" => $gsettings[$i]['gsenddt'],
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
                    "gsbegdt"=>$data[$index]['gsbegdt'],
                    "gsenddt"=>$data[$index]['gsenddt']
                );
                $upP = $this->update("generalsettings", $sdata, $where, array($param));
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