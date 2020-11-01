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
            keysContainer: null,
            keyboardInput: null,
            clientInput: null,
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
   
        var container = elements.container = document.createElement('div'),
            keysContainer = elements.keysContainer = document.createElement('div');
        container.classList.add('keyboard');
        container.classList.add('keyboard--hidden');
        document.body.appendChild(container);
        keysContainer.classList.add('keyboard__keys');
        container.appendChild(keysContainer);

        var input = elements.keyboardInput = document.createElement('input');
        input.classList.add('keyboard__input');
        keysContainer.insertBefore(input, keysContainer.firstElementChild);
        keysContainer.appendChild(document.createElement('br'));

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
                            btn.addEventListener('click', function() {
                                elements.keyboardInput.value = elements.keyboardInput.value.slice(0, -1);
                            });
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
                            btn.addEventListener('click', done);
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
                            btn.addEventListener('click', function() {
                                elements.keyboardInput.value += ' ';
                            });
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
                btn.addEventListener('click', function() {
                    elements.keyboardInput.value += btn.textContent;
                });
            }

            // Add new row of keys
            if (isBreakLine) {
                keysContainer.appendChild(document.createElement('br'));
            }
        });
    };

    function updateKeyboardLiveInput(properties) {
        elements.keyboardInput.placeholder = properties.placeholder;
        elements.keyboardInput.value = properties.value;
    }

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

    function done() {
        elements.clientInput.value = elements.keyboardInput.value;
        elements.container.classList.add('keyboard--hidden');
    }

    function initEvents() {
        // Binding focus event on inputs, textareas
        document.querySelectorAll('input, textarea').forEach(function(input) {
            input.addEventListener('focus', function(e) {
                var input = e.target;
                if (input.readOnly) return;
                elements.container.classList.remove('keyboard--hidden');
                elements.clientInput = input;
                updateKeyboardLiveInput({
                    placeholder: input.placeholder,
                    value: input.value
                });
            });
        });
        // Keyboard toggling
        window.addEventListener('click', function(e) {
            if (['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) === -1
                && e.target.closest('.keyboard') !== elements.container) { // HIDE
                elements.container.classList.add('keyboard--hidden');
                done();
            }
        });
    }

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
            // Binding events
            initEvents();
        }
    };
};