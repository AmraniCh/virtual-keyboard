var Keyboard = function (clientOptions) {
    if (clientOptions && typeof clientOptions !== 'object') {
        console.error('Keybaord accept an object of supprted keybaord options.')
    }

    var keys = {
            'fr': [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, {'8': "backspace"}],
                ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
                [{'20': "caps"}, "a", "s", "d", "f", "g", "h", "j", "k", "l", {'13': "enter"}],
                [{done: "done"}, "z", "x", "c", "v", "b", "n", "m", ",", ".", "?"],
                [{'32': "space"}]
            ],
        },
        supportedLanguages = Object.keys(keys), // TODO Object.keys es5
        options = {
            lang: 'fr',
            charsOnly: false,
            caps: false
        }, 
        elements = {
            container: null,
            keysContainer: null
        };

    if (clientOptions.lang && supportedLanguages.indexOf(clientOptions.lang) === -1) {
        console.error(lang + ' language is not supported!');
    }

    // TODO assign es5
    Object.assign(options, clientOptions);

    function renderUI(renderOptions) {
        var charsOnly = renderOptions.charsOnly,
            capsLock = renderOptions.caps,
            BACKSPACE = '8',
            CAPS_LOCK = '20',
            RETURN = '13',
            SPACE = '32';
   
        elements.container = container = document.createElement('div');
        container.classList.add('keyboard');
        document.body.appendChild(container);
        elements.keysContainer = keysContainer = document.createElement('div');
        keysContainer.classList.add('keyboard__keys');
        container.appendChild(keysContainer);

        operateOnKeys(function (key) {
            var isSpecialKey = typeof key === 'object',
                isBreakLine = arguments[arguments.length - 1];

            if (isSpecialKey) { // Handle special keys
                for (var p in key) {
                    switch (p) {
                        case BACKSPACE:
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.classList.add('keyboard__key');
                            btn.classList.add('keyboard__key--wide');
                            var icon = document.createElement('i');
                            icon.classList.add('icon');
                            icon.classList.add('material-icons');
                            icon.textContent = 'backspace';
                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);
                            break;
                        case CAPS_LOCK:
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.classList.add('keyboard__key');
                            btn.classList.add('keyboard__key--wide');
                            btn.classList.add('keyboard__key--activatable');
                            var icon = document.createElement('i');
                            icon.classList.add('icon');
                            icon.classList.add('material-icons');
                            icon.textContent = 'keyboard_capslock';
                            btn.appendChild(icon);
                            if (capsLock) {
                                btn.classList.add('keyboard__key--active');
                                toggleCapsLock();
                            }
                            keysContainer.appendChild(btn);
                            btn.addEventListener('click', function() {
                                options.caps = !options.caps;
                                this.classList.toggle('keyboard__key--active');
                                toggleCapsLock();
                            });
                            break;
                        case RETURN:
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.classList.add('keyboard__key');
                            btn.classList.add('keyboard__key--wide');
                            var icon = document.createElement('i');
                            icon.classList.add('icon');
                            icon.classList.add('material-icons');
                            icon.textContent = 'keyboard_return';
                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);
                            break;
                        case 'done':
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.classList.add('keyboard__key');
                            btn.classList.add('keyboard__key--wide');
                            btn.classList.add('keyboard__key--dark');
                            var icon = document.createElement('i');
                            icon.classList.add('icon');
                            icon.classList.add('material-icons');
                            icon.textContent = 'check_circle';
                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);
                            break;

                        case SPACE:
                            var btn = document.createElement('button');
                            btn.type = 'button';
                            btn.classList.add('keyboard__key');
                            btn.classList.add('keyboard__key--extra-wide');
                            var icon = document.createElement('i');
                            icon.classList.add('icon');
                            icon.classList.add('material-icons');
                            icon.textContent = 'space_bar';
                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);
                            break;
                    }
                }
            } else { // Regular keys
                // Handle charsOnly option
                if (charsOnly === true && typeof key === 'number') {
                    return;
                }
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.classList.add('keyboard__key');
                btn.textContent = key;
                keysContainer.appendChild(btn);
            }

            // Add new row of keys
            if (isBreakLine) {
                keysContainer.appendChild(document.createElement('br'));
            }
        });
    };

    function operateOnKeys(clb) {
        keys[options.lang].forEach(function (rowKeys, rowIndex) {
            rowKeys.forEach(function (key, keyIndex) {
                var isBreakLine = keyIndex === rowKeys.length - 1;
                clb.apply(this, [key, rowIndex, keyIndex, isBreakLine]);
            });
        });
    };

    function toggleCapsLock() {
        document.querySelectorAll('button.keyboard__key').forEach(function(key) {
            if (key.childElementCount === 0) {
                if (options.caps === true) {
                    key.textContent = key.textContent.toUpperCase();
                } else {
                    key.textContent = key.textContent.toLowerCase();
                }
            }
        });
    };   

    return {
        init: function () {
            // rendering keyboard HTML markup
            renderUI({
                charsOnly: options.charsOnly,
                caps: options.caps
            });
            // Apply caps lock if enabled
            if (options.caps) {
                toggleCapsLock();
            }
        }
    };
};