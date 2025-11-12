let students = JSON.parse(localStorage.getItem('students')) || [
  {
    name: 'Иван',
    surname: 'Иванов',
    lastname: 'Иванович',
    birth: '2001-06-12',
    startYear: 2019,
    faculty: 'ИСиП'
  },
  {
    name: 'Пётр',
    surname: 'Петров',
    lastname: 'Петрович',
    birth: '2002-09-11',
    startYear: 2017,
    faculty: 'КСиК'
  },
];

function createAppTitle(titleText) {
  const title = document.createElement('h1');
  title.textContent = titleText;
  return title;
}

function createStudentForm() {
  const form = document.createElement('form');
  const surname = document.createElement('input');
  const name = document.createElement('input');
  const lastname = document.createElement('input');
  const birth = document.createElement('input');
  const startYear = document.createElement('input');
  const faculty = document.createElement('input');
  const button = document.createElement('button');

  surname.placeholder = 'Фамилия';
  name.placeholder = 'Имя';
  lastname.placeholder = 'Отчество';
  birth.type = 'date';
  startYear.type = 'number';
  startYear.placeholder = 'Год начала обучения';
  startYear.min = 2000;
  startYear.max = new Date().getFullYear();
  faculty.placeholder = 'Факультет';
  button.textContent = 'Добавить студента';

  form.classList.add('form');
  surname.classList.add('surname');
  name.classList.add('name');
  lastname.classList.add('lastname');
  birth.classList.add('birth');
  startYear.classList.add('startYear');
  faculty.classList.add('faculty');
  button.classList.add('btn');

  form.append(surname, name, lastname, birth, startYear, faculty, button);

  return {
    form,
    surname,
    name,
    lastname,
    birth,
    startYear,
    faculty,
    button,
  };
}

function createStudentTable() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const showButton = document.createElement('button');
  
  showButton.textContent = 'Добавить студента';
  showButton.classList.add('btn');
  showButton.classList.add('s_btn');

  table.classList.add('table');

  const headerRow = document.createElement('tr');
  const headers = ['ФИО', 'Факультет', 'Дата рождения и возраст', 'Годы обучения'];
  headers.forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.append(th);
  });

  thead.append(headerRow);
  table.append(thead);
  table.append(tbody);

  return { table, tbody, showButton };
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

function createStudentRow(student) {
  const row = document.createElement('tr');

  const fioCell = document.createElement('td');
  const facultyCell = document.createElement('td');
  const birthCell = document.createElement('td');
  const startCell = document.createElement('td');

  fioCell.textContent = `${student.surname} ${student.name} ${student.lastname}`;
  facultyCell.textContent = student.faculty;
  const age = calculateAge(student.birth);
  birthCell.textContent = `${formatDate(student.birth)} (${age} лет)`;
  startCell.textContent = `${student.startYear}-${student.startYear + 4}`;

  row.append(fioCell, facultyCell, birthCell, startCell);
  return row;
}

function checkingCorrectInput(formElements) {
  const surname = formElements.surname;
  const name = formElements.name;
  const lastname = formElements.lastname;
  const birth = formElements.birth;
  const startYear = formElements.startYear;
  const faculty = formElements.faculty;
  
  let isValid = true;

  [surname, name, lastname, birth, startYear, faculty].forEach(field => {
    field.style.background = '';
  });

  if (surname.value.trim() === '') {
    surname.style.background = 'red';
    isValid = false;
  }

  if (name.value.trim() === '') {
    name.style.background = 'red';
    isValid = false;
  }

  if (lastname.value.trim() === '') {
    lastname.style.background = 'red';
    isValid = false;
  }

  const birthDate = new Date(birth.value);
  const minDate = new Date('1900-01-01');
  const today = new Date();
  
  if (!birth.value || birthDate <= minDate || birthDate > today) {
    birth.style.background = 'red';
    isValid = false;
  }

  const startYearValue = parseInt(startYear.value);
  if (!startYear.value || startYearValue < 2000 || startYearValue > today.getFullYear()) {
    startYear.style.background = 'red';
    isValid = false;
  }

  if (faculty.value.trim() === '') {
    faculty.style.background = 'red';
    isValid = false;
  }

  return isValid;
}

function createStudentApp(students) {
  const container = document.createElement('div');
  document.body.append(container);

  const title = createAppTitle('Список студентов');
  const formElements = createStudentForm();
  const { table, tbody, showButton } = createStudentTable();

  container.append(title);
  container.append(formElements.form);
  container.append(table);
  container.append(showButton);

  table.style.display = 'none';
  showButton.style.display = 'none';

  function render() {
    tbody.innerHTML = '';
    students.forEach((student) => {
      const row = createStudentRow(student);
      tbody.append(row);
    });
  }

  formElements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!checkingCorrectInput(formElements)) {
      return;
    }

    const studentData = {
      surname: formElements.surname.value.trim(),
      name: formElements.name.value.trim(),
      lastname: formElements.lastname.value.trim(),
      birth: formElements.birth.value,
      startYear: parseInt(formElements.startYear.value),
      faculty: formElements.faculty.value.trim()
    };

    students.push(studentData);
    localStorage.setItem('students', JSON.stringify(students));

    table.style.display = 'table';
    formElements.form.style.display = 'none';
    showButton.style.display = 'block';

    console.log('Добавлен студент:', studentData);
    console.log('Текущий массив студентов:', students);

    render();
    formElements.form.reset();
  });

  showButton.addEventListener('click', () => {
    formElements.form.style.display = 'flex';
    showButton.style.display = 'none';
    table.style.display = 'none';
  });

  render();
}

document.addEventListener('DOMContentLoaded', () => {
  createStudentApp(students);
});