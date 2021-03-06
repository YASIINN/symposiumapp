<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Title extends database
{
    public $result = array();
    public function GETTİTLE()
    {
        if (isset($_SESSION["UNM"])) {
            $titleRows = $this->select("titletable","1",array());
            if (count($titleRows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($titleRows); $i++) {
                    $this->result[] = array("status" => "Okey", "tid" => $titleRows[$i]['tid'], "titletxt" => $titleRows[$i]['titletxt'], );
                }
                return $this->result;
            }
        }
    }
    public function DELTİTLE($where,$param){
        if (isset($_SESSION["UNM"])) {
            $delrow = $this->delete("titletable", $where, array($param));
            if ($delrow) {
                $this->result = array("status" => "SuccesDel");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
    public function EDİTTİTLE($tdata, $where, $param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($tdata); $index++) {
                $data = array(
                    "titletxt"=>$tdata[$index]['titletxt']
                );
                $upP = $this->update("titletable", $data, $where, array($param));
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
    public function ADDTİTLE($tdata)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($tdata); $index++) {
                $data = array(
                    "titletxt"=>$tdata[$index]['titletxt']
                );
                $add = $this->insert("titletable",$data);
            }
            if ($add) {
                $this->result = array("status" => "SuccesAdd");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
} ?>