/* eslint-disable no-useless-escape */
const REGEX_COMMON = {
  postalCode: /^(\d{7}|\d{3}-\d{4})$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  phoneNumber: /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
  fax: /^(\+?\d{1,}(\s?|\-?)\d*(\s?|\-?)\(?\d{2,}\)?(\s?|\-?)\d{3,}\s?\d{3,})$/,
  number: /^[0-9][0-9]*([.][0-9]{2}|)$/,
  url: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  stringNumeric: /^-?\d+$/,
  time: /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/,
  hexaDecimal: /^0x[A-F0-9]+$/i,
  serialNumber: /^[0-9]{16}$/,
  yyyymmddhhmmss: /([0-9]{4})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9])/g,
  identityRegex: /^[0-9]{12}$|^[0-9]{9}$/,
  numberAndLetter: /^[a-zA-Z0-9]*$/,
  numberAndLetterUpper: /^[A-Z0-9]*$/,
  letterUpperCase: /^[A-Z\s]*$/,
  nonSpace: /^\S*$/,
  decimal: /^\d*\.?\d*$/,
};

export { REGEX_COMMON };
