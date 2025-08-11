// validation.ts

// Function to validate individual fields when they lose focus

export const validateFieldOnBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  formData: any,
  validationRules: any,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  const { name } = e.target;
  const fieldErrors = validateForm(formData, validationRules);
  const displayName = validationRules[name]?.displayName || name; 
  setErrors((prevErrors: any) => ({
    ...prevErrors,
    [name]: fieldErrors[name]
      ? `${displayName} is required`  
      : "", 
  }));
};

// Function to validate the entire form
export const validateForm = (formData: any, validationRules: any) => {
  const errors: any = {};

  // Iterate over each field in the validation rules and check if it's required and empty
  for (const field in validationRules) {
    if (validationRules[field].required && !formData[field]) {
      errors[field] = true;  // Mark the field as invalid if it's empty
    } else {
      errors[field] = false; // Field is valid if it has a value
    }
  }

  return errors;
};

// Function to check if the "Save" button should be enabled or disabled
export const isSaveDisabled = (formData: any, validationRules: any) => {
  // Find the required fields that are empty in the form data
  const requiredFields = Object.keys(validationRules).filter(
    (field) => validationRules[field].required && !formData[field]
  );

  // Return true if there are any missing required fields, meaning the save button should be disabled
  return requiredFields.length > 0;
};


  
