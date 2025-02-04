document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    if(passwordInput){
        const togglePasswordButton = document.getElementById('togglePassword');
        const eyeIcon = document.getElementById('eyeIcon');

        togglePasswordButton.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.textContent = 'visibility_off';
            } else {
                passwordInput.type = 'password';
                eyeIcon.textContent = 'visibility';
            }
        });
    }

    const oldPasswordInput = document.getElementById('OldPassword');
    if(oldPasswordInput){
        const toggleOldPasswordButton = document.getElementById('toggleOldPassword');
        const oldEyeIcon = document.getElementById('OldEyeIcon');

        toggleOldPasswordButton.addEventListener('click', () => {
            if (oldPasswordInput.type === 'password') {
                oldPasswordInput.type = 'text';
                oldEyeIcon.textContent = 'visibility_off';
            } else {
                oldPasswordInput.type = 'password';
                oldEyeIcon.textContent = 'visibility';
            }
        });
    }

    const newPasswordInput = document.getElementById('newPassword');
    if(newPasswordInput){
        const toggleNewPasswordButton = document.getElementById('toggleNewPassword');
        const newEyeIcon = document.getElementById('newEyeIcon');

        toggleNewPasswordButton.addEventListener('click', () => {
            if (newPasswordInput.type === 'password') {
                newPasswordInput.type = 'text';
                newEyeIcon.textContent = 'visibility_off';
            } else {
                newPasswordInput.type = 'password';
                newEyeIcon.textContent = 'visibility';
            }
        });
    }

    const confirmPasswordInput = document.getElementById('confirmPassword');
    if(confirmPasswordInput){
        const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');
        const confirmEyeIcon = document.getElementById('confimEyeIcon');

        toggleConfirmPasswordButton.addEventListener('click', () => {
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                confirmEyeIcon.textContent = 'visibility_off';
            } else {
                confirmPasswordInput.type = 'password';
                confirmEyeIcon.textContent = 'visibility';
            }
        });
    }

    const supprPasswordInput = document.getElementById('supprPassword');

    if(supprPasswordInput){
        const toggleSupprPasswordButton = document.getElementById('toggleSupprPassword');
        const supprEyeIcon = document.getElementById('confimEyeIcon2');

        toggleSupprPasswordButton.addEventListener('click', () => {
            if (supprPasswordInput.type === 'password') {
                supprPasswordInput.type = 'text';
                supprEyeIcon.textContent = 'visibility_off';
            } else {
                supprPasswordInput.type = 'password';
                supprEyeIcon.textContent = 'visibility';
            }
        });
    }
});