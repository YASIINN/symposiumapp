<?php 
$db = new database("root", "", "localhost", "symposiumapp");
$datas=$db->select("usertable","1",array());
// $rows=$db->select("")
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
<style>
@font-face {
  font-family: "varela-round";
  src: url("fonts/VarelaRound-Regular.ttf");
}
body { font-family:  'varela-round'; }
table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>
  <?php 
    $data=[
      [
        'Company' => 'Bıla',
        'Contact' => 'Bıla2',
        'Country' => 'Bıla3'
      ],
      [
        'Company' => 'Ahmet',
        'Contact' => 'Ayşe',
        'Country' => 'Zeynep'
      ],
      [
        'Company' => 'Eyüp',
        'Contact' => 'Baran',
        'Country' => 'Sıla'
      ]
    ];
  ?>

<h2>HTML Table</h2>
<img src="data:image/jpeg;base64,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">
<div  style="width:200px; border:1px solid;">
    <p>testasdasdassd</p>

  </div>
<table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <?php
    for ($i=0; $i < count($datas); $i++) { 
  ?>
  <tr>
    <td><?= $datas[$i]['usname']; ?></td>
    <td><?= $datas[$i]['uslname']; ?></td>
    <td><?= $datas[$i]['uniorinst']; ?></td>
  </tr>
  <?php
    }
  ?>
</table>
</body>
</html>
