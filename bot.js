import { default as makeWASocket, DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';
import { Boom } from '@hapi/boom';
import { downloadHandler } from './handlers/download.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ensureDirectoryExists } from './utils/fileHelpers.js';
import { connectionConfig, reconnectOptions } from './config/connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        ...connectionConfig,
        auth: state
    });

    // Create downloads directory if it doesn't exist
    const downloadDir = join(__dirname, 'downloads');
    await ensureDirectoryExists(downloadDir);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            let shouldReconnect = false;
            
            if (lastDisconnect && lastDisconnect.error) {
                const statusCode = lastDisconnect.error.output?.statusCode;
                shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                console.log('Connection closed due to:', lastDisconnect.error);
            }

            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, reconnectOptions.delayMs);
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        
        if (!message.key.fromMe && message.message) {
            const chat = message.key.remoteJid;
            const messageText = message.message?.conversation || 
                              message.message?.extendedTextMessage?.text || '';

            if (messageText.startsWith('!download')) {
                await downloadHandler(sock, chat, messageText);
            }
        }
    });
}

connectToWhatsApp();
