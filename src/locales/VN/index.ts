import { ERRORS } from './errors';
import { VALIDATIONS } from './validations';
import { PAGE_LOGIN } from './pages/login';

const TRANSLATE_KEYS = {
  ...ERRORS,
  ...VALIDATIONS,
  ...PAGE_LOGIN,
};

export default TRANSLATE_KEYS;
