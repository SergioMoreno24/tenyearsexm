const setLoading = (condition) => {
    const btn = document.querySelector('#btn-donation');
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

const setType = (idInput) => {
    let inputs = document.querySelectorAll('.i-type');
    let radio = document.querySelector(`#${ idInput }`);
    
    if(!radio.checked)
        radio.checked = true;
    for(let i = 0; i < inputs.length; i++){
        let  input = inputs[i];
        let parent = input.parentElement;
        let img = parent.firstElementChild.firstElementChild;
        if(input.checked){
            parent.classList.add('bg-orange-400', 'text-white');
            parent.classList.remove('bg-white', 'text-blue-edupam');
            img.classList.remove('hidden');
        }
        else{
            parent.classList.add('bg-white', 'text-blue-edupam');
            parent.classList.remove('bg-orange-400', 'text-white');
            img.classList.add('hidden');
        }
    }
};

const getType = () => {
    let inputs = document.querySelectorAll('.i-type');
    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].checked)
            return inputs[i].value;
    }
    return '0';
};


document.addEventListener('DOMContentLoaded', async () => {
    let index = 0;
    setInterval(() => {
        let slides = document.querySelectorAll('.slide');
        if(index >= slides.length)
            index = 0;
        for(let s = 0; s < slides.length; s++){
            slides[s].style.display = 'none';
        }
        slides[index].style.display = 'block';
        index += 1;
    }, 5000);

    const btn = document.querySelector('#btn-donation');
    document.querySelector('#dr-type').addEventListener('click', () => {
        setType('r-type', 'r-check')
    });
    document.querySelector('#do-type').addEventListener('click', () => {
        setType('o-type', 'o-check')
    });
    document.querySelector('#quantity').addEventListener('keyup', (evt) => {
        btn.innerHTML = `<div>Donar ${ mxnMX.format(evt.target.value) }</div>`;
    });

    const stripe = Stripe('pk_test_51J38fzCQqWuGrR89XIddKIcwVtKX1CwjTAOzaSqXAbw9QDmHlSSQxsrkxez2vGvssU6kwNLF4fMwfeGP1GGmrOTz00yQmYZ08w'); //S
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


    btn.addEventListener('click', async (e) => {
        setLoading(true);
        addMessage('');
        const name = document.querySelector('#name').value;
        const lastname = document.querySelector('#lastname').value;
        const email = document.querySelector('#email').value;
        let amount = document.querySelector('#quantity').value;
        let birthdate = document.querySelector('#birthdate').value;

        let type = getType();
        
        if(amount === 'oc'){ amount = document.querySelector('#i-oc').value }
        if(amount === 0 || amount === '0' || name === '' || lastname === '' || email === '' || birthdate === '' || birthdate === null || type === '0'){
            addMessage('<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 text-sm font-semibold p-1 text-center my-2">Por favor, llena todos los campos</div>');
            setLoading(false);
            return;
        };
        e.preventDefault();

        const {identifier, clientSecret} = await fetch('./back/checkout/create-payment-intent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentMethodType: 'card',
                currency: 'mxn',
                amount,
                name,
                lastname,
                email,
                birthdate,
                type,
            })
        })
        .then((r => {return r.json()}))
        .catch(e => {
            console.error(e);
            addMessage('<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 text-sm font-semibold p-1 text-center my-2">Ocurrió un error, por favor revisa que tus datos sean correctos</div>');
            setLoading(false);
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
                setLoading(false);
                return;
            }
            else{
                let paymentIntent = r.paymentIntent;
                fetch('./back/checkout/confirmandsend.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount,
                        name,
                        lastname,
                        email,
                        birthdate,
                        type,
                        identifier
                    })
                })
                .then(r => {
                    window.location.href = `./success.html?code=${identifier}`;
                })
                addMessage(`${paymentIntent.status === 'succeeded' ? '<div class="w-full rounded-sm border-2 border-green-500 bg-green-100 text-green-600 font-semibold p-1 text-center my-2">Donativo realizado con éxito</div>' : '<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un problema, inténtalo más tarde</div>'}`);
                if(paymentIntent.status !== 'succeeded'){setLoading(false);}
            }
        })
        .catch(e => {
            addMessage(`<div class="w-full rounded-sm border-2 border-red-500 bg-red-100 text-red-600 font-semibold p-1 text-center my-2">Ocurrió un error. Ponte en contacto con odette@edupam.org</div>`);
            setLoading(false);
            console.error(e);
        })
    })
});

const addMessage = (message) => {
    const messagesDiv = document.querySelector('#message');
    messagesDiv.style.display = 'block';
    messagesDiv.innerHTML = message;
};