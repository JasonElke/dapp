export enum EventStatus {
  todo = 'rgba(255,255,255,0.65)',
  urgent = '#f5222d',
  doing = '#faad14',
  processing = '#1890ff',
}

interface Base {
  type: 'message' | 'notification' | 'event';
  id: string;
  title: string;
}

export interface Notification extends Base {
  type: 'notification';
  read?: boolean;
  avatar: string;
  datetime: string;
}

export interface Message extends Base {
  type: 'message';
  read?: boolean;
  avatar: string;
  datetime: string;
  description: string;
  clickClose: boolean;
}

export interface Event extends Base {
  type: 'event';
  description: string;
  extra: string;
  status: keyof typeof EventStatus;
}

type Notices = Notification | Message | Event;

export type Notice<T extends Notices['type'] | 'all' = 'all'> = T extends 'all'
  ? Notices
  : Extract<Notices, { type: T }>;
