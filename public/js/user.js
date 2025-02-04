document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
});

function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\\/g, "&#92;")
}

function unescapeHTML(str) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'")
        .replace(/&#92;/g, "\\");
}

function fetchUserData() {
    fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('NomUtilisateur').textContent = data.username;
                document.getElementById('Role').textContent = data.role === 'admin' ? 'Administrateur' : 'Utilisateur';
                document.getElementById('Email').textContent = data.email;

                const roleBasedButton = document.getElementById('roleBasedButton');
                const changePasswdButton = document.querySelector('button[onclick="changePasswd.showModal()"]');
                if (data.role === 'admin') {
                    roleBasedButton.textContent = 'Gérer les utilisateurs';
                    roleBasedButton.setAttribute('onclick', 'gestionUsers.showModal(); fetchAllUsers();');
                    changePasswdButton.style.display = 'none';
                } else {
                    roleBasedButton.textContent = 'Supprimer le compte';
                    roleBasedButton.setAttribute('onclick', 'deleteUserModal()');
                    changePasswdButton.style.display = 'block';
                }
            } else {
                alertMsg('Erreur lors de la récupération des informations utilisateur');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
            alertMsg('Erreur lors de la récupération des informations utilisateur');
        });
}

function fetchAllUsers() {
    fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(users => {
            const usersTableBody = document.querySelector('#usersTable tbody');
            usersTableBody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>
                    <div class="flex items-center gap-3">
                        <div class="avatar">
                            <div class="rounded-full h-12 w-12">
                                <img src="/res/user-200.png" alt="Avatar" />
                            </div>
                        </div>
                        <div>
                            <div class="font-bold">${escapeHTML(user.username)}</div>
                        </div>
                    </div>
                </td>
                <td>${user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</td>
                <td>${escapeHTML(user.email)}</td>
                <td>
                    <button class="btn btn-error" onclick="deleteUser('${btoa(user.username)}')" ${user.role === 'admin' ? 'disabled' : ''}>
                        <span class="material-icons-outlined">delete</span>
                        <span>Supprimer</span>
                    </button>
                </td>
            `;
                usersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            alertMsg('Erreur lors de la récupération des utilisateurs');
        });
}

function deleteUserModal() {
    const deleteModal = document.getElementById('suppressionCompte');
    const deleteButton = deleteModal.querySelector('.confirm-delete');
    const modalMessage = deleteModal.querySelector('.modal-message');

    modalMessage.textContent = 'Voulez-vous vraiment supprimer votre compte ?';
    deleteModal.showModal();

    deleteButton.onclick = () => {
        fetch('/api/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alertMsg('Erreur lors de la suppression du compte');
                }
                deleteModal.close();
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du compte:', error);
                alertMsg('Erreur lors de la suppression du compte');
                deleteModal.close();
            });
    }
}

function deleteUser(username) {
    username = atob(username);
    const deleteModal = document.getElementById('deleteUserModal');
    const deleteButton = deleteModal.querySelector('.confirm-delete');
    const modalMessage = deleteModal.querySelector('.modal-message');

    modalMessage.textContent = `Voulez-vous vraiment supprimer l'utilisateur ${decodeURIComponent(username)} ?`;
    deleteModal.showModal();

    deleteButton.onclick = () => {
        // Encodage du nom d'utilisateur
        const encodedUsername = encodeURIComponent(username);

        fetch(`/api/user?username=${encodedUsername}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    fetchAllUsers();
                } else {
                    alertMsg(`Erreur lors de la suppression de l'utilisateur ${decodeURIComponent(username)}`);
                }
                deleteModal.close();
            })
            .catch(error => {
                console.error(`Erreur lors de la suppression de l'utilisateur ${decodeURIComponent(username)}:`, error);
                alertMsg(`Erreur lors de la suppression de l'utilisateur ${decodeURIComponent(username)}`);
                deleteModal.close();
            });
    };
}

function changePassword() {
    const oldPassword = document.getElementById('OldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alertMsg('Les mots de passe ne correspondent pas');
        return;
    }

    fetch("/api/user", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"oldpassword": oldPassword, "password": newPassword}),
    })
        .then(response => {
            if (response.ok) {
                alertMsg('Mot de passe modifié avec succès');
                document.getElementById('OldPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                succesMsg('Mot de passe modifié avec succès');
            } else {
                alertMsg('Erreur lors de la modification du mot de passe');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la modification du mot de passe:', error);
            alertMsg('Erreur lors de la modification du mot de passe');
        });
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

function succesMsg(message) {
    let spanalert = document.getElementById('successspan');
    spanalert.textContent = message;
    let alert = document.getElementById('successdiv');
    alert.removeAttribute('hidden');
    setTimeout(() => {
        alert.setAttribute('hidden', 'true');
    }, 3000);
}