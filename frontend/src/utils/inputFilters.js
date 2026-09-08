// Key codes allowed universally for navigation
const CONTROL_KEYS = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

export const filterNameKeyDown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  // Allow letters and space only
  if (!/^[A-Za-z ]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeNameInput = (val) => {
  return val.replace(/[^A-Za-z ]/g, '');
};

export const filterPhoneKeyDown = (e, currentValue) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  // Block non-digits
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    return;
  }
  // Max 10 digits
  if (currentValue && currentValue.length >= 10) {
    e.preventDefault();
  }
};

export const sanitizePhoneInput = (val) => {
  const digitsOnly = val.replace(/[^0-9]/g, '');
  return digitsOnly.slice(0, 10);
};

export const filterStudentIdKeyDown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[A-Za-z0-9-]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeStudentIdInput = (val) => {
  return val.replace(/[^A-Za-z0-9-]/g, '');
};

export const filterSearchKeyDown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[A-Za-z0-9 @.-]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeSearchInput = (val) => {
  return val.replace(/[^A-Za-z0-9 @.-]/g, '');
};

export const filterSubjectKeyDown = (e) => {
  if (CONTROL_KEYS.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[A-Za-z0-9 ]$/.test(e.key)) {
    e.preventDefault();
  }
};

export const sanitizeSubjectInput = (val) => {
  const sanitized = val.replace(/[^A-Za-z0-9 ]/g, '');
  return sanitized.slice(0, 100);
};

