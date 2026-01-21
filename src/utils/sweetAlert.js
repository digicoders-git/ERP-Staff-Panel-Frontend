// Simple alert functions without SweetAlert dependency
export const showSuccess = async (title, message) => {
  alert(`${title}: ${message}`);
  return Promise.resolve();
};

export const showError = async (title, message) => {
  alert(`Error - ${title}: ${message}`);
  return Promise.resolve();
};

export const showConfirm = async (title, message) => {
  const result = confirm(`${title}\n${message}`);
  return Promise.resolve({ isConfirmed: result });
};

export const showWarning = async (title, message) => {
  alert(`Warning - ${title}: ${message}`);
  return Promise.resolve();
};

export const showToast = (type, message) => {
  alert(`${type.toUpperCase()}: ${message}`);
};