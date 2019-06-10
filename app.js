/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return createElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return EventEmitter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return save; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return load; });
function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    Object.keys(props).forEach(key => {
        if (key.startsWith('data-')) {
            element.setAttribute(key, props[key]);
        } else {
            element[key] = props[key];
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }

        element.appendChild(child);
    });

    return element;
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(arg));
        }
    }
}

function save(data) {
    const string = JSON.stringify(data);

    localStorage.setItem('books', string);
}

function load() {
    const string = localStorage.getItem('books');
    const data = JSON.parse(string);

    return data;
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        view.on('add', this.addBook.bind(this));
        view.on('edit', this.editBook.bind(this));
        view.on('remove', this.removeBook.bind(this));
		view.on('search', this.searchBook.bind(this));

        view.show(model.items);
    }

    addBook(data) {
		const title = data.valueName;
		const author = data.valueAuthor;
		
        const item = this.model.addItem({
            id: Date.now(),
            title,
			author
        });

        this.view.addItem(item);
    }

    editBook({ id, title, author }) {
		
		const item = this.model.updateItem(id, { title, author });
        this.view.editItem(item);
    }

    removeBook(id) {
        this.model.removeItem(id);
        this.view.removeItem(id);
    }
	
	searchBook(search) {
		const books=[];
		this.model.items.forEach(function(item) {
			if(item.title.indexOf(search)===0){
				books.push(item);
			}
		});
		this.view.clear();
		this.view.show(books);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Controller);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);


class Model extends __WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* EventEmitter */] {
    constructor(items = []) {
        super();
        
        this.items = items;
    }

    getItem(id) {
        return (this.items.find(item => item.id == id));
    }

    addItem(item) {
		this.items.push(item);
        this.emit('change', this.items);
        return (item);
    }

    updateItem(id, data) {
        const item = this.getItem(id);

        Object.keys(data).forEach(prop => item[prop] = data[prop]);

        this.emit('change', this.items);
        
        return item;
    }

    removeItem(id) {
        const index = this.items.findIndex(item => item.id == id);
        
        if (index > -1) {
            this.items.splice(index, 1);
            this.emit('change', this.items);
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Model);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(0);


class View extends __WEBPACK_IMPORTED_MODULE_0__helpers__["c" /* EventEmitter */] {
    constructor() {
        super();
		this.search = document.getElementById('search');
        this.form = document.getElementById('book-form');
        this.input = document.getElementById('add-input');
		this.inputAddAuthor = document.getElementById('add-input-author');
        this.list = document.getElementById('book-list');
        this.form.addEventListener('submit', this.handleAdd.bind(this));
		this.search.addEventListener('input',this.handleSearch.bind(this));
    }
    createListItem(book) {
        const labelName = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('label', { className: 'title' }, book.title);
		const labelAuthor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('label', { className: 'author' }, book.author);
        const editInputName = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('input', { type: 'text', className: 'field-name' });
		const editInputAuthor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('input', { type: 'text', className: 'field-author' });
        const editButton = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('button', { className: 'edit' }, 'Изменить');
        const deleteButton = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('button', { className: 'remove' }, 'Удалить');
        const item = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["d" /* createElement */])('li', { className: 'book-item', 'data-id': book.id }, labelName, editInputName, editButton, deleteButton, labelAuthor, editInputAuthor);

		return this.addEventListeners(item);
    }

    addEventListeners(item) {
        const editButton = item.querySelector('button.edit');
        const removeButton = item.querySelector('button.remove');

		


        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));


        return item;
    }

    findListItem(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Необходимо ввести название книги.');

        const valueName = this.input.value;
		const valueAuthor = this.inputAddAuthor.value;

        this.emit('add', {valueName, valueAuthor});
    }

    handleEdit({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const labelName = listItem.querySelector('.title');
		const labelAuthor = listItem.querySelector('.author');
        const inputName = listItem.querySelector('.field-name');
		const inputAuthor = listItem.querySelector('.field-author');
        const editButton = listItem.querySelector('button.edit');
        const title = inputName.value;
		const author = inputAuthor.value;
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            this.emit('edit', { id, title, author });
        } else {
            inputName.value = labelName.textContent;
			inputAuthor.value = labelAuthor.textContent;
            editButton.textContent = 'Сохранить';
            listItem.classList.add('editing');
        }
    }

    handleRemove({ target }) {
        const listItem = target.parentNode;

        this.emit('remove', listItem.getAttribute('data-id'));
    }

    clear() {
		this.list.innerHTML = '';
	}
	
    show(books) {
        books.forEach(book => {
            const listItem = this.createListItem(book);
			this.input.value = '';
			this.inputAddAuthor.value = '';
            this.list.appendChild(listItem);
        });
    }

    addItem(book) {
		if(book.author === undefined){
			book.author ='';	
		}
		this.input.value = '';
		this.inputAddAuthor.value = '';
		
		const listItem = this.createListItem(book);			
        this.list.appendChild(listItem);
    }


    editItem(book) {
        const listItem = this.findListItem(book.id);
        const labelName = listItem.querySelector('.title');
        const inputName = listItem.querySelector('.field-name');
		const labelAuthor = listItem.querySelector('.author');
        const inputAuthor = listItem.querySelector('.field-author');
        const editButton = listItem.querySelector('button.edit');

        labelName.textContent = book.title;
		labelAuthor.textContent = book.author;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('editing');
    }

    removeItem(id) {
        const listItem = this.findListItem(id);

        this.list.removeChild(listItem);
    }
	
	handleSearch(val) {
        this.emit('search', this.search.value);
	}
	
}

/* harmony default export */ __webpack_exports__["a"] = (View);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controller__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers__ = __webpack_require__(0);





const books = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers__["a" /* load */])();

const model = new __WEBPACK_IMPORTED_MODULE_0__model__["a" /* default */](books || undefined);
model.on('change', books => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__helpers__["b" /* save */])(books));

const view = new __WEBPACK_IMPORTED_MODULE_1__view__["a" /* default */]();
const controller = new __WEBPACK_IMPORTED_MODULE_2__controller__["a" /* default */](model, view);

/***/ })
/******/ ]);