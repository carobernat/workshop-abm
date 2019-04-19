var name = document.getElementById('name')
var submit = document.getElementById('submit')
var dni = document.getElementById('dni')
var studentList = document.getElementById('student-list')
var IS_VALID = 'is-valid'
var IS_INVALID = 'is-invalid'
var nameIsValid = false
var dniIsValid = false

var disabledSubmit = function () {
    submit.disabled = !(nameIsValid && dniIsValid)
}

var validationClassName = function (validation) {
    return validation ? IS_VALID : IS_INVALID
}

var validateName = function () {
    nameIsValid = name.value
    name.classList.toggle(validationClassName(nameIsValid))
    disabledSubmit()
}

var validateDni = function () {
    var value = parseInt(dni.value, 10)
    dniIsValid = value && !isNaN(value) && value > 0 && dni.value.length === 8
    dni.classList.toggle(validationClassName(dniIsValid))
    disabledSubmit()
}

var removeClass = function (inputs) {
    inputs.forEach(function (input) {
        input.onclick = function (event) {
            event.target.value.clear
            event.target.classList.remove(IS_VALID, IS_INVALID)
        }
    })
}

var validateInputs = function (name, dni) {
    removeClass([name, dni])
    name.onblur = validateName
    dni.onblur = validateDni
}

validateInputs(name, dni)

submit.onclick = saveStudent;

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

// Guarda
function saveStudent(event) {
    event.preventDefault();
    var student = {
        firstName: "",
        lastName: "",
        dni: "",
        email: ""
    }

    student.firstName = name.value;
    student.dni = dni.value;

    studentList.appendChild(createStudentNode(student))
}




