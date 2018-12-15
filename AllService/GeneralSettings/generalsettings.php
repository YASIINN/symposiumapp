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
    // public function DELTOPİC($where, $param)
    // {
    //     if (isset($_SESSION["UNM"])) {
    //         $delrow = $this->delete("topicstable", $where, array($param));
    //         if ($delrow) {
    //             $this->result = array("status" => "SuccesDel");
    //         } else {
    //             $this->result = array("status" => "None");
    //         }

    //     }
    //     return $this->result;
    // }
    // public function EDİTTOPİC($tdata, $where, $param)
    // {
    //     if (isset($_SESSION["UNM"])) {
    //         for ($index = 0; $index < count($tdata); $index++) {
    //             $data = array(
    //                 "tptxt"=>$tdata[$index]['tptxt']
    //             );
    //             $upP = $this->update("topicstable", $data, $where, array($param));
    //         }
    //         if ($upP) {
    //             $this->result = array("status" => "SuccedUpdate");
    //         } else {
    //             $this->result = array("status" => "None");
    //         }
    //     }
    //     return $this->result;
    // }
    // public function ADDTOPİC($tdata)
    // {
    //     if (isset($_SESSION["UNM"])) {
    //         for ($index = 0; $index < count($tdata); $index++) {
    //             $data = array(
    //                 "tptxt"=>$tdata[$index]['tptxt']
    //             );
    //             $add = $this->insert("topicstable",$data);
    //         }
    //         if ($add) {
    //             $this->result = array("status" => "SuccesAdd");
    //         } else {
    //             $this->result = array("status" => "None");
    //         }
    //     }
    //     return $this->result;
    // }
} ?>