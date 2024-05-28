import type { MenuProps } from 'antd';
const leftBarMenu: MenuProps['items'] = [
  {
    key: 'online',
    label: 'CỔNG TRỰC TUYẾN',
    type: 'group',
    children: [
      {
        key: 'leftbar-examp',
        icon: '',
        label: 'Cuộc Thi',
      }
    ]
  },
  {
    key: 'contents',
    label: 'KHO NỘI DUNG',
    type: 'group',
    children: [
      {
        key: 'examp',
        icon: '',
        label: 'Đề Thi',
      },
      {
        key: 'news',
        icon: '',
        label: 'Tin Tức',
      }
    ]
  }
];

export default leftBarMenu;
