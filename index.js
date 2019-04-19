(function() {
    var name = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var email = document.getElementById('email');
    var submit = document.getElementById('submit');
    var dni = document.getElementById('dni');
    var studentList = document.getElementById('student-list')
    var IS_VALID = 'is-valid';
    var IS_INVALID = 'is-invalid';
    var nameIsValid = false;
    var dniIsValid = false;

    // Activa el súbmit sólo cuando nombre y dni sean válidos
    function disabledSubmit() {
        submit.disabled = !(nameIsValid && dniIsValid);
    }

    // Valida la clase de boostrap tomando como parámetro el booleano de la validación de los campos
    function classnameValidation(validation) {
        return validation ? IS_VALID : IS_INVALID;
    }

    // Valida el campo nombre, modifica la clase según el resultado y activa el submit si corresponde
    function validateName() {
        nameIsValid = name.value && name.value.length >= 3;
        name.classList.toggle(classnameValidation(nameIsValid));
        disabledSubmit();
    }

    // Valida el campo nombre, modifica la clase según el resultado y activa el submit si corresponde
    function validateDni() {
        var value = parseInt(dni.value, 10);
        dniIsValid = value && !isNaN(value) && value > 0 && dni.value.length === 8;
        dni.classList.toggle(classnameValidation(dniIsValid));
        disabledSubmit();
    }

    //Remueve las clases de boostrap y vacia los campos con el click
    function removeClass(inputs) {
        inputs.forEach(function (input) {
            input.onclick = function (event) {
                event.target.value.clear;
                event.target.classList.remove(IS_VALID, IS_INVALID);
            }
        })
    }

    function validateInputs(name, dni) {
        removeClass([name, dni]);
        name.onblur = validateName;
        dni.onblur = validateDni;
    }

    validateInputs(name, dni);


    // Chequea si existen estudiantes en el localstorage y de ser así, los muestra
    function checkLocalStorage(){
        if(localStorage.getItem('students')){
            var studentObject = JSON.stringify(localStorage.getItem('students'));
            studentList.appendChild(createStudentNode(studentObject));
        }
    }

    // Crea un nodo en el DOM a partir del objeto student
    function createStudentNode(studentObject) {
        var li = document.createElement('li');
        li.className = 'list-group-item';
        li.id = studentObject.dni;

        var h1 = document.createElement('h1');
        h1.textContent = studentObject.firstName + ' ' + studentObject.lastName;
        li.appendChild(h1);

        var h3 = document.createElement('h3');
        h3.textContent = 'DNI: ' + studentObject.dni;
        li.appendChild(h3);

        var p = document.createElement('p');
        p.textContent = 'EMAIL: ' + studentObject.email;
        li.appendChild(p);

        return li;
    }

    // Crea un objeto student y lo guarda en el submit
    function Student(firstName, lastName, dni, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.email = email;
    }

    function saveStudent(event) {
        var newStudent = new Student(firstName.value, lastName.value, dni.value, email.value);
        var studentJson = JSON.stringify(newStudent);
        studentList.appendChild(createStudentNode(newStudent));

    }

    //Busca si el objeto existe en el localStorage


    //window.onload = checkLocalStorage;
    submit.onclick = saveStudent;

})();


