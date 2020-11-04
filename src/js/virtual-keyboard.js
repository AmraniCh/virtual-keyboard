var Keyboard = function (clientOptions) {
    if (clientOptions && typeof clientOptions !== 'object') {
        console.error('Keybaord accept an object of supprted keybaord options.')
    }

    var keys = {
            'fr': [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "x8"],
                ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$", "*"],
                ["x20", "a", "s", "d", "f", "g", "h", "j", "k", "l", "m", "x13"],
                ["xdone", "z", "x", "c", "v", "b", "n", ",", ";", ":", "!"],
                ["xlang", "x32"]
            ],
            'ar': [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "x8"],
                ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح"],
                ["x20", "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "x13"],
                ["xdone", "ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", ",", ".", "?"],
                ["xlang", "x32"]
            ]
        },
        supportedLanguages = Object.keys(keys), // TODO Object.keys es5
        rtlLanguages = ['ar'],
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
        },
        BACKSPACE = 'x8',
        CAPS_LOCK = 'x20',
        RETURN = 'x13',
        SPACE = 'x32',
        LANG = 'xlang',
        DONE = 'xdone';

    if (clientOptions.lang && supportedLanguages.indexOf(clientOptions.lang) === -1) {
        console.error(lang + ' language is not supported!');
    }

    // TODO assign es5
    Object.assign(options, clientOptions);

    var Helper = (function (selector) {

        if (!(this instanceof Helper)) {
            return new Helper(selector);
        }

        this.length = 0;

        if (typeof selector === 'string') {
            var self = this;
            var eles = document.querySelectorAll(selector);
            this.length = eles.length;
            eles.forEach(function (ele, i) {
                self[i] = ele;
            });
        }

        if (selector instanceof Node || selector === window) {
            this[0] = selector;
        }

        if (selector.constructor && selector.constructor.name === 'Array') {
            var arr = selector,
                i = arr.length - 1;
            while (i >= 0) {
                this[i] = arr[i];
                this.length++;
                i--;
            }
        }

        Helper.prototype.length = 0;

        Helper.prototype.addClass = function (classes) {
            var self = this;
            classes.split(' ').forEach(function (cls) {
                self[0].classList.add(cls);
            });
            return this;
        };

        Helper.prototype.removeClass = function (classes) {
            var self = this;
            classes.split(' ').forEach(function (cls) {
                self[0].classList.remove(cls);
            });
            return this;
        };

        Helper.prototype.toggle = function (cls) {
            return this[0].classList.toggle(cls);
        };

        Helper.prototype.contains = function (cls) {
            return this[0].classList.contains(cls);
        };

        Helper.prototype.appendTo = function (appendTo) {
            document.querySelector(appendTo).appendChild(this[0]);
            return this;
        };

        Helper.prototype.get = function (index) {
            return this[0];
        };

        Helper.prototype.setAttribute = function (name, val) {
            this[0].setAttribute(name, val);
            return this;
        };

        Helper.prototype.text = function (text) {
            this[0].textContent = text;
            return this;
        };

        Helper.prototype.on = function (event, handler) {
            this[0].addEventListener(event, handler);
            return this;
        };

        Helper.prototype.splice = Array.prototype.splice;
        Helper.prototype.each = Array.prototype.forEach;
    });

    Helper.create = function (tag) {
        var ele = document.createElement(tag);
        return Helper(ele);
    };

    function renderUI(renderOptions) {
        var charsOnly = renderOptions.charsOnly,
            capsLock = renderOptions.caps,
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

        operateOnKeys(options.lang, function (key) {

            if (isSpecialKey(key)) { // Handle special keys
                switch (key) {
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

                        Helper(btn).on('click', function () {
                            elements.keyboardInput.value = elements.keyboardInput.value.slice(0, -1);
                            elements.clientInput.value = elements.clientInput.value.slice(0, -1);
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

                        Helper(btn).on('click', function () {
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
                    case DONE:
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
                    case LANG:
                        var btn = Helper.create('button')
                            .addClass('keyboard__key keyboard__key--wide keyboard__key--dark keyboard__langauge__dropdown')
                            .setAttribute('type', 'button')
                            .get(0),
                            icon = Helper.create('i')
                            .addClass('icon material-icons')
                            .text('language')
                            .get(0);

                        btn.appendChild(icon);
                        keysContainer.appendChild(btn);

                        var list = Helper.create('ul')
                            .addClass('languages__list')
                            .get(0);

                        var items = [];
                        for (var i = 0; i < supportedLanguages.length; i++) {
                            var lang = supportedLanguages[i];
                            var li = Helper.create('li')
                                .addClass('language__item')
                                .setAttribute('data-lang', lang)
                                .text(lang)
                                .get(0);
                            list.appendChild(li);
                            items.push(li);
                        }

                        btn.appendChild(list);

                        // Toggle the language list 
                        Helper(btn).on('click', function () {
                            Helper(list).toggle('show');
                        });

                        // Binding click event on each langauge list item
                        Helper(items).each(function (item) {
                            Helper(item).on('click', function (e) {
                                e.stopPropagation(); // Stop event bubbling to the dropdown button
                                changeLangauge(this.dataset.lang);
                                Helper(list).removeClass('show');
                            });
                        });
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

                        Helper(btn).on('click', function () {
                            elements.keyboardInput.value += ' ';
                            elements.clientInput.value += ' ';
                        });
                        break;
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

                Helper(btn).on('click', function () {
                    Helper(elements.keyboardInput)
                        .setAttribute('dir', rtlLanguages.indexOf(options.lang) !== -1 ? 'rtl' : 'ltr');
                    elements.keyboardInput.value += btn.textContent;
                    elements.clientInput.value += btn.textContent;
                });
            }

            // Add new row of keys
            var isBreakLine = arguments[arguments.length - 1];
            if (isBreakLine) {
                keysContainer.appendChild(document.createElement('br'));
            }
        });
    };

    function initKeyboardInput(properties) {
        elements.keyboardInput.placeholder = properties.placeholder;
        elements.keyboardInput.value = properties.value;
    }

    function operateOnKeys(lang, clb) {
        Helper(keys[lang]).each(function (rowKeys, rowIndex) {
            Helper(rowKeys).each(function (key, keyIndex) {
                var isBreakLine = keyIndex === rowKeys.length - 1;
                clb.apply(this, [key, rowIndex, keyIndex, isBreakLine]);
            });
        });
    };

    function toggleCapsLock() {
        Helper('button.keyboard__key').each(function (key) {
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
        console.log(elements.keyboardInput.value);
        elements.clientInput.value = elements.keyboardInput.value;
        Helper(elements.container).addClass('keyboard--hidden');
    }

    function changeLangauge(lang) {
        if (supportedLanguages.indexOf(lang) === -1) return;

        var k = Helper('.keyboard__key:not(.keyboard__key--wide):not(.keyboard__key--extra-wide)'),
            i = 0;

        operateOnKeys(lang, function (key) {
            if (!isSpecialKey(key) && k[i]) {
                Helper(k[i]).text(key + "");
                i++;
            }
        });

        options.lang = lang;
    }

    function isSpecialKey(key) {
        return typeof key !== 'number' && key.match(/x\w+/) !== null;
    }

    function initEvents() {
        // Binding the focus event on inputs, textareas (exclude the keyboard input)
        Helper('input:not(.keyboard__input), textarea').each(function (input) {
            Helper(input).on('focus', function (e) {
                var input = e.target;
                // exclude the readonly fileds
                if (input.readOnly) return;
                // Shows the kayboard
                Helper(elements.container).removeClass('keyboard--hidden');
                elements.clientInput = input;
                // Init the keyboard input
                initKeyboardInput({
                    placeholder: input.placeholder,
                    value: input.value
                });
                // Update the keyboard when typing in an input 
                Helper(input).on('input', function () {
                    elements.keyboardInput.value = this.value;
                });
            });
        });

        // Hide the keyboard when clicking out of the keyboard view
        Helper(window).on('click', function (e) {
            if (!Helper(elements.container).contains('keyboard--hidden')) {
                if (e.target !== elements.keyboardInput &&
                    ['input', 'textarea'].indexOf(e.target.tagName.toLowerCase()) === -1 &&
                    e.target.closest('.keyboard') !== elements.container) {
                    Helper(elements.container).addClass('keyboard--hidden');
                    Helper('.languages__list').removeClass('show');
                    done();
                }
            }
        });

        // Update the client input when typing in the keyboard input
        Helper(elements.keyboardInput).on('input', function () {
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