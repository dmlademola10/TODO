function $(sel) {
    return document.querySelector(sel);
}
function $A(sels) {
    return document.querySelectorAll(sels);
}
function $forms(form_name, child_name) {
    if (typeof child_name != "undefined") {
        return document.forms[form_name][child_name];
    }
    return document.forms[form_name];
}
window.addEventListener("load", () => {
    setInterval(() => {
        refresh();
    }, 3000);
    $("#msg_box").addEventListener("click", () => {
        $("#msg_box").style.display = "none";
        if (typeof int != "undefined") {
            clearTimeout(int);
        }
    })
    $("#add").addEventListener("click", function () {
        if ($("#new").style.height == "34px") {
            $("#new").style.height = "0px";
            $("#add").animate([
                { transform: "rotate(45deg)" },
                { transform: "rotate(0deg)" }
            ], {
                duration: 200,
                easing: "linear",
                fill: "forwards"
            });
        } else {
            $("#new").style.height = "34px";
            $("#add").animate([
                { transform: "rotate(0deg)" },
                { transform: "rotate(45deg)" }
            ], {
                duration: 200,
                easing: "linear",
                fill: "forwards"
            });
            $forms("new", "label").focus();
        }

    });
    $forms("new").addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData($forms("new"));
        const headers = new Headers();
        headers.set("X-Requested-With", "XMLHttpRequest");
        const options = {
            headers: headers,
        }
        const req = new Request("/save", options);
        fetch(req, { method: "POST", body: formData }).then(res => {
            if (!res.ok) {
                msg("An error occured!");
            }
            return res.json();
        }).then(response => {
            if (response.success == true) {
                msg("<span class='fa fa-check-double'></span> " + response.message);
                $forms("new").reset();
                refresh();
            } else {
                msg("<span class='fa fa-triangle-exclamation'></span> " + response.message);
            }
        }, reason => {
            msg("<span class='fa fa-triangle-exclamation'></span> An error occurred while contacting the server!");
            console.error(reason);
        });
    })

});
function modify(data) {
    const headers = new Headers();
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Content-Type", "application/json");
    const options = {
        headers: headers,
    }
    const req = new Request("/modify", options);
    fetch(req, { method: "POST", body: data }).then(res => {
        if (!res.ok) {
            msg("<span class='fa fa-triangle-exclamation'></span> An error occured!");
        }
        return res.json();
    }).then(response => {
        if (response.success == true) {
            msg("<span class='fa fa-check-double'></span> " + response.message);
            refresh();
        } else {
            msg("<span class='fa fa-triangle-exclamation'></span> " + response.message);
        }
    }, reason => {
        msg("<span class='fa fa-triangle-exclamation'></span> An error occurred while contacting the server!");
        console.error(reason);
    });
}
function delete_(id) {
    const headers = new Headers();
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Content-Type", "application/json");
    const options = {
        headers: headers,
    }
    const req = new Request("/delete", options);
    fetch(req, { method: "POST", body: JSON.stringify({ id: Number(id) }) }).then(res => {
        if (!res.ok) {
            msg("An error occured!");
        }
        return res.json();
    }).then(response => {
        if (response.success == true) {
            msg("<span class='fa fa-check-double'></span> " + response.message);
            refresh();
        } else {
            msg("<span class='fa fa-triangle-exclamation'></span> " + response.message);
        }
    }, reason => {
        msg("<span class='fa fa-triangle-exclamation'></span> An error occurred while contacting the server!");
        console.error(reason);
    });
}
function refresh() {
    const headers = new Headers();
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Content-Type", "application/json");
    const options = {
        headers: headers,
    }
    const req = new Request("/refresh", options);
    fetch(req).then(res => {
        if (!res.ok) {
            msg("An error occured1!");
        }
        return res.json();
    }).then((response) => {
        if (response.success == true) {
            const tasks = JSON.parse(response.tasks);
            $A(".tasks .task, .tasks h1").forEach((elem) => {
                $(".tasks").removeChild(elem);
            })
            if (tasks.length < 1) {
                var h1_ = document.createElement("h1");
                var txt = document.createTextNode("No tasks added.");
                h1_.appendChild(txt);
                $(".tasks").appendChild(h1_);
            } else {
                tasks.forEach((task) => {
                    var div_ = document.createElement("div");
                    div_.setAttribute("class", "task");
                    var input_ = document.createElement("input");
                    input_.setAttribute("type", "checkbox");
                    input_.setAttribute("id", task.id);
                    input_.setAttribute("class", "check");
                    input_.setAttribute("onchange", "check_func(this)");
                    if (task.done == true) {
                        input_.setAttribute("checked", "");
                    }
                    div_.appendChild(input_);
                    var txt = document.createTextNode("    ");
                    div_.appendChild(txt);
                    var label_ = document.createElement("label");
                    label_.setAttribute("for", task.id);
                    if (task.done == true) {
                        label_.setAttribute("class", "done");
                    }
                    var txt = document.createTextNode(task.label);
                    label_.appendChild(txt);
                    div_.appendChild(label_)
                    var span_ = document.createElement("span");
                    span_.setAttribute("onclick", "delete_(" + task.id + ")");
                    span_.setAttribute("class", "fa fa-trash-can del");
                    span_.setAttribute("title", "Delete");
                    div_.appendChild(span_);
                    $(".tasks").appendChild(div_);
                })
            }
        } else {
            msg("<span class='fa fa-triangle-exclamation'></span> " + response.message)
        }
    }, (reason) => {
        msg("<span class='fa fa-triangle-exclamation'></span> An error occurred while contacting the server!");
        console.error(reason);
    });
}
function check_func(elem) {
    if (elem.checked) {
        var data = JSON.stringify({ id: Number(elem.id), done: true })
    } else {
        var data = JSON.stringify({ id: Number(elem.id), done: false })
    }
    modify(data);
}
function msg(message) {
    const msg = $("#msg_box");
    msg.innerHTML = message;
    msg.style.display = "block";
    if (typeof int != "undefined") {
        clearTimeout(int);
    }
    int = setTimeout(() => {
        msg.style.display = "none";
    }, 5000)
}
