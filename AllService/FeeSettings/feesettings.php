<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class FeeSettings extends database
{
    public $result = array();
    public function GET()
    {
            $gsettings = $this->getrows("SELECT * FROM feessettingss f 
            INNER JOIN fbtype ft ON ft.fbtpid=f.fptype
            ");
            if (count($gsettings) == 0) {
                $this->result = array("status" => "None");
            } else {
                for ($i = 0; $i < count($gsettings); $i++) {
                    $this->result[] = array("status" => "Okey", "fsid" => 
                    $gsettings[$i]['fsid'], 
                    "fstxt" => $gsettings[$i]['fstxt'],
                    "fsprice" => $gsettings[$i]['fsprice'],
                    "fbtpid"=>$gsettings[$i]['fbtpid'],
                    "fbtxt"=>$gsettings[$i]['fbtxt'],
                   "fsquota"=>$gsettings[$i]['fsquota'],
                   "vat"=>$gsettings[$i]['vat'],
                   "vaty"=>$gsettings[$i]['vaty'],
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
                    "fstxt"=>$data[$index]['fstxt'],
                    "fsprice"=>$data[$index]['fsprice'],
                    "fptype"=>$data[$index]['fptype'],
                    "fsquota"=>$data[$index]['fsquota'],
                    "vaty"=>$data[$index]['vaty'],
                    "vat"=>$data[$index]['vat'],
                );
                $upP = $this->update("feessettingss", $sdata, $where, array($param));
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
    public function ADD($data)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($data); $i++) {
                $sdata = array(
                    "fstxt"=>$data[$i]['fstxt'],
                    "fsprice"=>$data[$i]['fsprice'],
                    "fptype"=>$data[$i]['fptype'],
                    "fsquota"=>$data[$i]['fsquota'],
                    "vaty"=>$data[$i]['vaty'],
                    "vat"=>$data[$i]['vat'],
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('feessettingss', $sdata);
            }
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                $this->DoOrDie(false);
            }

        }
        return $this->result;
    }
    public function DEL($where, $param)
    {
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $delete =$this->delete("feessettingss",$where,array($param));
        if ($delete) {
            $this->result = array("status" => "SuccesDel");
             $this->result;
             $this->DoOrDie(true);
        } else {
            $this->result = array("status" => "None");
             $this->result;
             $this->DoOrDie(false);
        }
        return $this->result;
    }
} ?>