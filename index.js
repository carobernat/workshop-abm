(function() {
    var firstName = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var email = document.getElementById('email');
    var submit = document.getElementById('submit');
    var deleteBtn = document.getElementById('delete');
    var deleteInput = document.getElementById('delete-dni');
    var searchBtn = document.getElementById('search-btn');
    var searchInput = document.getElementById('search-input');
    var dni = document.getElementById('dni');
    var studentList = document.getElementById('student-list')
    var IS_VALID = 'is-valid';
    var IS_INVALID = 'is-invalid';
    var nameIsValid = false;
    var dniIsValid = false;
    var emailIsValid = false;

    // Activa el súbmit sólo cuando nombre y dni sean válidos
    function disabledSubmit() {
        submit.disabled = !(nameIsValid && dniIsValid && emailIsValid);
    }

    // Valida la clase de boostrap tomando como parámetro el booleano de la validación de los campos
    function classnameValidation(validation) {
        return validation ? IS_VALID : IS_INVALID;
    }

    // Valida el campo nombre, modifica la clase según el resultado y activa el submit si corresponde
    function validateName() {
        nameIsValid = firstName.value && firstName.value.length >= 3;
        firstName.classList.toggle(classnameValidation(nameIsValid));
        disabledSubmit();
    }

    // Valida el campo nombre, modifica la clase según el resultado y activa el submit si corresponde
    function validateDni() {
        var value = parseInt(dni.value, 10);
        dniIsValid = value && !isNaN(value) && value > 0 && dni.value.length === 8;
        dni.classList.toggle(classnameValidation(dniIsValid));
        disabledSubmit();
    }

    // Valida el campo email, modifica la clase según el resultado y activa el submit si corresponde
    function validateEmail(event){
        var emailNode =  event.target;
        emailIsValid = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(emailNode.value));
        email.classList.toggle(classnameValidation(emailIsValid));
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

    function validateInputs(name, dni, email) {
        removeClass([name, dni, email]);
        firstName.onblur = validateName;
        dni.onblur = validateDni;
        email.onblur = validateEmail;
    }

    // Chequea si existen estudiantes en el localstorage y de ser así, los muestra
    function checkLocalStorage(){
        if(localStorage.getItem('students')){
            var studentObject = JSON.parse(localStorage.getItem('students'));
            return studentObject
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

    // Constructora de objeto student
    function Student(firstName, lastName, dni, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.email = email;
    }

    // Chequea en el localstorage si hay students, si no, crea una lista vacía. Le pushea el newStudent a la lista, elimina
    // el objeto vacío y guarda la lista en el localstorage. Imprime la lista en pantalla.
    function createStudent(event) {
        event.preventDefault();
        var newStudent = new Student(firstName.value, lastName.value, dni.value, email.value);
        var currentStudents = checkLocalStorage() || [''];
        currentStudents.push(newStudent);
        currentStudents[0] === '' ? currentStudents.splice(0, 1) : null; // esto es una terrible negrada de mike.
        saveStudentsList(currentStudents)
    }

    function saveStudentsList(list) {
        localStorage.setItem('students', JSON.stringify(list));
        printStudentsData();
    }

    // Cuando la lista se actualiza, limpia la lista impresa y la vuelve a imprimir empezando por lo más nuevo
    function printStudentsData(data = checkLocalStorage()) { // Define un valor por defecto para el parámetro, en este caso una función. Si se pasa param, lo sobreescribe
        studentList.innerHTML = '';
        if(data) {
            data.reverse().forEach(function (e) {
                studentList.appendChild(createStudentNode(e));
            })
        }
    }

    // Busca coincidencias en el dni y si encuentra un match lo borra, refresca la lista y la imprime
    function deleteStudent(e){
        e.preventDefault();
        var students = checkLocalStorage()
        for (var i = students.length -1; i >= 0 ; i--) { // Para eliminar, conviene el for en reversa para evitar errores
            if(students[i].dni === deleteInput.value) {
                students.splice(i,1);
                saveStudentsList(students);
            }
        }
    }

    // Busca coinicidencias en nombre y apellido y muestra la lista
    function searchStudent() {
        var query = searchInput.value.toUpperCase();
        var students = checkLocalStorage();
        var results = [];
        for (var i = 0; i < students.length; i++) {
            var base = students[i].firstName.concat(students[i].lastName).toUpperCase();
            if(base.indexOf(query) !== -1) {
                results.push(students[i])
            }
        }
        printStudentsData(results);
    }


    validateInputs(firstName, dni, email);
    submit.onclick = createStudent;
    deleteBtn.onclick = deleteStudent;
    searchBtn.onclick = searchStudent;

    // Cuando carga el DOM, chequea el contenido del localstorage y muestra lo que contenga en pantalla
    document.addEventListener("DOMContentLoaded", function(event) {
        checkLocalStorage();
        printStudentsData();
    });

})();


