export class SelectedValue {
  constructor() {
    this.container = document.createElement('div');
    this.valueDisplay = document.createElement('div');
    this.setupDisplay();
  }

  setupDisplay() {
    this.container.className = 'mt-4';
    this.valueDisplay.className = 'alert alert-info';
    this.valueDisplay.style.display = 'none';
    
    document.addEventListener('secondarySelection', (e) => {
      this.updateValue(e.detail.value);
    });
    
    this.container.appendChild(this.valueDisplay);
  }

  updateValue(value) {
    if (!value) {
      this.valueDisplay.style.display = 'none';
      return;
    }
    
    this.valueDisplay.textContent = `Selected value: ${value}`;
    this.valueDisplay.style.display = 'block';
  }

  render() {
    return this.container;
  }
}