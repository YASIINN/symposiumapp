<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class GeneralSetFolder extends database
{
    public $result = array();
    public function GET()
    {
        if (isset($_SESSION["UNM"])) {
            $gsetfolderrows =$this->getrows("SELECT * FROM generalsettingsfolder g
            INNER JOIN  abstracttypetable a on  a.absid=g.gsfabstype
             ",array());
            if (count($gsetfolderrows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($gsetfolderrows); $i++) {
                    $this->result[] = array("status" => "Okey", "gsfid" => $gsetfolderrows[$i]['gsfid'],
                     "gsfname" => $gsetfolderrows[$i]['gsfname'],
                     "gsftemppath" => $gsetfolderrows[$i]['gsftemppath'],
                     "gsftype" => $gsetfolderrows[$i]['gsftype'],
                     "gsfabstype" => $gsetfolderrows[$i]['gsfabstype'],
                     "absid"=> $gsetfolderrows[$i]['absid'],
                     "abstxt"=> $gsetfolderrows[$i]['abstxt'],
                    );
                }
                return $this->result;
            }
        }
    }
    public function GETWHERE($where,$param)
    {
        if (isset($_SESSION["UNM"])) {
            $gsetfolderrows =$this->getrows("SELECT * FROM generalsettingsfolder g
            INNER JOIN  abstracttypetable a on  a.absid=g.gsfabstype WHERE $where
             ",array($param));
            if (count($gsetfolderrows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($gsetfolderrows); $i++) {
                    $this->result[] = array("status" => "Okey", "gsfid" => $gsetfolderrows[$i]['gsfid'],
                     "gsfname" => $gsetfolderrows[$i]['gsfname'],
                     "gsftemppath" => $gsetfolderrows[$i]['gsftemppath'],
                     "gsftype" => $gsetfolderrows[$i]['gsftype'],
                     "gsfabstype" => $gsetfolderrows[$i]['gsfabstype'],
                     "absid"=> $gsetfolderrows[$i]['absid'],
                     "abstxt"=> $gsetfolderrows[$i]['abstxt'],
                    );
                }
                return $this->result;
            }
        }
    }
    public function DEL($where, $param,$fname){
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $file=$fname;
        if(file_exists("../sysword/$file")){
            $del =$this->delete("generalsettingsfolder",$where,array($param));
            if ($del) {
                $this->result = array("status" => "SuccesDel");
                 unlink("../sysword/$file");
                 $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                 $this->DoOrDie(false);
            }
     
        }else{
            $this->result = array("status" => "None","aaa"=>$file);
        }
        return $this->result;
    }
    public function SET($data,$where,$param,$prevname){
        $pname=$prevname.$data[0]['gsftype'];
        $nname=$data[0]['gsfname'].$data[0]['gsftype'];
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "gsfname"=>$data[$index]['gsfname'],
                    "gsftemppath"=>$data[$index]['gsftemppath'],
                    "gsftype"=>$data[$index]['gsftype'],
                    "gsfabstype"=>$data[$index]['gsfabstype'],
                );
                $upP = $this->update("generalsettingsfolder", $sdata, $where, array($param));
            }
            if ($upP) {
                rename("../sysword/$pname","../sysword/$nname");
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
} ?>