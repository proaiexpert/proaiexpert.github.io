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
      var sendingLabel = isRu ? '\u041e\u0442\u043f\u0440\u0430\u0432\u043b\u044f\u0435\u043c\u2026' : 'Sending...';

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
          feedback.classList.remove('is-error', 'is-success');
        }

        if (honeypot && honeypot.value.trim() !== '') {
          event.preventDefault();
          return;
        }

        if (!startedAt || current - startedAt < 4000) {
          message = isRu
            ? '\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0441\u0435\u043a\u0443\u043d\u0434 \u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u0444\u043e\u0440\u043c\u0443 \u0435\u0449\u0435 \u0440\u0430\u0437.'
            : 'Please wait a few seconds and submit the form again.';
        } else if (lastSubmit && current - lastSubmit < 30000) {
          message = isRu
            ? '\u0424\u043e\u0440\u043c\u0430 \u0443\u0436\u0435 \u0431\u044b\u043b\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430 \u043d\u0435\u0434\u0430\u0432\u043d\u043e. \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435 \u043e\u043a\u043e\u043b\u043e 30 \u0441\u0435\u043a\u0443\u043d\u0434 \u043f\u0435\u0440\u0435\u0434 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u0439 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u043e\u0439.'
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
          if (!submitButton.dataset.originalLabel) {
            submitButton.dataset.originalLabel = submitButton.textContent;
          }
          submitButton.textContent = sendingLabel;
          submitButton.disabled = true;
          submitButton.setAttribute('aria-disabled', 'true');
          submitButton.setAttribute('aria-busy', 'true');
        }
      });
    });
  });
})();
