onFirstLoad();

function onFirstLoad() {
    showPrincipal();
    reloadTable();
}

function showPrincipal() {
    fetch("api/principal").then(function(response) {
        if (response.ok) {
            response.json().then(function(user) {
                let emailPrincipal = document.getElementById("emailPrincipal");
                let rolePrincipal = document.getElementById("rolePrincipal");
                emailPrincipal.innerText = user.email;
                rolePrincipal.innerText = user.roleNames;
            });
        } else {
            console.error(response.status + response.statusText);
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function reloadTable() {
    fetch("/api").then(function(response) {
        if (response.ok) {
            response.json().then(function(users) {
                let adminTable = document.getElementById("adminTable");
                let rowsCount = adminTable.rows.length;
                for (let i = rowsCount - 1; i >= 0; i--) {
                    adminTable.deleteRow(i);
                }
                let count = 0;
                users.forEach(function (user) {
                    insertUser(user, adminTable, count);
                    count++;
                });
            });
        } else {
            console.error(response.status + response.statusText);
        }
    });
}

function insertUser(user, table, count) {
    let row = table.insertRow(count);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    let cell5 = row.insertCell(5);
    let cell6 = row.insertCell(6);
    let cell7 = row.insertCell(7);
    cell0.innerText = user.id;
    cell1.innerText = user.firstName;
    cell2.innerText = user.lastName;
    cell3.innerText = user.age;
    cell4.innerText = user.email;
    cell5.innerText = user.roleNames;
    let editButtonHtml;
    let deleteButtonHtml;
    if (user.email !== "admin@admin.com") {
        editButtonHtml = "<button id='" + user.id + "' value='" + user.id + "' type='button' name='tableEdit' " +
            "class='btn btn-info' data-target='#editModal' data-toggle='modal' " +
            "onclick='showUserToEdit(this)'>Edit</button>";
        deleteButtonHtml = "<button id='" + user.id + "' value='" + user.id + "' type='button' name='tableDelete' " +
            "class='btn btn-danger' data-target='#deleteModal' data-toggle='modal' " +
            "onclick='showUserToDelete(this)'>Delete</button>";
    } else {
        editButtonHtml = "<button id='" + user.id + "' value='" + user.id + "' type='button' name='tableEdit' " +
            "class='btn btn-info' disabled>Edit</button>";
        deleteButtonHtml = "<button id='" + user.id + "' value='" + user.id + "' type='button' name='tableDelete' " +
            "class='btn btn-danger' disabled>Delete</button>";
    }
    cell6.innerHTML = editButtonHtml;
    cell7.innerHTML = deleteButtonHtml;
}

function addUser() {
    let addForm = document.getElementById("addForm");
    let roleAdd = document.getElementById("roleAdd");
    let rolesId = getCheckedRoles(roleAdd);
    if (addForm.checkValidity() && rolesId.length > 0) {
        let user = {};
        user.firstName = document.getElementById("firstNameAdd").value;
        user.lastName = document.getElementById("lastNameAdd").value;
        user.age = document.getElementById("ageAdd").value;
        user.email = document.getElementById("emailAdd").value;
        user.password = document.getElementById("passwordAdd").value;
        user.rolesId = rolesId;
        fetch("/api/add", {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (response.ok) {
                let addForm = document.getElementById("addForm");
                addForm.reset();
                let successAdd = document.getElementById("successAdd");
                successAdd.innerText = "New user was added successfully";
                setTimeout(function () {
                    successAdd.innerText = "";
                }, 2000);
            } else {
                console.error(response.status + response.statusText);
            }
        }).then(function() {
            reloadTable();
        }).catch(function(error) {
            console.error(error);
        });
    } else {
        if (!addForm.checkValidity()) {
            addForm.reportValidity();
        }
        if (rolesId.length === 0) {
            let failAdd = document.getElementById("failAdd");
            failAdd.innerText = "At least one role is required";
            setTimeout(function () {
                failAdd.innerText = "";
            }, 2000);
        }
    }
}

function editUser() {
    let editForm = document.getElementById("editForm");
    let roleEdit = document.getElementById("roleEdit");
    let rolesId = getCheckedRoles(roleEdit);
    if (editForm.checkValidity() && rolesId.length > 0) {
        let user = {};
        user.id = document.getElementById("idEdit").value;
        user.firstName = document.getElementById("firstNameEdit").value;
        user.lastName = document.getElementById("lastNameEdit").value;
        user.age = document.getElementById("ageEdit").value;
        user.email = document.getElementById("emailEdit").value;
        user.rolesId = rolesId;
        let password = document.getElementById("passwordEdit").value;
        if (password === "") {
            password = document.getElementById("hiddenPasswordEdit").value;
        }
        user.password = password;
        fetch("/api/edit", {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (response.ok) {
                let closeEditForm = document.getElementById("closeEditForm");
                closeEditForm.click()
            } else {
                console.error(response.status + response.statusText);
            }
        }).then(function() {
            reloadTable();
        }).catch(function(error) {
            console.error(error);
        });
    } else {
        if (!editForm.checkValidity()) {
            editForm.reportValidity();
        }
        if (rolesId.length === 0) {
            let failEdit = document.getElementById("failEdit");
            failEdit.innerText = "At least one role is required";
            setTimeout(function () {
                failEdit.innerText = "";
            }, 2000);
        }
    }
}

function deleteUser() {
    let id = document.getElementById("idDelete").value;
    fetch("/api/delete/" + id).then(function(response) {
        if (!response.ok) {
            console.error(response.status + response.statusText);
        }
    }).then(function () {
        reloadTable();
    }).catch(function(error) {
        console.error(error);
    })
}

function showUserToEdit(button) {
    let id = button.value;
    fetch("api/editForm/" + id).then(function(response) {
        if (response.ok) {
            response.json().then(function(user) {
                let idEdit = document.getElementById("idEdit");
                let firstNameEdit = document.getElementById("firstNameEdit");
                let lastNameEdit = document.getElementById("lastNameEdit");
                let ageEdit = document.getElementById("ageEdit");
                let emailEdit = document.getElementById("emailEdit");
                let hiddenPasswordEdit = document.getElementById("hiddenPasswordEdit");
                let adminCheck = document.getElementById("roleEditAdmin");
                let userCheck = document.getElementById("roleEditUser")
                idEdit.value = user.id;
                firstNameEdit.value = user.firstName;
                lastNameEdit.value = user.lastName;
                ageEdit.value = user.age;
                emailEdit.value = user.email;
                hiddenPasswordEdit.value = user.password;
                if (user.rolesId.includes(1)) {
                    adminCheck.checked = true;
                }
                if (user.rolesId.includes(2)) {
                    userCheck.checked = true;
                }
            });
        } else {
            console.error(response.status + response.statusText);
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function showUserToDelete(button) {
    let id = button.value;
    fetch("api/deleteForm/" + id).then(function(response) {
        if (response.ok) {
            response.json().then(function(user) {
                let idDelete = document.getElementById("idDelete");
                let firstNameDelete = document.getElementById("firstNameDelete");
                let lastNameDelete = document.getElementById("lastNameDelete");
                let ageDelete = document.getElementById("ageDelete");
                let emailDelete = document.getElementById("emailDelete");
                let adminCheck = document.getElementById("roleDeleteAdmin");
                let userCheck = document.getElementById("roleDeleteUser")
                idDelete.value = user.id;
                firstNameDelete.value = user.firstName;
                lastNameDelete.value = user.lastName;
                ageDelete.value = user.age;
                emailDelete.value = user.email;
                if (user.rolesId.includes(1)) {
                    adminCheck.checked = true;
                }
                if (user.rolesId.includes(2)) {
                    userCheck.checked = true;
                }
            });
        } else {
            console.error(response.status + response.statusText);
        }
    }).catch(function (error) {
        console.error(error);
    });
}

function getCheckedRoles(role) {
    let checkboxes = role.querySelectorAll('input[type=checkbox]:checked');
    let checked = [];
    for (let i = 0; i < checkboxes.length; i++) {
        checked.push(parseInt(checkboxes[i].value, 10));
    }
    return checked
}