const passField = document.getElementById('password');
const lockOpen = document.getElementById('lock-open');
const lockClose = document.getElementById('lock-close');

lockOpen.addEventListener('click', togglePasswordVisibility);
lockClose.addEventListener('click', togglePasswordVisibility);


function togglePasswordVisibility() {
    if (passField.getAttribute('type') === 'password') {
        passField.setAttribute('type', 'text');
        lockOpen.style.display = 'block';
        lockClose.style.display = 'none';
    } else {
        passField.setAttribute('type', 'password');
        lockOpen.style.display = 'none';
        lockClose.style.display = 'block';
    }
}