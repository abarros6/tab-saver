# Tab Saver

A lightweight Chrome extension that lets you capture, save, and restore your browsing sessions. Stop losing track of important tabs — save a snapshot of your current window and reopen everything with a single click.

## What It Does

Tab Saver gives you four core actions for the tabs currently open in your window:

- **Fetch tabs** — scan your current window and display all open tabs (title + URL)
- **Copy** — copy the full tab list to your clipboard as plain text
- **Download** — save the tab list as a `.txt` file
- **Save session** — store the session by name in Chrome's local storage so you can reopen it later

Saved sessions appear below the controls. Each session has an **Open** button (reopens all tabs in a new window) and a **Delete** button to remove it.

---

## Installation

Tab Saver is not published on the Chrome Web Store. Install it as an unpacked extension in developer mode:

### 1. Download the source

Clone the repo or download and unzip it:

```bash
git clone https://github.com/abarros6/tab-saver.git

### 2. Open Chrome Extensions

Open a new tab and navigate to:

```
chrome://extensions
```

### 3. Enable Developer Mode

In the top-right corner of the Extensions page, toggle on **Developer mode**.

### 4. Load the extension

Click **Load unpacked**, then select the `tab-saver` folder (the one that contains `manifest.json`).

The Tab Saver icon will appear in your Chrome toolbar. You may need to pin it by clicking the puzzle piece icon and pinning Tab Saver.

---

## How to Use

1. Click the **Tab Saver** icon in the Chrome toolbar to open the popup.
2. Your current tabs load automatically. Click **Fetch tabs** to refresh the list at any time.
3. Choose what to do with your tabs:
   - **Copy** — paste the list anywhere (notes app, email, etc.)
   - **Download** — saves a timestamped `.txt` file to your downloads folder
   - **Save session** — prompts you for a name, then stores the session locally
4. Saved sessions appear in the **Saved Sessions** section. Click **Open** to reopen all tabs in a new window, or **Delete** to remove the session.

---

## Permissions

| Permission | Why it's needed |
|---|---|
| `tabs` | Read the titles and URLs of your open tabs |
| `storage` | Save and retrieve named sessions locally on your device |

No data ever leaves your device.

---

## Project Structure

```
tab-saver/
├── manifest.json   # Extension configuration
├── popup.html      # Extension popup UI
├── popup.js        # All extension logic
├── style.css       # Popup styles
└── icons/          # Extension icons (16, 32, 48, 128px)
```
