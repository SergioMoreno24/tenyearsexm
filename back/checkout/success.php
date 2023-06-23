<?php
    $jsonStr = file_get_contents('php://input');
    $jsonObj = json_decode($jsonStr);

    $code = $jsonObj->code;


    require_once '../bd/conn.php';
    date_default_timezone_set('America/Mexico_City');
    
    $data = $conn->query('SELECT * FROM donations WHERE identifier = "'.$code.'"');
    if($data->num_rows > 0){
        $response = ['status' => 1, 'data' => $data->fetch_assoc()];
    }
    else{
        $response = ['status' => 0];
    }
    echo json_encode($response);

?>