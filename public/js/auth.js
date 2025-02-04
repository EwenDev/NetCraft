document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submitbtn').click();
    }
});

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    }).then((res) => {
        if(res.ok) {
            window.location.href = '/';
        } else if(!res.ok) {
            alertMsg("Nom d'utilisateur ou mot de passe incorrect");
        }
    })
}

function signup() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('confirmPassword').value;
    let email = document.getElementById('email').value;

    if(password !== password2) {
        alertMsg('Les mots de passe ne correspondent pas');
        return;
    }

    fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password, email: email }),
    }).then((res) => {
        if(res.ok) {
            window.location.href = '/login';
        } else if (res.status === 401) {
            alertMsg('Username ou email déjà utilisé');
        } else {
            alertMsg('Erreur lors de la création du compte');
        }
    })
}

function alertMsg(message) {
    let spanalert = document.getElementById('alertspan');
    spanalert.textContent = message;
    let alert = document.getElementById('alertdiv');
    alert.removeAttribute('hidden');
    setTimeout(() => {
        alert.setAttribute('hidden', 'true');
    }, 3000);
}

