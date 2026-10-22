export const createLoadingSpinner = () => {
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border spinner-border-sm me-2';
  spinner.setAttribute('role', 'status');
  spinner.style.display = 'none';
  return spinner;
};