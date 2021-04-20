// const BASE_URL = `http://localhost:1648`;
const BASE_URL = `https://9e48627ce070.ngrok.io`;

sender = JSON.parse(he.decode(sender));
receiver = JSON.parse(he.decode(receiver));

const socket = io(BASE_URL, {
    query: {
        // receiver: JSON.stringify(receiver),
        receiver: receiver._id,
    }
});

const chatContainer = document.querySelector('#chat-container');
const messageTemplate = document.querySelector('#message-template').innerHTML;
// document.querySelector('#sender-receiver').remove();

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.querySelector('#chat-form');
    const chatInput = document.querySelector('#chat-input');

    let chat_data = {
        sender,
        receiver,
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = e.target.elements.message.value.trim();

        if (text === '') return false;

        chat_data = {
            ...chat_data,
            text,
        };

        sendMessage(chat_data);
        renderMessage(chat_data);
        chatForm.reset();
    });

    chatInput.addEventListener('keypress', () => {
        emitEvent('typing', chat_data, 'socket');
    })
});

//
socket.on('private_message', (data) => {
    renderMessage(data);
});

socket.on('active_users', (data) => {
    // console.log(data);
});

socket.on('typing', (data) => {
    // console.log(data);
    console.log(`${data.sender.username} is typing...`);
});

// render message when it is received or sent
function renderMessage(data) {
    const receiver_id = window.location.pathname.split('/')[2];

    // console.log(data);
    // console.log(data.receiver._id);
    // console.log(receiver_id);

    const alignment = data.receiver._id === receiver_id ? 'right chat-sender' : 'left chat-receiver';

    if (data.receiver._id === receiver_id || data.sender._id === receiver_id) {
        const html = Mustache.render(messageTemplate, {
            alignment,
            sender_name: data.sender.username,
            receiver_name: data.receiver.username,
            message: data.text,
            createdAt: moment(data.createdAt).format('HH:mm')
        });

        chatContainer.insertAdjacentHTML('beforeend', html);
    }
}

//
function sendMessage(data) {
    emitEvent('private_message', data, 'socket', (res) => {
        // console.log('-----------------------------------');
        // console.log('Message sent');
        // console.log(res);
        // console.log('-----------------------------------');
    });
}

//
function emitEvent(name, data, level, callback = null) {
    switch (level) {
        case 'io':
            level = io;
            break;
        case 'socket':
            level = socket;
            break;
        default:
            level = socket;
    }

    level.emit(name, data, callback);
}


