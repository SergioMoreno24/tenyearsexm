<?php 
    require_once '../bd/conn.php';
    require_once './birthdaycardtemplate.php';
    date_default_timezone_set('America/Mexico_City');
    $query = 'SELECT * FROM donations';
    $result = $conn->query($query);

    while($row = $result->fetch_assoc()){
        $birthdate = substr($row['birthdate'], 5, 5);
        $today = substr(date('Y-m-d'), 5, 5);
        echo '</br>';
        if($birthdate === $today){
            sendMail(['name' => $row['name'], 'email' => $row['email']], false);
        }
    }

    $conn->close();
?>