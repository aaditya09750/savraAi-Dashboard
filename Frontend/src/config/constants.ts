import { Icons } from '../components/ui/Icon';
import { NavItem } from '../types';

export const NAVIGATION_ITEMS: NavItem[] = [
  { icon: Icons.LayoutGrid, label: 'Dashboard', path: '/' },
  { icon: Icons.Users, label: 'Teachers', path: '/teachers' },
  { icon: Icons.School, label: 'Classrooms', path: '/classrooms' },
  { icon: Icons.FileText, label: 'Reports', path: '/reports' },
];

export const APP_CONFIG = {
  APP_NAME: 'SAVRA',
  USER_NAME: 'Savra Admin',
  USER_ROLE: 'ADMIN',
  USER_INITIALS: 'SR',
};
