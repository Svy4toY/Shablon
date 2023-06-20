let a_link = document.querySelector('.voytiilizaregistrirovatsa')
const username = sessionStorage.getItem('username');
a_link.innerHTML = username + "<br>" + 'Выйти' 
var isUser = true;
if(username == null){
    a_link.innerHTML="войти/<br>зарегистрироваться"
    isUser = false;
    allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
    button.style.visibility = 'hidden';
});
}
a_link.addEventListener('click', function(e){sessionStorage.clear();})




async function getObjects(api){
    document.querySelector('.feed').innerHTML = "";

    fetch(`/api/${api}`)
      .then(function (response) {
          return response.json()
      })
      .then(function (objects) {
        objects.forEach((element, i) => {

            blank(element.name, element.text, element.pic, i, element);
        });
      })
}

getObjects("get/objects/")

function blank(name, text, img_src, i, element){

    let feed = document.querySelector('.feed')
    const obj_block = document.createElement("div")
    obj_block.className = 'obj_block'

    const obj_Name = document.createElement("label")
    obj_Name.className = 'obj_Name'
    const obj_Text = document.createElement("label")
    obj_Text.className = 'obj_Text'
    const delBtn = document.createElement("button")
    delBtn.className = 'delBtn';
    const editBtn = document.createElement("button")
    editBtn.className = 'editBtn';

    let panelDiv = feed.appendChild(obj_block)

    if(img_src){
        obj_block.className = 'obj_block_wp'
        const picture = document.createElement("img")
        picture.src = img_src
        picture.className = 'obj_Pic'

        let Pic_place = panelDiv.appendChild(picture)
    }

    let panel_Name = panelDiv.appendChild(obj_Name)
    panel_Name.innerText = name
    panel_Name.style.margin='2%';
    let panel_Text = panelDiv.appendChild(obj_Text)
    panel_Text.innerText = text
    panel_Text.style.margin='2%';

    if(isUser){
    let DELETE = panelDiv.appendChild(delBtn)
    DELETE.innerText='del'
    DELETE.className='delBtn'+i;
    DELETE.id = i;
    var delButton = document.querySelector('.delBtn'+i)
    delButton.addEventListener('click', () => {delete_From(i, element)})

    let EDIT = panelDiv.appendChild(editBtn)
    EDIT.innerText='edit'  
    EDIT.className='editBtn'+i;
    EDIT.id = i;
    var editButton = document.querySelector('.editBtn'+i)
    editButton.addEventListener('click', () => {edit_From(i, element)})
}
}

const modalAdd = document.querySelector('.modal_add')
const addButton = document.querySelector('.add_button')
addButton.addEventListener('click', x => (modalAdd.style.visibility = 'visible'))
const modalExit = document.querySelector('.modal_exit')
modalExit.addEventListener('click', x => (modalAdd.style.visibility = 'hidden', submitUpd.style.visibility='hidden'))
const submitAdd = document.querySelector('.submit_add')
submitAdd.addEventListener('click', addObject)
const submitUpd = document.querySelector('.submit_upd')
submitUpd.addEventListener('click', submitEditFun)
submitUpd.style.visibility='hidden'

let inputName = document.querySelector('.add_input_name');
let inputText = document.querySelector('.add_input_text');
let inputPic = document.querySelector('.add_picture');


async function addObject(){

    let object = {}
    if(inputName.value == "" && inputText.value == ""){
        return false;
    }
    else{
    let formData = new FormData();
    if(inputPic.value){
        
        let file = inputPic.files[0]
        formData.append('image', file);

        console.log(file);

        var allowSend = new Promise((resolve, reject)=> {
        fetch('/api/add/pic/', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            object = {
                name:inputName.value,
                text:inputText.value,
                pic:data.message
            }
            sendSecond(object)
          })
          .catch(error => {
            console.error('Ошибка загрузки изображения', error);
          });     

    });
    }else{
        object = {
            name:inputName.value,
            text:inputText.value
        }
        sendSecond(object)
    }
    console.log(object);

    }

    getObjects("get/objects/")
}

async function sendSecond(object){
    let response = await fetch('/api/add/object/',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(object)
    })

    if (response.status === 200) {
        const addedObj = await response.json()
        console.log('OBJECT успешно добавлен', addedObj);
    }
}

function delete_From(i, element){
    // console.log(element.name);
    let response = fetch('/api/objDelete/',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(element)
    })

    getObjects("get/objects/")
}
var element_for_edit_id = "";

function edit_From(i, element){    
    submitAdd.style.visibility='hidden'
    submitUpd.style.visibility='visible'
    modalAdd.style.visibility = 'visible'
    inputName.value = element.name;
    inputText.value = element.text;
    element_for_edit_id = element._id
}

async function submitEditFun(){
    let object = {
        name:inputName.value,
        text:inputText.value,
        _id:element_for_edit_id
    }

        let response = fetch('/api/Edit/',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(object)
        })
    console.log(object);
}