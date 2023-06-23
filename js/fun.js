const setLoading = (condition, btn) => {
    //const btn = document.querySelector('#btn-donation');
    if(condition){
        let content = btn.innerHTML;
        btn.classList.add('opacity-70');
        btn.innerHTML = `<div class='animate-spin duration-75 ease-linear w-5 h-5 rounded-full border-4 border-x-white border-y-transparent mx-3'></div>${ content }`;
    }
    else{
        btn.removeChild(btn.firstElementChild);
        btn.classList.remove('opacity-70');
    }
    btn.disabled = condition;
};
let mxnMX = Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
});

const setCompanion = (idInput) => {
    let inputs = document.querySelectorAll('.companion');
    let radio = document.querySelector(`#${ idInput }`);
    
    if(!radio.checked)
        radio.checked = true;
    for(let i = 0; i < inputs.length; i++){
        let  input = inputs[i];
        let parent = input.parentElement;
        console.log(input);
        if(input.checked){
            parent.classList.add('bg-purple-exm', 'text-white');
            parent.classList.remove('bg-white', 'text-purple-exm');
        }
        else{
            parent.classList.add('bg-white', 'text-purple-exm');
            parent.classList.remove('bg-purple-exm', 'text-white');
        }
    }
};

const setDonate = (idInput) => {
    let inputs = document.querySelectorAll('.donate');
    let radio = document.querySelector(`#${ idInput }`);
    
    if(!radio.checked)
        radio.checked = true;
    for(let i = 0; i < inputs.length; i++){
        let  input = inputs[i];
        let parent = input.parentElement;
        if(input.checked){
            parent.classList.add('bg-purple-exm', 'text-white');
            parent.classList.remove('bg-white', 'text-purple-exm');
        }
        else{
            parent.classList.add('bg-white', 'text-purple-exm');
            parent.classList.remove('bg-purple-exm', 'text-white');
        }
    }
};

const getCompanion = () => {
    let inputs = document.querySelectorAll('.companion');
    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].checked)
            return inputs[i].value;
    }
    return '0';
};

const getWantDonate = () => {
    let inputs = document.querySelectorAll('.donate');
    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].checked)
            return inputs[i].value;
    }
    return '0';
};

document.addEventListener('DOMContentLoaded', async () => {
    const btn = document.querySelector('#btn-donation');
    const btnconfirm = document.querySelector('#btn-confirm');

    document.querySelector('#companionyes').addEventListener('click', () => {
        setCompanion('r-type');document.querySelector('#companion-name').classList.remove('hidden');
        console.log('Hey');
    });
    document.querySelector('#companionno').addEventListener('click', () => {
        setCompanion('o-type');document.querySelector('#companion-name').classList.add('hidden');
    });

    document.querySelector('#donateyes').addEventListener('click', () => {
        setDonate('check-d-yes');document.querySelector('#donation').classList.remove('hidden');
        document.querySelector('#confirm').classList.add('hidden');
    });
    document.querySelector('#donateno').addEventListener('click', () => {
        setDonate('check-d-no');document.querySelector('#donation').classList.add('hidden');
        document.querySelector('#confirm').classList.remove('hidden');
    });
    document.querySelector('#quantity').addEventListener('keyup', (evt) => {
        btn.innerHTML = `<div>Donar ${ mxnMX.format(evt.target.value) }</div>`;
    });


    const stripe = Stripe('pk_test_51MELVUCzlgXDvVNsrFZ8iU61swtVNWUWedal3FZihwoAEv0kbjx7qXVHROPrGHJ7PGorXTIEBCs9S0WPLTOQJkbi00BP9o5Zyd'); //ExM IAP
    const appearance = {
        theme: 'stripe',
        
        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
        }
    };
    
    var elements = stripe.elements({appearance});
    var cardElement = elements.create('card');
    cardElement.mount('#card-element');

    btnconfirm.addEventListener('click', () => {
        setLoading(true, btnconfirm);
        addMessage('');
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const organization = document.querySelector('#organization').value;
        const whoinvitedyou = document.querySelector('#whoinvitedyou').value;
        let companion = getCompanion();
        let companionname = companion === '1' ? document.querySelector('#companionname').value : '';
        let wantdonate = getWantDonate();
        let amount = wantdonate === '1' ? document.querySelector('#quantity').value : 0;
        let recurring = wantdonate === '1' ? document.querySelector('#recurrency').value : 0;
        
        let data = { name, email, organization, whoinvitedyou, companion, companionname, wantdonate, amount, recurring  };
        fetch('./back/checkout/confirm.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((r => {return r.json()}))
        .then(res => {
            // window.location.href = `./success.html?code=${identifier}`;
            console.log(res);
            setLoading(false, btnconfirm);
            addMessage(`${res.status === 1 ? '<div class="w-full rounded-sm border-2 border-green-500 bg-green-100 text-green-600 font-semibold p-1 text-center my-2">Registro realizado con éxito</div>' : '<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un problema, inténtalo más tarde</div>'}`);
        })
        .catch(e => {
            setLoading(false, btnconfirm);
            addMessage('<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un problema, inténtalo más tarde</div>');
        })

    })

    btn.addEventListener('click', async (e) => {
        setLoading(true, btn);
        addMessage('');
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const organization = document.querySelector('#organization').value;
        const whoinvitedyou = document.querySelector('#whoinvitedyou').value;
        let companion = getCompanion();
        let companionname = companion === '1' ? document.querySelector('#companionname').value : '';
        let wantdonate = getWantDonate();
        let amount = wantdonate === '1' ? document.querySelector('#quantity').value : 0;
        let recurring = wantdonate === '1' ? document.querySelector('#recurrency').value : 0;
        
        let data = { name, email, organization, whoinvitedyou, companion, companionname, wantdonate, amount, recurring  };

        // if(amount === 'oc'){ amount = document.querySelector('#i-oc').value }
        // if(amount === 0 || amount === '0' || name === '' || lastname === '' || email === '' || birthdate === '' || birthdate === null || type === '0'){
        //     addMessage('<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 text-sm font-semibold p-1 text-center my-2">Por favor, llena todos los campos</div>');
        //     setLoading(false);
        //     return;
        // };
        e.preventDefault();

        const {identifier, clientSecret} = await fetch('./back/checkout/create-payment-intent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((r => {return r.json()}))
        .catch(e => {
            console.error(e);
            addMessage('<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 text-sm font-semibold p-1 text-center my-2">Ocurrió un error, por favor revisa que tus datos sean correctos</div>');
            setLoading(false, btn);
        });

        //console.log(clientSecret);

        stripe.confirmCardPayment(
            clientSecret,{
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: name,
                        email: email,
                    }
                }
            }
        )
        .then(r => { 
            let key = Object.keys(r)[0];
            if(key === 'error'){
                addMessage(`<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un error. Error: ${r.error.message}</div>`);
                setLoading(false, btn);
                return;
            }
            else{
                let paymentIntent = r.paymentIntent;
                fetch('./back/checkout/confirmandsend.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(r => {
                    window.location.href = `./success.html?code=${identifier}`;
                })
                addMessage(`${paymentIntent.status === 'succeeded' ? '<div class="w-full rounded-sm border-2 border-green-500 bg-green-100 text-green-600 font-semibold p-1 text-center my-2">Donativo realizado con éxito</div>' : '<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un problema, inténtalo más tarde</div>'}`);
                if(paymentIntent.status !== 'succeeded'){setLoading(false, btn);}
            }
        })
        .catch(e => {
            addMessage(`<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un error. Ponte en contacto con odette@edupam.org</div>`);
            setLoading(false, btn);
            console.error(e);
        })
    })

});

const addMessage = (message) => {
    const messagesDiv = document.querySelector('#message');
    messagesDiv.style.display = 'block';
    messagesDiv.innerHTML = message;
};