<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Broadcast extends database
{
    public $result = array();
    public function ADD($broadcastdata)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($broadcastdata); $i++) {
                $name=$broadcastdata[$i]['brdcastname'];
                $data = array(
                    "brdcasttype" => $broadcastdata[$i]['brdcasttype'],
                    "brdcastname" => $broadcastdata[$i]['brdcastname'],
                    "brdsubject" => $broadcastdata[$i]['brdsubject'],
                    "abtype" => $broadcastdata[$i]['abtype'],
                    "fileid" => $broadcastdata[$i]['fileid'],
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('broadcasttable', $data);
            }
            if ($addRows) {
                $getbroadcast=$this->select("broadcasttable","brdcastname=?",array($name));
                $this->result[] = array("status" => "SuccesAdd","btid"=>$getbroadcast[0]['btid']);
                 $this->DoOrDie(true);
            } else {
                $this->result[] = array("status" => "None");
                 $this->DoOrDie(false);
            }
        }
        return $this->result;
    }
    public function GET($where,$param){
        if (isset($_SESSION["UNM"])) {
            $fparam = array();
            for ($index = 0; $index < count($param); $index++) {
                array_push($fparam, $param[$index]);
            }
            $getbrrows =$this->getrows("SELECT  * FROM autrelbrodtable ab
            INNER JOIN  broadcasttable b ON b.btid=ab.btid
            INNER JOIN usertable u ON u.usid=ab.usid
            INNER JOIN  broadcasttypetable bt ON b.brdcasttype=bt.btypeid
            INNER JOIN  abstracttypetable atp ON atp.absid=b.abtype
            INNER JOIN  broadcastfile f ON f.bcfid=b.fileid
             where $where", $fparam);
            if(count($getbrrows)==0){
                $this->result = array("status" => "None");
            }else{
                for ($i=0; $i <count($getbrrows) ; $i++) { 
                $this->result[] = array("status" => "Okey",
                 "arbid" => $getbrrows[$i]['arbid'], 
                 "usid" => $getbrrows[$i]['usid'],
                  "btid" => $getbrrows[$i]["btid"], 
                  "brdcastname" => $getbrrows[$i]["brdcastname"],
                   "brdsubject" => $getbrrows[$i]["brdsubject"],
                   "abtype" => $getbrrows[$i]["abtype"],
                 "fileid" => $getbrrows[$i]['fileid'],
                 'usname'=>$getbrrows[$i]['usname'],
                 'uslname'=>$getbrrows[$i]['uslname'],
                 'uauth'=>$getbrrows[$i]['uauth'],
                 'uniorinst'=>$getbrrows[$i]['uniorinst'],
                 'ulgnname'=>$getbrrows[$i]['ulgnname'],
                 'country'=>$getbrrows[$i]['country'],
                 'tid'=>$getbrrows[$i]['tid'],
                 'adress'=>$getbrrows[$i]['adress'],
                 'ftextquota'=>$getbrrows[$i]['ftextquota'],
                 'absquota'=>$getbrrows[$i]['absquota'],
                 'mainaut'=>$getbrrows[$i]['mainaut'],
                 'btypeid'=>$getbrrows[$i]['btypeid'],
                 'btypetxt'=>$getbrrows[$i]['btypetxt'],
                 'absid'=>$getbrrows[$i]['absid'],
                 'abstxt'=>$getbrrows[$i]['abstxt'],
                 'bcfid'=>$getbrrows[$i]['bcfid'],
                 'bcfname'=>$getbrrows[$i]['bcfname'],
                 'bcfpath'=>$getbrrows[$i]['bcfpath'],
                 "bcext"=>$getbrrows[$i]['bcext']);

                }
            }
        }
        return $this->result;
    }
} ?>