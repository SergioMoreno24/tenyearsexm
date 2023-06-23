<?php

use PHPMailer\PHPMailer\PHPMailer;

use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';



function sendMail($data, $dev){
    if(!$dev){
        $mail = new PHPMailer(true);

        try {

            //Datos de remitente.

            $mail->isSMTP();

            $mail->Host = 'mail.edupam.org';

            $mail->SMTPAuth = true;

            $mail->SMTPSecure = 'ssl';

            $mail->Username = 'donativos@edupam.org';

            $mail->Password = 'Edupam:Donativos_005';

            $mail->Port = 465; //587



            //Datos de destinatario

            $mail->setFrom($mail->Username, 'EDUPAM');

            $mail->addAddress($data['email']);

            $mail->Subject = 'EDUPAM te desea un feliz cumpleaños';

            $mail->isHTML(true);

            $mail->CharSet = 'UTF-8';



            $mail->AddEmbeddedImage("./card.jpg", "card", "birthdaycard.jpg");            

            $mail->Body = '<html>
                                <div id="body" style="text-align:left;width:90%;margin:0 auto;background-color:white;font-family:Helvetica,sans-serif;font-size:14px;line-height:150%;max-width:550px;letter-spacing:1px;padding:10px;">
                                    <div>
                                        <p style="font-size:1.3em;font-weigth:700;margin-top:15px;margin-bottom:15px;">Querida(o) '.$data['name'].'</p>
                                        <img src="cid:card" alt="Imagen edupam" style="width:100%;"/>

                                        <div style="margin:10px 0px;">
                                            <p style="font-weight:700;color:##EE7A22;font-size:1.2em;">Nuestros niños tienen un mensaje para ti:</p>
                                            <a rel="nofollow noreferrer" target="_blank" href="http:www//edupam.org/birthday/birthday.html">Ver el video</a>
                                        </div>
                                    </div>
                                </div>
                            </html>';



            $mail->send();

            error_log('Mail enviado a - '.$data['email'], 0);
            echo 'Si';

            return 'Si';

        } catch (Exception $e) {

            error_log('Mail no enviado a - '.$data['email'], 0);

            error_log($e->getMessage(), 0);
            echo 'No';

            return 'No';

        }
    }
    else{
        return 'NA';
    }
}

?>