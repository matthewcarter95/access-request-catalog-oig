export class SecondaryDropdown {
  constructor() {
    this.container = document.createElement('div');
    this.dropdown = document.createElement('select');
    this.setupDropdown();
  }

  setupDropdown() {
    this.container.className = 'mb-4';
    this.dropdown.className = 'form-select';
    this.dropdown.style.minWidth = '200px';
    this.dropdown.style.display = 'none';
    
    this.dropdown.addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      document.dispatchEvent(new CustomEvent('secondarySelection', {
        detail: { value: selectedValue }
      }));
    });
    
    const label = document.createElement('label');
    label.textContent = 'Select a role available for this org';
    label.className = 'form-label';
    
    this.container.appendChild(label);
    this.container.appendChild(this.dropdown);
  }

  updateOptions(values) {
    this.dropdown.innerHTML = '';
    this.dropdown.style.display = 'block';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a role...';
    this.dropdown.appendChild(defaultOption);
    
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      this.dropdown.appendChild(option);
    });
  }

  render() {
    return this.container;
  }
}