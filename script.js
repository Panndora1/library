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


changeButton()

//listener for done book btn
function doneButton() {
    const doneBtn = document.querySelectorAll('.done-btn');

    doneBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = 'Прочитал';
            btn.parentNode.parentNode.style.backgroundColor = '#00f'
        })
    })
}

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
        if (!event.target.files.length) {
            return
        }

        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = e => {
                
                
                let text = e.target.result
                arr.push(text)
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
    }).then((data) => {
        console.log(data)
    })
}


// create book

function createBook(log) {
    let bookOne = document.createElement('div')
            bookOne.classList.add('list__book')
            bookOne.classList.add('book')
            bookOne.draggable = 'true'
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
            delButton()
            doneButton() 
            changeButton()
            readButton()
}

//upload data from form to book area

const formDownload = document.getElementById('form__download');
const formSelfload = document.getElementById('form__selfload');

let dataValues = []

class retriveFormValue {
    constructor(form) {
        this.form = form
    }

    getFormValuesSelf() {        
        const name = this.form.querySelector('[name="login"]')
        const  file = this.form.querySelector('[name="file"]')

        let values = {}

        values = {
            name: name.value,
            file: file.value
        }

        


        if (dataValues == null) {
            dataValues = []
        }
    
        dataValues.push(values)
        localStorage.setItem('values', JSON.stringify(dataValues))

        createBook(values.name)
        
    }

    getFormValuesDown() {
        const name = this.form.querySelector('[name="login"]')

        let values = {}

        values = {
            name: name.value,
            file: arr[0]
        }

        arr = []

        if (dataValues == null) {
            dataValues = []
        }
    
        dataValues.push(values)
        localStorage.setItem('values', JSON.stringify(dataValues))

        createBook(values.name)
        
    }
}
/*
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

    if (dataValues == null) {
        dataValues = []
    }

    dataValues.push(values)
    localStorage.setItem('values', JSON.stringify(dataValues))
    createBook(values.name)
    readButton(values.name, values.file)

}
*/

formDownload.addEventListener('submit', (event) => {
    event.preventDefault()
    new retriveFormValue(formDownload).getFormValuesDown();

    const name = formDownload.querySelector('[name="login"]')
    const fileField = formDownload.querySelector('[name="file"]')
   
    const formData = new FormData();
   
    formData.append('login', name.value);
    formData.append('file', fileField.files[0]);
   
    sendRequest("POST", requestURL, formData)
    
})

formSelfload.addEventListener('submit', (event) => {
    event.preventDefault()
    new retriveFormValue(formSelfload).getFormValuesSelf();
})



// LOCALSTORAGE

function localStorageRun() {
    dataValues = JSON.parse(localStorage.getItem('values'));

    dataValues.forEach((el) => {
        if(el.name != null) {
            createBook(el.name)
        }
    
    }) 
}

localStorageRun()

//Listener for read book btn
function readButton() {
    const readBtn = document.querySelectorAll('.book__btn_readable');
    const viewTitle = document.querySelector('.view-area__title')
    const viewText = document.querySelector('.view-area__text')

    readBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            new radioChange(read).remove();
            new radioChange(change).add();

            let nameBook = event.target.parentNode.parentNode.childNodes[1].textContent;

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


//listener for delete book btn
function delButton() {
    const delBtn = document.querySelectorAll('.del-btn');

    delBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentNode.parentNode.classList.add('disable');
            new radioChange(read).add();
            new radioChange(change).add();

            let nameBook = event.target.parentNode.parentNode.childNodes[1].textContent;
            let index;

            dataValues.forEach((el, i) => {
                if(el.name == nameBook) {
                    index = i;
                }
            })

            dataValues[index].name = null;
            dataValues[index].file = null;

            localStorage.setItem('values', JSON.stringify(dataValues))
        })
    })

}

//Listener for change book btn
function changeButton() {
    const changeBtn = document.querySelectorAll('.change-btn');
    const changeTitle = document.querySelector('.view-area__change-headline');
    const changeText = document.querySelector('.view-area__change-text');

    const saveChangeBtn = document.querySelector('.viev-area__btn')

    changeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            new radioChange(change).remove();
            new radioChange(read).add();


            let nameBook = event.target.parentNode.parentNode.childNodes[1].textContent;
            let book = event.target.parentNode.parentNode.parentNode;
            let index;

            dataValues.forEach((el, i) => {
                if(el.name == nameBook) {
                    index = i;
                }
            })

            changeTitle.value = nameBook
            changeText.textContent = dataValues[index].file

            saveChangeBtn.addEventListener('click', () => {
               dataValues[index].name = changeTitle.value;
               dataValues[index].file = changeText.textContent;

               localStorage.setItem('values', JSON.stringify(dataValues))
               book.innerHTML = `<p class="list__drop-area drop-area">Drop down area</p>`

               localStorageRun()
               
            })
            
        })
    })
}

// drag and drop

let targetBook;

function dradAndDrop() {
    const books = document.querySelectorAll('.book');
    const dropArea = document.querySelectorAll('.drop-area');

    function dragStart() {
        setTimeout(() => {
            this.classList.add('hide');
        }, 0)
    }

    function dragEnd() {
        this.classList.remove('hide');
    }

    function dragOver(event) {
        event.preventDefault()
    }

    function dragEnter() {
        this.classList.add('hovered');
    }

    function dragLeave() {
        this.classList.remove('hovered');
    }

    function dragDrop() {
        this.before(targetBook)
    }

    dropArea.forEach(area => {
        area.addEventListener('dragover', dragOver);
        area.addEventListener('dragenter', dragEnter);
        area.addEventListener('dragleave', dragLeave);
        area.addEventListener('drop', dragDrop);
    })


    books.forEach(book => {
        book.addEventListener('dragstart', (event) => {
            dragStart();

            targetBook = event.target;
        } );
        book.addEventListener('dragend', dragEnd);


    })

}

dradAndDrop()