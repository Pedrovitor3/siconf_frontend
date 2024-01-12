import { CalendarOutlined, DesktopOutlined } from '@ant-design/icons';
import { perfisSistema } from '../../configs/sistemaConfig';

export const menus = [
  /*{
    label: 'Dashboard',
    key: '1',
    icon: <DesktopOutlined />,
    link: '/dashboard',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Teste',
    key: '2',
    icon: <ExperimentOutlined />,
    perfis: [perfisSistema.ALL],
    link: '',
    children: [
      {
        label: 'Teste 1',
        key: '3',
        icon: <PaperClipOutlined />,
        link: '/teste',
        perfis: [perfisSistema.ALL],
      },
    ],
  },*/
  {
    label: 'Frequência',
    key: '2',
    icon: <CalendarOutlined />,
    link: '/dashboard',
    perfis: [perfisSistema.ALL],
    children: [],
  },
];
