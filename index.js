const FIELDS = [
  {
    name: 'fio',
    pattern: /^([a-zA-Zа-яА-ЯёЁäöüß]+\s){2}[a-zA-Zа-яА-ЯёЁäöüß]+$/
  },
  {
    name: 'email',
    pattern: /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(yandex.(ru|ua|by|ua|kz|com)|ya.ru)$/
  },
  {
    name: 'phone',
    pattern: /^[\+]7[\(]\d{3}[\)]\d{3}[\-]\d{2}[\-]\d{2}$/
  }
];

function checkPattern(str, pattern) {
  if (pattern) {
    return !!str.match(new RegExp(pattern));
  }
  return true;
}

const MyForm = {
  form: document.getElementById("myForm"),
  formElements: document.getElementById("myForm").elements,
  validate: function () {
    const validationState = {
      isValid: true,
      errorFields: []
    };
    const data = this.getData();
    FIELDS.forEach((field) => {
      if (!checkPattern(data[field.name], field.pattern) ||
      (field.name === 'phone' && this.customPhoneValidation(data[field.name]))) {
        validationState.isValid = false;
        validationState.errorFields.push(field.name);
      }
    });
    return validationState;
  },
  getData: function () {
    const data = {};
    FIELDS.forEach((field) => {
      data[field.name] = this.formElements[field.name].value;
    });
    return data;
  },
  setData: function (data) {
    FIELDS.forEach((field) => {
      this.formElements[field.name].value = data[field.name];
    });
  },
  submit: function () {
    this.resetError()
    const validationResult = this.validate();
    if (validationResult.isValid) {
      document.getElementById('submitButton').disabled = true;
      this.makeRequest();
    } else {
      validationResult.errorFields.forEach((name) => {
        this.formElements[name].className += "error";
      })
    }
  },
  resetError() {
    FIELDS.forEach((field) => {
      this.formElements[field.name].className = '';
    });
  },
  customPhoneValidation: function (val) {
    const sum = val.replace(/[()\-\+]/g, '').split('').reduce((prev, curren) => {
      return prev + (+curren);
    }, 0);
    return sum > 30;
  },
  showResult: function(data){
    const result = document.getElementById('resultContainer');
    result.className = '';
    switch (data.status) {
      case 'success':
        result.className = 'success';
        result.innerHTML = 'Success';
        break;
      case 'error':
        result.className = 'error';
        result.innerHTML = data.reason;
        break;
      case 'progress':
        result.className = 'progress';
        setTimeout(() => {
          this.makeRequest();
        }, data.timeout);
        break;
      default:
      result.className = 'error';
      result.innerHTML = 'Unexpected error';
      break;
    }
  },
  makeRequest: async function() {
    const url = this.form.action;
    try {
      const response = await fetch(url);
      this.showResult(await response.json());
    } catch (e) {
      console.error(e);
    }
  }
}
