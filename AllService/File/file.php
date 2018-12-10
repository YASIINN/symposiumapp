<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class File extends database
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
} ?>