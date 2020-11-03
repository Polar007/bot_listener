const client = new Discord.Client();
const {prefix, token, help, transmit, recieve, end} = require('./config.json');

client.once('ready', () => {
    console.log('Ready!');
});

let transmitting = false;
let t_channel;
let recieving = false;
let r_channel;
let t_connection;
let r_connection;
let sender;
let audio;

client.on('message', message => {
    // Take command input
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    switch (command) {
        case `${help}`:
            message.channel.send(`Commands: ${transmit}, ${recieve}, ${end}`);
            break
        case `${transmit}`:
            message.channel.send('Transmitting');
            transmitting = true;
            t_channel = message.member.voice.channel;
            sender = message.author;
            break;
        case `${recieve}`:
            message.channel.send('Receiving');
            recieving = true;
            r_channel = message.member.voice.channel;
            break;
        case `${end}`:
            message.channel.send('Ending');
            transmitting = false;
            recieving = false;
            end_broadcast();
            break;
    }

    if (transmitting && recieving) {
        broadcast();
    }
});

async function broadcast() {
    t_connection = await t_channel.join();
    r_connection = await r_channel.join();
    audio = t_connection.receiver.createStream(sender);
    r_connection.play(audio, { type: 'opus' });
    console.log("Working!");
}

async function end_broadcast() {
    audio.destroy();
    r_channel.leave();
    t_connection.disconnect;
    r_connection.disconnect;
}

client.login(token);
