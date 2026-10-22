// Services API endpoints
const API_ENDPOINTS = {
  SERVICES: 'https://usps-spa.workflows.oktapreview.com/api/flo/c98a2e2cfc60ffa47b9144fffc722d55/invoke',
  ROLES: 'https://usps-spa.workflows.oktapreview.com/api/flo/bcb02e576a0cc92302df0f466a13b014/invoke?clientToken=fed407de2b292d402eef871e4331b99bc96513538d4ea1c071673fd09f2bc97b',
  SUBMIT: 'https://usps-spa.workflows.oktapreview.com/api/flo/7d790f5f4932b208cb96bf220a353a5c/invoke?clientToken=58ef7c99ee553fbec1fe5fdd3d7e57cc51e854eb13ce3731a352ef8a726dd408'
};

export const fetchServices = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.SERVICES, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to fetch services');
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchRoles = async (selectedValue) => {
  try {
    const response = await fetch(API_ENDPOINTS.ROLES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedValue)
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    const data = await response.json();
    return data.Rows || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const submitUserRole = async (organization, role, sub) => {
  try {
    const response = await fetch(API_ENDPOINTS.SUBMIT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organization,
        role,
        sub
      })
    });
    if (!response.ok) throw new Error('Failed to submit user role');
    return await response.json();
  } catch (error) {
    console.error('Error submitting user role:', error);
    throw error;
  }
};