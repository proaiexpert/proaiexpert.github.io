const params = new URLSearchParams(location.search);
const concept = ['A','B','C'].includes((params.get('concept') || 'A').toUpperCase()) ? (params.get('concept') || 'A').toUpperCase() : 'A';
const isCapture = params.has('capture');

if (isCapture) {
  document.querySelector('.review-nav')?.remove();
  document.getElementById('runtime-status')?.remove();
}

for (const button of document.querySelectorAll('[data-concept]')) {
  const value = button.dataset.concept;
  button.setAttribute('aria-current', value === concept ? 'true' : 'false');
  button.addEventListener('click', () => {
    const next = new URL(location.href);
    next.search = '';
    next.searchParams.set('concept', value);
    location.href = next.toString();
  });
}
