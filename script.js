// Create const for radio button
const downloadRadio = document.querySelector('.download');
const selfloadRadio = document.querySelector('.selfload');
const downloadForm = document.querySelector('.form__download');
const selfloadForm = document.querySelector('.form__selfload');
const loadBtn = document.querySelector('.form__btn')

// Class to control the visibility of objects
class radioChange {
    constructor(btn) {
        this.btn = btn
    }

    add() {
        this.btn.classList.add('disable');
    }

    remove() {
        this.btn.classList.remove('disable');
    }
}

//Listener for radio button
downloadRadio.addEventListener('click', () => {
    new radioChange(downloadForm).remove();
    new radioChange(selfloadForm).add();
})

selfloadRadio.addEventListener('click', () => {
    new radioChange(selfloadForm).remove();
    new radioChange(downloadForm).add();
})

//Create const for book review
const read = document.querySelector('.view-area__read');
const change = document.querySelector('.view-area__change')

//Create const for book
const book = document.querySelectorAll('.book')

//Listener for read book btn
function readButton(title, text) {
    const readBtn = document.querySelectorAll('.read-btn');
    const viewTitle = document.querySelector('.view-area__title')
    const viewText = document.querySelector('.view-area__text')

    readBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            new radioChange(read).remove();
            new radioChange(change).add();
        })
    })

    viewTitle.textContent = title;
    viewText.textContent = text;

}

//Listener for change book btn
function changeButton() {
    const changeBtn = document.querySelectorAll('.change-btn');

    changeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            new radioChange(change).remove();
            new radioChange(read).add();
        })
    })
}

changeButton()

//listener for done book btn
function doneButton() {
    const doneBtn = document.querySelectorAll('.done-btn');

    doneBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = 'Прочитал';
        })
    })
}

doneButton()

//listener for delete book btn
function delButton() {
    const delBtn = document.querySelectorAll('.del-btn');

    delBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentNode.parentNode.classList.add('disable');
            new radioChange(read).add();
            new radioChange(change).add();
        })
    })
}

delButton()
// data

let dataLoad = []
let arr = []

// Upload files
function upload(selector, options) {
    const input = document.querySelector(selector);

    if (options.accept) {
        input.setAttribute('accept', options.accept)
    }

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }

        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = e => {
                
                let text = e.target.result
                arr.push(text)

                //отправка данных
                /*
                loadBtn.addEventListener('click', () => {
                    sendRequest('POST', requestURL, {
                        login: text,
                        file: e.target.result
                    })
                        .then(data => console.log(data))
                        .catch(err => console.log(err));
                
                    console.log('click')
                } )
                */
            }
            reader.readAsText(file)
        })
    }
    input.addEventListener('change', changeHandler);
}


upload('#file', {
    accept: '.txt'
})


// FETCH

const requestURL = 'https://apiinterns.osora.ru/';

function sendRequest(method, url, body = null) {
    const headers = {
        
    }
    
    return fetch(url, {
        method: method,
        body: body,
        headers: headers
    }).then(response => {
        return response.json()
    })
}


// create book

function createBook(log) {
    
            let bookOne = document.createElement('div')
            bookOne.classList.add('list__book')
            bookOne.classList.add('book')
            const listContainer = document.querySelector('.list__container')

            bookOne.innerHTML = `
            <h3 class="book__title">${log}</h3>
            <div class="book__btns">
                <button class="book__btn btn change-btn">Ред.</button>
                <button class="book__btn btn done-btn">Прочитана</button>
                <button class="book__btn btn read-btn book__btn_readable">Читать</button>
                <button class="book__btn btn del-btn">Х</button>
            </div>`

            listContainer.prepend(bookOne)    
            changeButton()
            doneButton()
            delButton()
}

//upload data from form to book area

const formDownload = document.getElementById('form__download');
const formSelfload = document.getElementById('form__selfload');

let dataValues = []


function retriveFormValueDownload(event) {
    event.preventDefault();

    const name = formDownload.querySelector('[name="login"]')
    const  file = formDownload.querySelector('[name="file"]')

    const values = {
        name: name.value,
        file: file.value
    }

    createBook(values.name)
    readButton(values.name, arr[0])
}

function retriveFormValueSelfload(event) {
    event.preventDefault();

    const name = formSelfload.querySelector('[name="login"]')
    const file = formSelfload.querySelector('[name="file"]')

    const values = {
        name: name.value,
        file: file.value
    }

    sendRequest("POST", requestURL, values)

    dataValues.push(values)
    localStorage.setItem('values', JSON.stringify(dataValues))
    createBook(values.name)
    readButton(values.name, values.file)

}


formDownload.addEventListener('submit', retriveFormValueDownload)
formSelfload.addEventListener('submit', retriveFormValueSelfload)
console.log(dataValues)


// LOCALSTORAGE

dataValues = JSON.parse(localStorage.getItem('values'));

dataValues.forEach((el) => {
    createBook(el.name)
}) 

const b = document.querySelectorAll('.book__btn_readable')

b.forEach((el, index) => {
    el.addEventListener('click', () => {
            
        readButton(dataValues[index].name, dataValues[index].file)

    })
})