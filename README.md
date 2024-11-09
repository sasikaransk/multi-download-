# WhatsApp Multi-Download Bot

A WhatsApp bot that allows downloading multiple files from URLs and sending them back through WhatsApp.

## Features

- Download multiple files from URLs
- Automatic file type detection
- Progress updates during download
- Error handling for failed downloads

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the bot:
   ```bash
   npm start
   ```
4. Scan the QR code with WhatsApp

## Usage

Send a message in this format:
```
!download
https://example.com/file1.pdf
https://example.com/file2.jpg
```

## Dependencies

- @adiwajshing/baileys
- qrcode-terminal
- pino
- axios

## License

MIT