// Create const for radio button
const downloadRadio = document.querySelector('.download');
const selfloadRadio = document.querySelector('.selfload');
const downloadForm = document.querySelector('.form__download');
const selfloadForm = document.querySelector('.form__selfload');

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

// Create const for button on the book
const changeBtn = document.querySelectorAll('.change-btn');
const doneBtn = document.querySelectorAll('.done-btn');
const readBtn = document.querySelectorAll('.read-btn');
const delBtn = document.querySelectorAll('.del-btn');

//Create const for book review
const read = document.querySelector('.view-area__read');
const change = document.querySelector('.view-area__change')

//Create const for book
const book = document.querySelectorAll('.book')

//Listener for change book btn
readBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        new radioChange(read).remove();
        new radioChange(change).add();
    })
})

//Listener for read book btn
changeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        new radioChange(change).remove();
        new radioChange(read).add();
    })
})

//listener for done book btn
doneBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.textContent = 'Прочитал'
    })
})

//listener for delete book btn
delBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentNode.parentNode.classList.add('disable');
        new radioChange(read).add();
        new radioChange(change).add();
    })
})