// Lógica para el formulario de solicitud de restablecimiento de contraseña
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.email.value;
    fetch('/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(response => response.json()).then(data => {
      // Maneja la respuesta del servidor
      // ...
    });
    });
    
  // Lógica para el formulario de restablecimiento de contraseña
    document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = this.newPassword.value;
    const token = window.location.pathname.split('/').pop();
    fetch(`/resetPassword/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
    }).then(response => response.json()).then(data => {
      // Maneja la respuesta del servidor
      // ...
    });
});