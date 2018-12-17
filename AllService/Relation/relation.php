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
                 $this->result = array("status" => "SuccesAdd");
            } else {
                 $this->result = array("status" => "None");
            }
        }
        return $this->result ;
    }
    public function DEL($where,$param){
        if (isset($_SESSION["UNM"])) {
            $del =$this->delete("autrelbrodtable",$where,array($param));
            if($del){
                $this->result = array("status" => "SuccesDel");
            }else{
                $this->result = array("status" => "None");
            }
        }
        return $this->result ;
    }
    public function GET($where,$param){
        if (isset($_SESSION["UNM"])) {
            $getrel =$this->select("autrelbrodtable",$where,array($param));
            if(count($getrel)==0){
                $this->result = array("status" => "None");
            }else{
                for ($i=0; $i <count($getrel) ; $i++) { 
                    $this->result[] = array("status" => "Okey",
                     "arbid" => $getrel[$i]['arbid'], 
                     "usid" => $getrel[$i]['usid'],
                    "btid" => $getrel[$i]["btid"],
                    "count"=>count($getrel)
                );
            };
            }
        }
        return $this->result ;
    }
} ?>