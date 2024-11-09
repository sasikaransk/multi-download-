import axios from 'axios';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { saveFile, getFileNameFromUrl } from '../utils/fileHelpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function downloadHandler(sock, chat, messageText) {
    const urls = messageText.split('\n').slice(1).filter(url => url.trim());
    
    if (urls.length === 0) {
        await sock.sendMessage(chat, { 
            text: `*Usage:*\n!download\nURL1\nURL2\n...\n\nExample:\n!download\nhttps://example.com/file1.pdf\nhttps://example.com/file2.jpg` 
        });
        return;
    }

    await sock.sendMessage(chat, { text: `📥 Starting download of ${urls.length} file(s)...` });

    for (const [index, url] of urls.entries()) {
        try {
            const response = await axios({
                method: 'GET',
                url: url.trim(),
                responseType: 'arraybuffer'
            });

            const fileName = getFileNameFromUrl(url, index);
            const filePath = join(__dirname, '..', 'downloads', fileName);

            await saveFile(filePath, response.data);

            await sock.sendMessage(chat, {
                document: { url: filePath },
                fileName,
                mimetype: response.headers['content-type']
            });

        } catch (error) {
            await sock.sendMessage(chat, { 
                text: `❌ Failed to download: ${url}\nError: ${error.message}` 
            });
        }
    }

    await sock.sendMessage(chat, { 
        text: `✅ Download process completed!` 
    });
}