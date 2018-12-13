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
                 $this->result;
                 $this->DoOrDie(true);
            } else {
                $this->result[] = array("status" => "None");
                 $this->result;
                 $this->DoOrDie(false);
            }
        }
        return $this->result;
    }
} ?>