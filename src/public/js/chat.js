// Socket comunica con servidor
const socket = io();

let user;
let chatBox = document.getElementById('chatBox');
let messageLog = document.getElementById('messageLog');

Swal.fire({
    title: 'Identifícate',
    input: 'text',
    text: 'Ingresa al Chat',
    inputValidator: (value) => {
        if (!value) {
            return 'Necesitas escribir un nombre';
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false
}).then((result) => {
    if (result.isConfirmed) {
        user = result.value;
        socket.emit('authenticated', user);
    }
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user, message: chatBox.value });
            chatBox.value = '';
        }
    }
});

socket.on('showChats', data => {
    
    messageLog.innerHTML = '';

    data.forEach(chat => {
      // Crea un nuevo elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `
            <ul>
                ${chat.user} dice: ${chat.message}
            </ul>
        `;
        messageLog.appendChild(messageElement);
    });


})