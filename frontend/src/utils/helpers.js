// src/utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateToDateString = (date) =>{
  const dateObject = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = dateObject.toLocaleDateString('en-US', options);
  return formattedDate
}


export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// src/utils/validators.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};