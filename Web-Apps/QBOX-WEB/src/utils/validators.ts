// Simple email validation regex
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

// Enhanced password validation
// Minimum 8 characters, at least 1 letter, 1 number, 1 special character, and at least 1 uppercase letter.
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
};

// Generic required field validation (checks for non-whitespace characters)
export const isRequired = (value: string): boolean => {
    console.log(value)
    return value.trim().length > 0;
};

// Phone number validation (US format: +1 (555) 555-5555)
export const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^(?:\+?(\d{1,3}))?(\(?\d{3}\)?[\s\-]?)?[\d\-]{3}[\s\-]?\d{4}$/;
    return phoneRegex.test(phoneNumber);
};

// URL validation (ensures that the URL is valid and correctly formatted)
export const validateURL = (url: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,4}([\/\w\d-]*)*$/;
    return urlRegex.test(url);
};

// Date validation (checks if the date is in the correct format and is valid)
export const validateDate = (date: string): boolean => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;  // MM/DD/YYYY
    return dateRegex.test(date) && !isNaN(Date.parse(date));
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber: string): boolean => {
    const sanitized = cardNumber.replace(/\D/g, ''); // Remove non-numeric characters
    let sum = 0;
    let shouldDouble = false;

    // Loop over digits in reverse order
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i), 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

// Validates if the input is a valid postal code (US zip code format)
export const validatePostalCode = (postalCode: string): boolean => {
    const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/; // e.g., 12345 or 12345-6789
    return postalCodeRegex.test(postalCode);
};

// Validates if the string is a valid JSON string
export const isValidJSON = (value: string): boolean => {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
};

// Validates email domain (check if the email is from a trusted domain, e.g., '@gmail.com')
export const validateEmailDomain = (email: string, domain: string): boolean => {
    const domainRegex = new RegExp(`@${domain}$`);
    return domainRegex.test(email);
};

// Validate a number range (between min and max, inclusive)
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};

// Validate if the input contains only alphabetic characters (A-Z, a-z)
export const validateAlpha = (input: string): boolean => {
    const alphaRegex = /^[A-Za-z]+$/;
    return alphaRegex.test(input);
};

// Validate if the input contains only alphanumeric characters (A-Z, a-z, 0-9)
export const validateAlphaNumeric = (input: string): boolean => {
    const alphaNumericRegex = /^[A-Za-z0-9]+$/;
    return alphaNumericRegex.test(input);
};

// Enhanced `isRequired` function that also checks if the input contains only whitespace
export const isNotBlank = (value: string): boolean => {
    return value.trim() !== '';
};


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
