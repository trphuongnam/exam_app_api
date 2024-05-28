import type { MenuProps } from 'antd';
export const menus: MenuProps['items'] = [
  {
    label: 'How it works?',
    key: 'home',
    icon: '',
    disabled: true
  },
  {
    label: 'Features',
    key: 'features',
    icon: '',
    disabled: true
  },
  {
    label: 'About us',
    key: 'about',
    icon: '',
    disabled: true
  }
];

export const loginMenu: MenuProps['items'] = [
  {
    label: 'Login',
    key: 'login',
    icon: '',
  }
]

export const logoutMenu: MenuProps['items'] = [
  {
    label: 'Logout',
    key: 'logout',
    icon: '',
  }
]
