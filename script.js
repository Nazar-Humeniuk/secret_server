(function () {
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

    function init() {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



