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

            $mail->setFrom($mail->Username, 'Donativo EDUPAM');

            $mail->addAddress($data['email'], $data['name'].' '.$data['lastname']);

            $mail->Subject = 'Gracias por tu donativo';

            $mail->isHTML(true);

            $mail->CharSet = 'UTF-8';

            if($data['type'] === '1')

                $textoTotal = '';

            else if ($data['type'] === '2')

                $textoTotal = 'mensual ';



            $mail->AddEmbeddedImage("../../img/edupamlogo.png", "edupamlogo", "edupamlogo.png");

            $mail->AddEmbeddedImage("../../img/gracias.gif", "gracias", "gracias.gif");

            $mail->AddEmbeddedImage("../../img/fAMC.png", "fAMC", "fAMC.png");

            $mail->Body = '<html>
                                <div id="body" style="text-align:left;width:90%;margin:0 auto;background-color:white;font-family:Helvetica,sans-serif;font-size:14px;line-height:150%;max-width:550px;letter-spacing:1px;">
                                    <div style="text-align:center;">
                                        <img src="cid:edupamlogo" alt="Imagen edupam" style="width:30%;"/>
                                    </div>
                                    <p>
                                        Querido(a) '.$data['name'].', <br/>
                                        Gracias por formar parte del cambio y apoyar a que juntos, logremos una mejor educación para los niños en México. Estamos convencidos de que una acción en la dirección correcta abre posibilidades de crecimiento y brinda oportunidades cruciales en el desarrollo de la niñez.
                                    </p>
                                    <div style="text-align:center;">
                                        <img src="cid:gracias" alt="Imagen gracias" style="width:85%"/>
                                        <p style="color:#ff9933;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;font-size:18px;font-weight:700;letter-spacing:0px;">
                                            ¡GRACIAS A TI, MÁS NIÑOS AVANZARÁN A UN MEJOR FUTURO!
                                        </p>
                                    </div>
                                    <p>
                                        Con tu donativo '.$textoTotal.'de $'.$data['quantity'].', podremos apoyar a que más niños, niñas y jóvenes tengan acceso a programas académicos de calidad y logren un aprendizaje significativo. En los Centros Comunitarios de Aprendizaje encontrarán un lugar seguro en donde podrán recibir atención y seguimiento personalizado a través de programas de lectoescritura, inglés, ciencias, arte, tecnología y atención socioemocional.
                                        <br/><br/>
                                        Seguimos trabajando en nuestro compromiso de reducir el rezago educativo en México y ayudar a impactar favorablemente la vida de los niños, niñas y jóvenes apoyándolos a desarrollar habilidades enfocadas a una vida plena y feliz, generando un cambio positivo en sus familias y en la comunidad global; a través de una educación integral de alta calidad.
                                        <br/><br/>
                                        “La educación no cambia el mundo, cambia a las personas que van a cambiar al mundo”<br/><br/>
                                        -Paulo Freire
                                    </p>
                                    <div style="text-align:center;">
                                        <img src="cid:fAMC" alt="Firma directora ejecutiva" style="width:20%;"/><br/>
                                        <p>
                                            Atte.:<br/>
                                            Adriana Martín del Campo<br/>
                                            Directora ejecutiva<br/>
                                            EDUPAM, Educación para México<br/>
                                        </p>
                                    </div>
                                </div>
                            </html>';



            $mail->send();

            error_log('Mail enviado', 0);

            return 'Si';

        } catch (Exception $e) {

            error_log('Mail no enviado', 0);

            error_log($e->getMessage(), 0);

            return 'No';

        }
    }
    else{
        return 'NA';
    }
}

?>