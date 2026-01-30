# ChatVault - AI Chat Exporter

A browser extension that lets you export your chat conversations from popular AI chat apps to PDF format.

## Supported Platforms

- **ChatGPT** (chatgpt.com, chat.openai.com)
- **Claude** (claude.ai)
- **Google Gemini** (gemini.google.com)
- **Z.AI** (chat.z.ai)
- **DeepSeek** (chat.deepseek.com)
- **Kimi** (kimi.com)
- **Qwen** (chat.qwen.ai, tongyi.aliyun.com)

## Features

- Export chats to PDF with one click
- Light and dark mode PDF options
- Option to include AI thinking/reasoning sections
- Optional timestamps
- Clean, modern interface
- Preserves markdown formatting (code blocks, lists, etc.)
- Suported on Both Firefox and Chrome
- Renders Mermaid Diagrams and Math Equations

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `ChatVault` folder
5. The extension icon should appear in your toolbar

### Usage

1. Navigate to any supported AI chat platform
2. Open a conversation you want to export
3. Click the ChatVault extension icon
4. Configure your export options:
   - **Include timestamps**: Add time information to messages
   - **Include thinking**: Include AI reasoning/thinking sections (if available)
   - **Dark mode PDF**: Generate a dark-themed PDF
   - **Filename**: Customize the export filename
5. Click "Export to PDF"
6. A print dialog will open - select "Save as PDF" as your printer

## How It Works

The extension extracts chat messages directly from the page's DOM structure. Each AI platform uses different HTML structures, so the extension includes platform-specific extractors:

- **ChatGPT**: Uses `data-message-author-role` attributes
- **Claude**: Uses class-based selectors for human/assistant messages
- **Gemini**: Uses query/response container structure
- **Z.AI**: Uses user-message and chat-assistant classes
- **DeepSeek**: Uses ds-markdown for responses with specific user message containers
- **Kimi**: Uses chat-content-item containers with user/assistant variants
- **Qwen**: Uses qwen-chat-message containers with role-specific classes

## Privacy

- **No data collection**: All processing happens locally in your browser
- **No external servers**: Chat content never leaves your device
- **No tracking**: The extension doesn't collect any analytics

## Development

```
ChatVault-Chrome/
├── manifest.json          # Extension manifest
├── popup/
│   ├── popup.html        # Extension popup UI
│   ├── popup.css         # Popup styles
│   └── popup.js          # Main extension logic
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
```
```
ChatVault-Firefox/
├── manifest.json          # Extension manifest
├── popup/
│   ├── popup.html        # Extension popup UI
│   ├── popup.css         # Popup styles
│   └── popup.js          # Main extension logic
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
```

### Building for Firefox (XPI)

To create an XPI file for Firefox Add-on Store submission:

```bash
cd ChatVault-Firefox
zip -r ../chatvault-firefox.xpi *
```

### Building for Chrome (ZIP)

To create a ZIP file for Chrome Web Store submission:

```bash
cd ChatVault-Chrome
zip -r ../chatvault-chrome.zip *
```

This creates a `chatvault-chrome.zip` file in the parent directory that can be uploaded to the Chrome Web Store.


## Troubleshooting

### "No messages found"
- Make sure you have an active chat conversation open
- Try scrolling through the conversation to load all messages
- Refresh the page and try again

### Export button is disabled
- Ensure you're on a supported platform
- Check that the chat has loaded completely

### PDF is empty or incomplete
- Some platforms lazy-load messages - scroll through the entire conversation first
- Try disabling the "Include thinking" option if the AI platform doesn't support it

## Contributing

Feel free to submit issues and pull requests to improve the extension!

## License

MIT License - feel free to use and modify as needed.
