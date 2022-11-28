export interface IMenuItem {
  code?: string;
  label?: {
    en: string;
  };
  icon?: number;
  path?: string;
  children?: IMenuItem[];
  name?: string;
  module?: any;
  feature?: any;
}

export type MenuChild = Omit<IMenuItem, 'children'>;

export type MenuList = IMenuItem[];
