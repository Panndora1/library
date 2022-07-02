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
function readButton(txt) {
    const readBtn = document.querySelectorAll('.read-btn');
    const viewTitle = document.querySelector('.view-area__title')

    readBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            new radioChange(read).remove();
            new radioChange(change).add();
        })
    })

    viewTitle.textContent = txt
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

//listener for done book btn
function doneButton() {
    const doneBtn = document.querySelectorAll('.done-btn');

    doneBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = 'Прочитал';
        })
    })
}


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

// data

let dataLoad = []

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
                //read.insertAdjacentHTML('afterend', `<p class="view-area__text">${e.target.result}</p>`)
                
                let nameBook = document.querySelectorAll('.form__name');
                
                let text = nameBook[1].value

                //отправка данных
                loadBtn.addEventListener('click', () => {
                    sendRequest('POST', requestURL, {
                        login: text,
                        file: e.target.result
                    })
                        .then(data => console.log(data))
                        .catch(err => console.log(err));
                
                    console.log('click')
                } )
            }
            reader.readAsBinaryString(file)
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
/*
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
                <button class="book__btn btn read-btn">Читать</button>
                <button class="book__btn btn del-btn">Х</button>
            </div>`

            listContainer.prepend(bookOne)    
}
*/
