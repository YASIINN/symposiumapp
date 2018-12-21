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
                    "hsimg" =>"data:image/jpeg:image/png;base64,".base64_encode($gsettings[$i]['hsimg']),
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
                    "hslink"=>$data[$index]['hslink'],
                    "hsimg"=> base64_decode($data[$index]['hsimg'])
                );
                $upP = $this->update("headersettings", $sdata, $where, array($param));
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