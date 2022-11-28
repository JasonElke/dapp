import { FC } from 'react';
import EN_TRANSLATE_KEYS from './EN';
import VN_TRANSLATE_KEYS from './VN';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';

export const localeConfig = {
  EN: EN_TRANSLATE_KEYS,
  VN: VN_TRANSLATE_KEYS,
};

type Id = keyof typeof EN_TRANSLATE_KEYS;

interface Props extends MessageDescriptor {
  id: Id;
}

export const LocaleFormatter: FC<Props> = ({ ...props }) => {
  const notChildProps = { ...props, children: undefined };

  return <FormattedMessage {...notChildProps} id={props.id} />;
};

type FormatMessageProps = (descriptor: Props, values?: any) => string;

export const useLocale = () => {
  const { formatMessage: _formatMessage, ...rest } = useIntl();
  const formatMessage: FormatMessageProps = _formatMessage;

  return {
    ...rest,
    formatMessage,
  };
};
