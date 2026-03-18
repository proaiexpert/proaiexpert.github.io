(function () {
  'use strict';

  function getStorageItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function setStorageItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('[data-contact-form]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var startedField = form.querySelector('[data-form-started-at]');
      var feedback = form.querySelector('[data-form-feedback]');
      var submitButton = form.querySelector('button[type="submit"]');
      var cooldownKey = 'proai-contact-form-last-submit';
      var now = Date.now();
      var html = document.documentElement;
      var isRu = html && html.lang === 'ru';

      if (startedField) {
        startedField.value = String(now);
      }

      form.addEventListener('submit', function (event) {
        var current = Date.now();
        var startedAt = startedField ? Number(startedField.value || 0) : 0;
        var honeypot = form.querySelector('input[name="website"]');
        var lastSubmit = Number(getStorageItem(cooldownKey) || 0);
        var message = '';

        if (feedback) {
          feedback.textContent = '';
          feedback.classList.remove('is-error');
        }

        if (honeypot && honeypot.value.trim() !== '') {
          event.preventDefault();
          return;
        }

        if (!startedAt || (current - startedAt) < 4000) {
          message = isRu
            ? 'Пожалуйста, подождите несколько секунд и отправьте форму еще раз.'
            : 'Please wait a few seconds and submit the form again.';
        } else if (lastSubmit && (current - lastSubmit) < 30000) {
          message = isRu
            ? 'Форма уже была отправлена недавно. Пожалуйста, подождите около 30 секунд перед повторной отправкой.'
            : 'This form was submitted recently. Please wait about 30 seconds before sending it again.';
        }

        if (message) {
          event.preventDefault();
          if (feedback) {
            feedback.textContent = message;
            feedback.classList.add('is-error');
          }
          return;
        }

        setStorageItem(cooldownKey, String(current));
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('aria-disabled', 'true');
        }
      });
    });
  });
})();
