<?php 
    require_once '../bd/conn.php';
    require_once './birthdaycardtemplate.php';
    
    date_default_timezone_set('America/Mexico_City');
    $query = 'SELECT * FROM birthday';
    $result = $conn->query($query);

    while($row = $result->fetch_assoc()){
        $birthdate = substr($row['birthdate'], 5, 5);
        $today = substr(date('Y-m-d'), 5, 5);
        echo $today.' - '.$birthdate;
        echo '</br>';
        if($birthdate === $today){
            echo 'Cumple de '.$row['name'];
            echo '<br/>';
            echo 'Query -> '.'UPDATE birthday SET datesent = "'.$date('Y-m-d').'" WHERE email = "'.$row['email'].'"';
            //sendMail(['name' => $row['name'], 'email' => $row['email']], false);
            $conn->query('UPDATE birthday SET datesent = "'.$date('Y-m-d').'" WHERE email = "'.$row['email'].'" ');
        }
    }

    $conn->close();
?>