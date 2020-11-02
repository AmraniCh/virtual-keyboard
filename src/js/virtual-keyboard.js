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

    var Helper = (function(selector) {

        if (!(this instanceof Helper)) {
            return new Helper(selector);
        }
        
        this.length = 0;

        if (typeof selector === 'string') {
            var self = this;
            var eles = document.querySelectorAll(selector);
            this.length = eles.length;
            eles.forEach(function(ele, i) {
                self[i] = ele;
            });
        }

        if (selector instanceof Node || selector === window) {
            this[0] = selector;
        }

        if (selector.constructor && selector.constructor.name === 'Array') {
                var arr = selector, 
                    i = arr.length - 1;
                while(i >= 0) {
                    this[i] = arr[i];
                    this.length++;
                    i--;
                }
        }

        Helper.prototype.length = 0;

        Helper.prototype.addClass = function(classes) {
            var self = this;
            classes.split(' ').forEach(function(cls) {
                self[0].classList.add(cls);
            });
            return this;
        };

        Helper.prototype.removeClass = function(classes) {
            var self = this;
            classes.split(' ').forEach(function(cls) {
                self[0].classList.remove(cls);
            });
            return this;
        };

        Helper.prototype.contains = function(classes) {
            return this[0].classList.contains(cls);
        };

        Helper.prototype.appendTo = function(appendTo) {
            document.querySelector(appendTo).appendChild(this[0]);
            return this;
        };

        Helper.prototype.get = function(index) {
            return this[0];
        };

        Helper.prototype.setAttribute = function(name, val) {
            this[0].setAttribute(name, val);
            return this;
        };

        Helper.prototype.text = function(text) {
            this[0].textContent = text;
            return this; 
        };

        Helper.prototype.on = function(event, handler) {
            this[0].addEventListener(event, handler);
            return this;
        };

        Helper.prototype.splice = Array.prototype.splice;
        Helper.prototype.each = Array.prototype.forEach;
    });

    Helper.create = function(tag) {
        var ele = document.createElement(tag);
        return Helper(ele);
    };

    function renderUI(renderOptions) {
        var charsOnly = renderOptions.charsOnly,
            capsLock = renderOptions.caps,
            BACKSPACE = '8',
            CAPS_LOCK = '20',
            RETURN = '13',
            SPACE = '32',
            container = elements.container = Helper
            .create('div')
            .addClass('keyboard keyboard--hidden')
            .appendTo('body')
            .get(0),
            keysContainer = elements.keysContainer = Helper
            .create('div')
            .addClass('keyboard__keys')
            .appendTo('.keyboard')
            .get(0),
            input = elements.keyboardInput = Helper
            .create('input')
            .addClass('keyboard__input')
            .get(0);

        keysContainer.insertBefore(input, keysContainer.firstElementChild);
        Helper.create('br').appendTo('.keyboard__keys');

        operateOnKeys(function (key) {
            var isSpecialKey = typeof key === 'object',
                isBreakLine = arguments[arguments.length - 1];

            if (isSpecialKey) { // Handle special keys
                for (var p in key) {
                    switch (p) {
                        case BACKSPACE:
                            var btn = Helper.create('button')
                                .addClass('keyboard__key keyboard__key--wide')
                                .setAttribute('type', 'button')
                                .get(0),
                                icon = Helper.create('i')
                                .addClass('icon material-icons')
                                .text('backspace')
                                .get(0);

                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);

                            Helper(btn).on('click', function() {
                                elements.keyboardInput.value = elements.keyboardInput.value.slice(0, -1);
                                elements.clientInput.value  = elements.clientInput.value.slice(0, -1);
                            });

                            break;
                        case CAPS_LOCK:
                            var btn = Helper.create('button')
                                .addClass('keyboard__key keyboard__key--wide keyboard__key--activatable')
                                .setAttribute('type', 'button')
                                .get(0),
                                icon = Helper.create('i')
                                .addClass('icon material-icons')
                                .text('keyboard_capslock')
                                .get(0);

                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);

                            if (capsLock) {
                                Helper(btn).addClass('keyboard__key--active');
                                toggleCapsLock();
                            }

                            Helper(btn).on('click', function() {
                                options.caps = !options.caps;
                                this.classList.toggle('keyboard__key--active');
                                toggleCapsLock();
                            });

                            break;
                        case RETURN:
                            var btn = Helper.create('button')
                                .addClass('keyboard__key keyboard__key--wide')
                                .setAttribute('type', 'button')
                                .get(0),
                                icon = Helper.create('i')
                                .addClass('icon material-icons')
                                .text('keyboard_return')
                                .get(0);

                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);
                            break;                
                        case 'done':
                            var btn = Helper.create('button')
                                .addClass('keyboard__key keyboard__key--wide keyboard__key--dark')
                                .setAttribute('type', 'button')
                                .get(0),
                                icon = Helper.create('i')
                                .addClass('icon material-icons')
                                .text('check_circle')
                                .get(0);

                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);

                            Helper(btn).on('click', done);
                            break;
                        case SPACE:
                            var btn = Helper.create('button')
                                .addClass('keyboard__key keyboard__key--extra-wide')
                                .setAttribute('type', 'button')
                                .get(0),
                                icon = Helper.create('i')
                                .addClass('icon material-icons')
                                .text('space_bar')
                                .get(0);

                            btn.appendChild(icon);
                            keysContainer.appendChild(btn);

                            Helper(btn).on('click', function() {
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

                var btn = Helper.create('button')
                    .addClass('keyboard__key')
                    .setAttribute('type', 'button')
                    .text(key)
                    .get(0);

                keysContainer.appendChild(btn);

                Helper(btn).on('click', function() {
                    elements.keyboardInput.value += btn.textContent;
                    elements.clientInput.value += btn.textContent;
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
        Helper(keys[options.lang]).each(function (rowKeys, rowIndex) {
            Helper(rowKeys).each(function (key, keyIndex) {
                var isBreakLine = keyIndex === rowKeys.length - 1;
                clb.apply(this, [key, rowIndex, keyIndex, isBreakLine]);
            });
        });
    };

    function toggleCapsLock() {
        Helper('button.keyboard__key').each(function(key) {
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
        Helper(elements.container).addClass('keyboard--hidden');
    }

    function initEvents() {
        // Binding focus event on inputs, textareas
        Helper('input:not(.keyboard__input), textarea').each(function(input) {
            Helper(input).on('focus', function(e) {
                var input = e.target;
                if (input.readOnly) return;
                Helper(elements.container).removeClass('keyboard--hidden');
                elements.clientInput = input;
                updateKeyboardLiveInput({
                    placeholder: input.placeholder,
                    value: input.value
                });
            });
        });

        // Hide the keyboard when clicking out of the keyboard view
        Helper(window).on('click', function(e) {
            if (!Helper(elements.container).contains('keyboard--hidden')) { 
                if (e.target !== elements.keyboardInput 
                    && ['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) === -1
                    && e.target.closest('.keyboard') !== elements.container) {
                        Helper(elements.container).addClass('keyboard--hidden');
                        done();
                }
            }
        });

        Helper('.keyboard__input').on('input', function() {
            elements.clientInput.value = this.value;
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