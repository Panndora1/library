// Create const for radio button
const downloadRadio = document.querySelector('.download');
const selfloadRadio = document.querySelector('.selfload');
const downloadForm = document.querySelector('.form__download');
const selfloadForm = document.querySelector('.form__selfload');
const loadBtn = document.querySelector('.form__btn');
let draggedItem = null;

//Listener for radio button
downloadRadio.addEventListener('click', () => {
    selfloadForm.classList.add('disable');
    downloadForm.classList.remove('disable');
})

selfloadRadio.addEventListener('click', () => {
    selfloadForm.classList.remove('disable');
    downloadForm.classList.add('disable');
})

//Create const for book review
const read = document.querySelector('.view-area__read');
const change = document.querySelector('.view-area__change')

//Create const for book
const books = document.querySelectorAll('.book');

// data
let dataLoad = []
let arr = []
let arrValues;

// Upload files
function upload(selector, options) {
    const input = document.querySelector(selector);

    if (options.accept) {
        input.setAttribute('accept', options.accept)
    }

    const changeHandler = (event) => {
        if (!event.target.files.length) { return }
    }

    input.addEventListener('change', changeHandler);
}


upload('#file', {
    accept: '.txt'
})

//API url

const requestURL = 'https://apiinterns.osora.ru/';

const formDownload = document.getElementById('form__download');
const formSelfload = document.getElementById('form__selfload');

let dataValues = [];
let containers = {}
let booksArea;

function getData(name, file) {

    let values = {}

    values = {
        name: name.value,
        file: file.value || file.text
    }

    if (dataValues == null) {
        dataValues = []
    }

    dataValues.push(values)
    localStorage.setItem('values', JSON.stringify(dataValues));

    //createBook(values.name)
}

function postRequest(name, fileField) {
   
    const formData = new FormData();

    formData.append('login', name.value);
    formData.append('file', fileField.files[0]);

    sendRequest("POST", requestURL, formData)
}

// FETCH function

function sendRequest(method, url, body = null) {
    
    return fetch(url, {
        method: method,
        body: body
    }).then(response => {
        return response.json()
    }).then((data) => {
        const name = formDownload.querySelector('[name="login"]')
        getData(name, data);
    })
}

// create book

function createBook(log) {
    let bookOne = document.createElement('div')
            bookOne.classList.add('list__book')
            bookOne.classList.add('book')
            bookOne.draggable = 'true'
            const listContainer = document.querySelector('.list__container')

            let header = document.createElement('h3');
            header.className = 'book__title'
            header.textContent = log;
            bookOne.prepend(header);

            let div = document.createElement('div');
            div.className = 'book__btns'
            bookOne.append(div)

            let classBtns = ["book__btn btn change-btn", "book__btn btn done-btn", "book__btn btn read-btn book__btn_readable", "book__btn btn del-btn"]
            //let textBtns = ['Ред.', 'Прочитана', 'Читать', 'Х']

            for (let i = 0;  i < 4; i++) {
                let btn = document.createElement('button');
                btn.className = classBtns[i];
                //btn.textContent = textBtns[i];

                div.append(btn)
            }
            
            listContainer.prepend(bookOne)   
            delButton()
            doneButton() 
            changeButton()
            readButton()
            dragNDrop()        

            if(containers.fav != undefined) {
                startLocalDragNdrop()
            }
            
}


//get data from forms
formDownload.addEventListener('submit', (event) => {
    event.preventDefault()

    const name = formDownload.querySelector('[name="login"]')
    const fileField = formDownload.querySelector('[name="file"]')

    postRequest(name, fileField);

    createBook(name.value)

    startLocalDragNdrop()
    localStorageDragNDrop()
    
    dragNDrop() 
    
})

formSelfload.addEventListener('submit', (event) => {
    event.preventDefault()

    const name = formSelfload.querySelector('[name="login"]')
    const file = formSelfload.querySelector('[name="file"]')

    getData(name, file);
    
    createBook(name.value)

    startLocalDragNdrop()
    localStorageDragNDrop()

    dragNDrop() 
    
})

// LOCALSTORAGE
function localStorageRun() {
    dataValues = JSON.parse(localStorage.getItem('values'));
}

localStorageRun()

if (localStorage.containers != undefined) {
    localStorageDragNDrop()
}

//localstorage drag and drop
function localStorageDragNDrop() {
    let containersValue = JSON.parse(localStorage.getItem('containers'));

    let favWr = document.querySelector('.books__fav');
    let mainWr = document.querySelector('.books__list');

    favWr.innerHTML = ''
    mainWr.innerHTML = ''

    mainWr.innerHTML = containersValue.main;
    favWr.innerHTML = containersValue.fav;

    let books = document.querySelectorAll('.book');
    books.forEach(el => {
        el.classList.remove('hide')
    })

    createHeaders('Любимые книги', 'favorite__title title', favWr);
    createHeaders('Список книг','list__title title', mainWr);

    delButton()
    doneButton() 
    readButton()
    changeButton()
}

//save favorite and main block to localstorage
function startLocalDragNdrop() {
    let favorite = document.querySelector('.favorite__container'),
        main = document.querySelector('.list__container');     
        
    containers = {
        fav: favorite.outerHTML,
        main: main.outerHTML
    }
    
    localStorage.setItem('containers', JSON.stringify(containers))
}

//create headers for book containers
function createHeaders(text, className, parent) {
    let header = document.createElement('h2');
    header.className = className;
    header.textContent = text;

    parent.prepend(header)
}

// Drag and drop
function dragNDrop() {
    const container = document.querySelectorAll('.drop-area');
    const books = document.querySelectorAll('.book');

    for (let i = 0; i < books.length; i++) {
        const book = books[i];

        book.addEventListener('dragstart', () => {
            draggedItem = book;
            setTimeout(() => {
                book.classList.add('hide')
            }, 0)
        })

        book.addEventListener('dragend', () => {
            setTimeout(() => {
                book.classList.remove('hide');
                draggedItem = null;
            }, 0)
        })

        for (let j = 0; j < container.length; j++) {
            const area = container[j];

            area.addEventListener('dragover', e => e.preventDefault())
            area.addEventListener('dragenter', function() {
                this.classList.add('hovered')
            })
            area.addEventListener('dragleave', function() {
                this.classList.remove('hovered')
            })
            area.addEventListener('drop', function() {
                this.classList.remove('hovered')
                this.before(draggedItem);

                startLocalDragNdrop()
            })
        }
    }     
}

dragNDrop()

//BUTTONS

//listener for done book btn
function doneButton() {
    const doneBtn = document.querySelectorAll('.done-btn');

    doneBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('check');
            btn.parentNode.parentNode.classList.toggle('done')

            startLocalDragNdrop()
        })
    })
}

//listener for delete book btn
function delButton() {
    const delBtn = document.querySelectorAll('.del-btn');

    delBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentNode.parentNode.classList.add('disable');
            change.classList.add('disable');
            read.classList.add('disable');

            let nameBook = event.target.parentNode.parentNode.childNodes[0].textContent;
            let index;

            dataValues.forEach((el, i) => {
                if(el.name == nameBook) {
                    index = i;
                }
            })

            dataValues[index].name = null;
            dataValues[index].file = null;

            localStorage.setItem('values', JSON.stringify(dataValues))
            startLocalDragNdrop()
        })
    })
}

//Listener for read book btn
function readButton() {
    const readBtn = document.querySelectorAll('.book__btn_readable');
    const viewTitle = document.querySelector('.view-area__title')
    const viewText = document.querySelector('.view-area__text')

    readBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            change.classList.add('disable');
            read.classList.remove('disable');

            let nameBook = event.target.parentNode.parentNode.childNodes[0].textContent;

            viewTitle.textContent = nameBook;

            let index;

            dataValues.forEach((el, i) => {
                if(el.name == nameBook) {
                    index = i;
                }
            })

            let fileName = dataValues[index].file;
            
            if(fileName.includes('.txt')) {
                console.log(arr)
                viewText.textContent = arr[index];
            } else {
                viewText.textContent = dataValues[index].file;
            }
        })        
    })
}

function changeButton() {
    
    const changeTitle = document.querySelector('.view-area__change-headline');
    const changeText = document.querySelector('.view-area__change-text');
    const saveChangeBtn = document.querySelector('.view-area__btn');

    const changeBtn = document.querySelectorAll('.change-btn');
    let index;

    changeBtn.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            change.classList.remove('disable');
            read.classList.add('disable');

            index = i;

            //display initial values
            dataValues.forEach(obj => {
                if(obj.name === btn.parentNode.parentNode.childNodes[0].textContent) {
                    changeTitle.value = obj.name
                    changeText.textContent = obj.file
                }
            })
        })
    })

    saveChangeBtn.addEventListener('click', () => {
        const books = document.querySelectorAll('.book');
        const title = changeTitle.value
        const desc = changeText.value

        dataValues.forEach(obj => {
            if(obj.name === books[index].childNodes[0].textContent) {
                obj.name = title
                obj.file = desc
            }
        })

        books[index].childNodes[0].textContent = title

        localStorage.setItem('values', JSON.stringify(dataValues));
        startLocalDragNdrop()
    })
}