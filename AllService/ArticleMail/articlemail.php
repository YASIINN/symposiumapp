<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class ArticleMail extends database
{
    public $result = array();
    public function GET()
    {
        $gsettings = $this->select("articlemailsettingstable", "1", array());
        if (count($gsettings) == 0) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            for ($i = 0; $i < count($gsettings); $i++) {
                $this->result[] = array("status" => "Okey", "asmid" =>
                    $gsettings[$i]['asmid'],
                    "asmname" => $gsettings[$i]['asmname'],
                    "asmpass" => $gsettings[$i]['asmpass'],
                    "asmhost"=>$gsettings[$i]['asmhost']
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
                    "asmname"=>$data[$index]['asmname'],
                    "asmpass"=>$data[$index]['asmpass'],
                    "asmhost"=>$data[$index]['asmhost']
                );
                $upP = $this->update("articlemailsettingstable", $sdata, $where, array($param));
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