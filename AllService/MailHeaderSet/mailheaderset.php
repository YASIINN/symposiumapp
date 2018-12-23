<?php
/**
 * Created by PhpStorm.
 * User: Yasin
 * Date: 22.12.2018
 * Time: 18:49
 */
/*mailheadersettings*/
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class MailHeaderSet extends database
{
    public $result = array();
    public function GET()
    {
        $gsettings = $this->select("mailheadersettings", "1", array());
        if (count($gsettings) == 0) {
            $this->result = array("status" => "None");
        } else {
            for ($i = 0; $i < count($gsettings); $i++) {
                $this->result[] = array("status" => "Okey", "mhsid" =>
                    $gsettings[$i]['mhsid'],
                    "mhstxt" => $gsettings[$i]['mhstxt']
                );
            }
        }
        return $this->result;

    }
    public function SET($data, $where, $param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "mhsid"=>$data[$index]['mhsid'],
                    "mhstxt"=>$data[$index]['mhstxt']
                );
                $upP = $this->update("mailheadersettings", $sdata, $where, array($param));
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