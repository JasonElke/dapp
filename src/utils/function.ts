import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

const formatMoney = (value: number, fixed = 3) => {
  if (!+value) return '0';

  const number = `${value}`;
  const x = number.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1].slice(0, fixed)}` : '';
  const rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
};

const stringToASCII = (str: string) => {
  try {
    return str
      .replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
      .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
      .replace(/[đ]/g, 'd')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
      .replace(/[ùúủũụưừứửữự]/g, 'u')
      .replace(/[ỳýỷỹỵ]/g, 'y');
  } catch {
    return '';
  }
};

const getTimeZone = () => {
  return -(new Date().getTimezoneOffset() / 60);
};

const formatHash = (value: string) =>
  value ? `${value.slice(0, 5)}...${value.slice(value.length - 4, value.length)}` : '';

const formatAddress = (value: string) =>
  value ? `${value.slice(0, 5)}...${value.slice(value.length - 4, value.length)}` : '';

const parseBalance = (value: any, decimal?: any) => {
  const pow = new BigNumber(10).pow(18);

  return new BigNumber(value.toString())
    .dividedBy(pow)
    .dp(decimal || 4)
    .toString();
};

const encodeParameters = (types: any, values: any) => {
  const abi = new ethers.utils.AbiCoder();

  return abi.encode(types, values);
};

export { formatMoney, stringToASCII, getTimeZone, formatHash, formatAddress, parseBalance, encodeParameters };
