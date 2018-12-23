<?php
/**
 * Created by PhpStorm.
 * User: Yasin
 * Date: 23.12.2018
 * Time: 10:54
 */
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Company extends database
{
    public $result = array();
    public function GET()
    {
        $gsettings = $this->select("companysettingstable","1",array());
        if (count($gsettings) == 0) {
            $this->result = array("status" => "None");
        } else {
            for ($i = 0; $i < count($gsettings); $i++) {
                $this->result[] = array("status" => "Okey", "csid" =>
                    $gsettings[$i]['csid'],
                    "cpname" => $gsettings[$i]['cpname'],
                    "cpadress" => $gsettings[$i]['cpadress'],
                          "cpidic" => $gsettings[$i]['cpidic'],
                      "cpvatreg" => $gsettings[$i]['cpvatreg'],
                      "cpbankname" => $gsettings[$i]['cpbankname'],
                      "cpbankadres" => $gsettings[$i]['cpbankadres'],
                      "cpbankaccount" => $gsettings[$i]['cpbankaccount'],
                      "cpiban" => $gsettings[$i]['cpiban'],
                      "cpbicswift" => $gsettings[$i]['cpbicswift'],
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
                    "cpname"=>$data[$index]['cpname'],
                    "cpadress"=>$data[$index]['cpadress'],
                    "cpidic"=>$data[$index]['cpidic'],
                    "cpvatreg"=>$data[$index]['cpvatreg'],
                    "cpbankname"=>$data[$index]['cpbankname'],
                    "cpbankadres"=>$data[$index]['cpbankadres'],
                    "cpbankaccount"=>$data[$index]['cpbankaccount'],
                    "cpiban"=>$data[$index]['cpiban'],
                    "cpbicswift"=>$data[$index]['cpbicswift'],
                );
                $upP = $this->update("companysettingstable", $sdata, $where, array($param));
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