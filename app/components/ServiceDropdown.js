import { SecondaryDropdown } from './SecondaryDropdown';
import { SelectedValue } from './SelectedValue';
import { createLoadingSpinner } from '../utils/uiHelpers';
import {
  fetchServices,
  fetchRoles,
  submitUserRole,
} from '../services/apiService';
import { authState } from '../providers';

export class ServiceDropdown {
  constructor() {
    this.dropdownContainer = document.createElement('div');
    this.dropdown = document.createElement('select');
    this.loadingSpinner = createLoadingSpinner();
    this.secondaryDropdown = new SecondaryDropdown();
    this.selectedValue = new SelectedValue();
    this.selectedOrg = '';

    this.setupDropdown();
    this.initializeServices();
    this.setupEventListeners();
  }

  setupDropdown() {
    this.dropdownContainer.className = 'mb-4';
    this.dropdown.className = 'form-select mb-3';
    this.dropdown.style.minWidth = '200px';

    const label = document.createElement('label');
    label.textContent = 'Select a Service';
    label.className = 'form-label';

    this.dropdownContainer.appendChild(label);
    this.dropdownContainer.appendChild(this.dropdown);
    this.dropdownContainer.appendChild(this.loadingSpinner);
    this.dropdownContainer.appendChild(this.secondaryDropdown.render());
    this.dropdownContainer.appendChild(this.selectedValue.render());
  }

  setupEventListeners() {
    this.dropdown.addEventListener('change', (e) => this.handleSelection(e));

    document.addEventListener('secondarySelection', async (e) => {
      const role = e.detail.value;
      if (role && this.selectedOrg && authState.accessToken) {
        try {
          const decodedToken = JSON.parse(
            atob(authState.accessToken.split('.')[1])
          );
          await submitUserRole(this.selectedOrg, role, decodedToken.uid);
        } catch (error) {
          console.error('Error submitting role:', error);
        }
      }
    });
  }

  async initializeServices() {
    try {
      this.loadingSpinner.style.display = 'inline-block';
      const services = await fetchServices();

      this.dropdown.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select an organization...';
      this.dropdown.appendChild(defaultOption);

      services.forEach((service) => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = service;
        this.dropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error initializing services:', error);
    } finally {
      this.loadingSpinner.style.display = 'none';
    }
  }

  async handleSelection(event) {
    const selectedValue = event.target.value;
    this.selectedOrg = selectedValue;

    if (!selectedValue) return;

    try {
      this.loadingSpinner.style.display = 'inline-block';
      this.dropdown.disabled = true;

      const roles = await fetchRoles(selectedValue);
      this.secondaryDropdown.updateOptions(roles);
    } catch (error) {
      console.error('Error handling selection:', error);
    } finally {
      this.loadingSpinner.style.display = 'none';
      this.dropdown.disabled = false;
    }
  }

  render() {
    return this.dropdownContainer;
  }
}
