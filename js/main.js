'use strict';
document.addEventListener('DOMContentLoaded', function () {

    let todolist, this_event,
        list = document.querySelector('ul'),
        btn_add = document.getElementById("btn_add"),
        input_task = document.getElementById("input_task"),
        btn_edit = document.getElementById("btn_edit"),
        load_edit = document.getElementById("load_edit"),
        load = 0;

    load_edit.addEventListener("click", function () {
        getPostsAsync();
    });

    btn_add.addEventListener("click", function () {
        newElement()
    });

    btn_edit.addEventListener("click", function () {
        if (input_task.value != "") {
            let ev = this_event;
            ev.target.classList.remove("edit_this");
            ev.path[1].firstChild.data = input_task.value;
            toLocal();
            input_task.value = "";
        } else {
            ShowError("Вы не выбрали задачу, повторите попытку");
        }
    });

    let forLocal = localStorage.getItem('todolist');
    if (forLocal) {
        document.querySelector('ul').innerHTML = (forLocal);
        f_filtr()
    }

    list.addEventListener('click', function (ev) {
        switch (ev.target.tagName) {
            case ("LI"):
                ev.target.classList.toggle('checked');
                toLocal();
                break;
            case ("SPAN"):
                let div = ev.target.parentNode;
                div.remove();
                toLocal();
                break;
            case ("DIV"):
                let str = ev.path[1].firstChild.data;
                this_event = ev;
                editTask(str);
                break
        }
    });

    function editTask(item) {
        let btn_add = document.getElementById("btn_add"),
            btn_edit = document.getElementById("btn_edit");
        document.getElementById("input_task").value = item;
        btn_edit.classList.toggle('hide');
        btn_add.classList.toggle('hide');
    }

    function newElement() {
        let inputValue = input_task.value;
        if (inputValue == "") {
            ShowError("Вы не ввели задачу, повторите попытку");
        } else {
            createTask(inputValue);
            input_task.value = "";
        }
    }

    function ShowError(str) {
        document.getElementById('error').innerHTML = str;
        setTimeout(function () {
            document.getElementById('error').innerHTML = ""
        }, 750)
    }

    function toLocal() {
        todolist = list.innerHTML;
        localStorage.setItem('todolist', todolist);
        f_filtr()
    }

    function f_print(all, done) {
        let all_str = "Всего поставленно задач : ",
            done_str = "Выполненный зачач : ";
        if (done === undefined) {
            done = 0;
        }
        document.getElementById("all_task").innerHTML = all_str + all;
        document.getElementById("done_task").innerHTML = done_str + done;
    }

    function f_filtr() {
        let items = document.querySelectorAll("li"),
            all = items.length,
            done;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let str = item.classList;
            if (done === undefined) {
                done = 0;
            }
            if (str.value) {
                done++
            }
        }
        f_print(all, done);
    }

    async function getPostsAsync() {
        try {
            await getAwait();
        } catch (error) {
            ShowError("Сервер временно не доступен. Повторите попытку позже ");
        }
    }

    function getAwait() {
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4 && request.status === 200) {
                requestShow(JSON.parse(request.response));
            }
        });
        request.open('GET', 'https://jsonplaceholder.typicode.com/todos');
        request.send();
    }

    INIT();

    addNewTaskField.addEventListener('keyup',function (e) {
        if(e.keyCode === 13) {
            addTasks(this.value);
            this.value = "";
        }
    })

})