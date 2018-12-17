<?php
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Register extends database
{
    public $result = array();
    public function ADD($registerdata)
    {
        for ($i = 0; $i < count($registerdata); $i++) {
            $data = array(
                "rtname" => $registerdata[$i]['rtname'],
                "rtlname" => $registerdata[$i]['rtlname'],
                "rtemail" => $registerdata[$i]['rtemail'],
                "rtuniinst" => $registerdata[$i]['rtuniinst'],
                "rtpass" => $registerdata[$i]['rtpass'],
                "rtlcode" => $registerdata[$i]['rtlcode'],
                "rauth" => $registerdata[$i]['rauth'],
                "rphone"=>$registerdata[$i]['rphone'],
            );
            if(null !==$this->beginTransaction()){
                $this->beginTransaction();
            }
            $addRows = $this->insert('registertemptable', $data);
        }
        if ($addRows) {
            $this->result[] = array("status" => "SuccesAdd");
             $this->result;
             $this->DoOrDie(true);
        } else {
            $this->result = array("status" => "None");
             $this->result;
             $this->DoOrDie(false);
        }
        return $this->result;
    }
    public function GET($where, $param)
    {
        $fparam = array();
        for ($index = 0; $index < count($param); $index++) {
            array_push($fparam, $param[$index]);
        }
        $getRegisterRows = $this->select("registertemptable",$where,$fparam);
        if (count($getRegisterRows) == 0) {
            $this->result = array("status" => "None");
             $this->result;
        } else {
            for ($i = 0; $i < count($getRegisterRows); $i++) {
                $this->result[] = array("status" => "Okey", "rtid" => $getRegisterRows[$i]['rtid'], "rtname" => $getRegisterRows[$i]['rtname'], "rtlname" => $getRegisterRows[$i]["rtlname"], "rtemail" => $getRegisterRows[$i]["rtemail"], "rtuniinst" => $getRegisterRows[$i]["rtuniinst"], "rtpass" => $getRegisterRows[$i]["rtpass"], "rtlcode" => $getRegisterRows[$i]['rtlcode'],'rauth'=>$getRegisterRows[$i]['rauth'],"rphone"=>$getRegisterRows[$i]['rphone']);
            }
        }
        return $this->result;
    }
    public function DEL($where, $param)
    {
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $delete =$this->delete("registertemptable",$where,array($param));
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
    public function DELALL()
    {
        $delete = $this->delete("registertemp", "1", array());
        if ($delete) {
            $this->result = array("status" => "SuccesDel");
            return $this->result;
        } else {
            $this->result = array("status" => "None");
            return $this->result;
        }
    }
} ?>