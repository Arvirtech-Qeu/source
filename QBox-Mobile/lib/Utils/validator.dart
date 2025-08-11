
class Validator {

  static String? validate(String? value, List<ValidationRule> rules) {
    for (var rule in rules) {
      final error = rule(value);
      if (error != null) {
        return error;
      }
    }
    return null;
  }

  static ValidationRule required({String? message}) {
    return (String? value) {
      if (value == null || value.isEmpty) {
        return message ?? 'This field is required';
      }
      return null;
    };
  }

  static ValidationRule minLength(int length, {String? message}) {
    return (String? value) {
      if (value == null || value.length < length) {
        return message ?? 'Must be at least $length characters long';
      }
      return null;
    };
  }

  static ValidationRule maxLength(int length, {String? message}) {
    return (String? value) {
      if (value != null && value.length > length) {
        return message ?? 'Must be at most $length characters long';
      }
      return null;
    };
  }

  static ValidationRule email({String? message}) {
    return (String? value) {
      if (value == null || value.isEmpty) return null;
      final emailRegExp = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
      if (!emailRegExp.hasMatch(value)) {
        return message ?? 'Enter a valid email address';
      }
      return null;
    };
  }

  static ValidationRule password({int minLength = 8, bool requireSpecialChar = true, bool requireNumber = true, String? message}) {
    return (String? value) {
      if (value == null || value.isEmpty) return null;
      if (value.length < minLength) {
        return 'Password must be at least $minLength characters long';
      }
      if (requireSpecialChar && !value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
        return 'Password must contain at least one special character';
      }
      if (requireNumber && !value.contains(RegExp(r'[0-9]'))) {
        return 'Password must contain at least one number';
      }
      return null;
    };
  }

  static ValidationRule numbersOnly({String? message}) {
    return (String? value) {
      if (value == null || value.isEmpty) return null;
      if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
        return message ?? 'Only numbers are allowed';
      }
      return null;
    };
  }

  static ValidationRule match(String matchValue, {String? message}) {
    return (String? value) {
      if (value != matchValue) {
        return message ?? 'Values do not match';
      }
      return null;
    };
  }
}

typedef ValidationRule = String? Function(String?);

