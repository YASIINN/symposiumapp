<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class File extends database
{
    public $result = array();
    public function ADD($files,$usid,$fileext,$size,$type)
    {
        if($files){
            	// bcfsize	bcftype	bcfname	bcfpath
            $tempPath = $_FILES['file']['tmp_name'];
            $filename = bin2hex(openssl_random_pseudo_bytes(10));
            $filename=$filename."_".$usid;
            move_uploaded_file($tempPath, "../allword/$filename.$fileext");
            $fpath="http://localhost/symposiumapp/allword/".$filename;
            $data = array(
                "bcfsize" => $size,
                "bcftype" => $type,
                "bcfname" => $filename,
                "bcfpath" => $fpath
            );
            $addRows = $this->insert('broadcastfile', $data);
            if($addRows){
                $getuploadfile=$this->select("broadcastfile","bcfname=?",array($filename));
                $this->result = array("status" => "SuccesAdd","fid"=>$getuploadfile[0]['bcfid'],"fname"=>$getuploadfile[0]['bcfname']);
                return $this->result;
            }else{
                $this->result = array("status" => "None");
                return $this->result;
            }
        }
        else{
            $this->result = array("status" => "None");
            return $this->result;
        }
    }
} ?>