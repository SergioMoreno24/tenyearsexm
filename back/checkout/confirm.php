<?php
    require_once '../bd/conn.php';
    date_default_timezone_set('America/Mexico_City');

    $jsonStr = file_get_contents('php://input');
    $jsonObj = json_decode($jsonStr);

    $name = $jsonObj->name;
    $email = $jsonObj->email;
    $amount = $jsonObj->amount;
    $organization = $jsonObj->organization;
    $whoinvitedyou = $jsonObj->whoinvitedyou;
    $companion = $jsonObj->companion;
    $companionname = $jsonObj->companionname;
    $wantdonate = $jsonObj->wantdonate;

    $query = 'INSERT INTO users (name, email, companion, companionname, organization, whoinvitedyou, wantdonate, quantity, datetime) VALUES ("'.$name.'", "'.$email.'", "'.$companion.'", "'.$companionname.'", "'.$organization.'", "'.$whoinvitedyou.'", "'.$wantdonate.'", "'.$amount.'", "'.date("Y-m-d H:i:s").'")';
    $response = ['status' => 0, 'query' => $query];
    if($conn->query($query))
        $response = ['status' => 1];

    echo json_encode($response);
?>