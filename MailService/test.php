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
    for ($i=0; $i < count($data); $i++) { 
  ?>
  <tr>
    <td><?= $data[$i]['Company']; ?></td>
    <td><?= $data[$i]['Contact']; ?></td>
    <td><?= $data[$i]['Country']; ?></td>
  </tr>
  <?php
    }
  ?>
</table>
</body>
</html>
