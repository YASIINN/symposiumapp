<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class File extends database
{
    public $result = array();
    public function ADD($files, $usid, $fileext, $size, $type,$bcext)
    {
        if ($files) {
            $tempPath = $_FILES['file']['tmp_name'];
            $filename = bin2hex(openssl_random_pseudo_bytes(10));
            $filename = $filename . "_" . $usid;
            move_uploaded_file($tempPath, "../allword/$filename.$fileext");
            $fpath = "/allword/" . $filename;
            $data = array(
                "bcfsize" => $size,
                "bcftype" => $type,
                "bcfname" => $filename,
                "bcfpath" => $fpath,
                "bcext"=>$bcext
            );
            if(null !==$this->beginTransaction()){
                $this->beginTransaction();
            }
            $addRows = $this->insert('broadcastfile', $data);
            if ($addRows) {
                $getuploadfile = $this->select("broadcastfile", "bcfname=?", array($filename));
                $this->result = array("status" => "SuccesAdd", "fid" => $getuploadfile[0]['bcfid'], "fname" => $getuploadfile[0]['bcfname']);
                $this->result;
                $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                $this->result;
                $this->DoOrDie(false);
            }
        } else {
            $this->result = array("status" => "None");
            $this->result;
        }
        return $this->result;
    }
    public function DEL($where,$param,$fname){
        if(null !==$this->beginTransaction()){
            $this->beginTransaction();
        }
        $file=$fname;
        if(file_exists("../allword/$file")){
            $del =$this->delete("broadcastfile",$where,array($param));
            if ($del) {
                $this->result = array("status" => "SuccesDel");
                 unlink("../allword/$file");
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
    public function SET($files, $usid, $fileext, $size, $type,$bcext,$delfile,$where,$param){
        if ($files) {
        $tempPath = $_FILES['file']['tmp_name'];
        $filename = bin2hex(openssl_random_pseudo_bytes(10));
        $filename = $filename . "_" . $usid;
        move_uploaded_file($tempPath, "../allword/$filename.$fileext");
        $fpath = "/allword/" . $filename;
        $data = array(
            "bcfsize" => $size,
            "bcftype" => $type,
            "bcfname" => $filename,
            "bcfpath" => $fpath,
            "bcext"=>$bcext
        );
        $file=$delfile;
        if(file_exists("../allword/$file")){
            unlink("../allword/$file");
        }
        $upP = $this->update("broadcastfile", $data, $where, array($param));
            if ($upP) {
           $this->result = array("status" => "SuccedUpdate");
         } 
         else {
              $this->result = array("status" => "None");
            }
    }
    return $this->result;
}

} ?>