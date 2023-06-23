<?php
    require_once('../vendor/autoload.php');
    $stripe = new \Stripe\StripeClient('sk_test_51MELVUCzlgXDvVNsnzVFS6NoAMpOzXtaUv0WcM5N6fmoavC6Bq0pGnkIB7I5VzbkrWzZCZKPXgQQ1pmtGhL5DNnF00hjDXMxVF'); //ExM IAP

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

    if($recurring === '1'){
        try{
            $intent = $stripe->paymentIntents->create(
                ['amount' => $amount * 100, 'currency' => 'mxn', 'payment_method_types' => ['card']]
            );
            $identifier = MD5($intent->client_secret);
        }
        catch(Exception $e){
            $error = $e->getMessage();
        }
        if(empty($error) && $intent){
            $response = ['identifier' => $identifier, 'clientSecret' => $intent->client_secret];
        }
        else{
            $response = ['status' => 0, 'error' => $error];
        }
        echo json_encode($response);
    }
    else{ //Recurrente
        try{
            $customer = $stripe->customers->create([
                'name' => $name,
                'email' => $email
            ]);
        }
        catch(Exception $e){
            $error = $e->getMessage();
        }
        if(empty($error) && $customer){
            try{
                $price = $stripe->prices->create([
                    'unit_amount' => $amount * 100,
                    'currency' => 'mxn',
                    'recurring' => ['interval' => 'month', 'interval_count'=> $recurring],
                    'product_data' => ['name' => 'Donativo recurrente de '.$name]
                ]);
            }
            catch(Exception $e){
                $error = $e->getMessage();
            }

            if(empty($error) && $price){
                try{
                    $subscription = $stripe->subscriptions->create([
                        'customer' => $customer->id,
                        'items' => [
                            ['price' => $price->id],
                        ],
                        'payment_behavior' => 'default_incomplete',
                        'expand' => ['latest_invoice.payment_intent']
                    ]);
                }
                catch(Exception $e){
                    $error = $e->getMessage();
                }

                if(empty($error) && $subscription){
                    $identifier = MD5($subscription->id);
                    $response = ['identifier' => $identifier, 'subscription' => $subscription->id, 'clientSecret' => $subscription->latest_invoice->payment_intent->client_secret, 'customer' => $customer->id];
                }
                else{
                    $response = ['status' => 0, 'error' => $error];
                }
            }
        }
        
        echo json_encode($response);
    }

?>