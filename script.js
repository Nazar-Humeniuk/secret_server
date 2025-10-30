//--- LOGIN MECHANISM ---//
const password = "agent007"; // You can change this safely

let terminalInitialized = false;

const overlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const loginPass = document.getElementById("login-password");
const loginMsg = document.getElementById("login-message");
const terminalDiv = document.getElementById("terminal");

// If login required, hide terminal and focus overlay
terminalDiv.style.display = "none";
overlay.classList.remove("hide");
loginPass.focus();
if (loginForm) {
    loginForm.addEventListener("submit", function(evt) {
        evt.preventDefault();
        if (loginPass.value === password) {
            // Success
            overlay.classList.add("hide");
            terminalDiv.style.display = "flex";
            if (!terminalInitialized) {
               setTimeout(init,0); // defer to allow DOM update
               terminalInitialized = true;
            }
        } else {
            loginMsg.textContent = "Access denied. Try again.";
            loginPass.value = "";
            loginPass.focus();
        }
    });
    // allow Enter to always focus pass input
    overlay.addEventListener('keydown', e=>{
        if (e.key==='Enter' && document.activeElement !== loginPass) {
            loginPass.focus();
            e.preventDefault();
        }
    });
}

function init() {
    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('command-input');
    // In-memory filesystem
    // Secret agent briefing
    const readmeContent = [
        "\\ Agent Briefing //",
        "",
        "Agent, on this server there are files that are encrypted.",
        "You need to decrypt them and find the truth...",
        "Begin with: secret.txt",
        "",
        "Your first mission: decode the encrypted file. The answers await.",
        "---"
    ].join("\n");
    // Caesar cipher shift 3: "The password is 'trustno1'. Proceed to unravel the mystery."
    // Encrypted: "Wkh sdvvzrug lv 'wuxvwqr1'. Surghhg wr xqudyho wkh pbvwhub."
    const secretFileContent = "Wkh sdvvzrug lv 'wuxvwqr1'. Surgghg wr xqudyho wkh pbvwhub.";
    // In-memory files
    const files = {
        "README.md": readmeContent,
        "about": "This directory is empty.",
        "projects": "This directory is empty.",
        "contact.txt": "contact@agency.example",
        "resume.pdf": "Encrypted PDF. Access denied.",
        "secret.txt": secretFileContent
    };
    // Directory listing
    const fakeEntries = Object.keys(files);
    function appendLine(text, className) {
        const div = document.createElement('div');
        div.className = `line${className ? ' ' + className : ''}`;
        div.textContent = text;
        outputEl.appendChild(div);
    }
    function scrollToBottom() {
        outputEl.scrollTop = outputEl.scrollHeight;
    }
    function handleCommand(raw) {
        const command = raw.trim();
        // Echo the command the user typed
        appendLine(`$ ${command}`, 'cmd');
        if (command === '') {
            // nothing
            return;
        }
        // Parse command
        if (command === 'ls') {
            appendLine(fakeEntries.join('  '));
        } else if (command === 'clear') {
            outputEl.innerHTML = '';
        } else if (command === 'help') {
            appendLine('Available commands: ls, clear, help, cat, less');
        } else if (/^(cat|less)\s+(.+)/.test(command)) {
            // Extract filename
            const match = command.match(/^(cat|less)\s+(.+)/);
            const fname = match[2].trim();
            if (files[fname]) {
                appendLine(files[fname]);
            } else {
                appendLine(`cat: ${fname}: No such file`, 'error');
            }
        } else {
            appendLine(`command not found: ${command}`, 'error');
        }
    }
    // Seed with a welcome line
    appendLine('Welcome to the web terminal. Type "help" to begin.');
    scrollToBottom();
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = inputEl.value;
            inputEl.value = '';
            handleCommand(value);
            scrollToBottom();
        }
    });
    // Autofocus behavior
    const focusTerminal = function () { inputEl.focus(); };
    window.addEventListener('click', focusTerminal);
    window.addEventListener('touchstart', focusTerminal, { passive: true });
    inputEl.focus();
}



