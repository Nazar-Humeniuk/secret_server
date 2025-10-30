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
    // In-memory fake filesystem for `ls`
    const fakeEntries = [
        'README.md',
        'about',
        'projects',
        'contact.txt',
        'resume.pdf'
    ];
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
        switch (command) {
            case 'ls': {
                appendLine(fakeEntries.join('  '));
                break;
            }
            case 'clear': {
                outputEl.innerHTML = '';
                break;
            }
            case 'help': {
                appendLine('Available commands: ls, clear, help');
                break;
            }
            default: {
                appendLine(`command not found: ${command}`, 'error');
            }
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



