import {
  Bell,
  BookOpen,
  Calendar,
  History,
  HandHeart,
  Image,
  LayoutDashboard,
  Megaphone,
  Music,
  ScrollText,
  Settings,
  Shield,
  UsersRound,
} from 'lucide-react'

import { ROUTES } from '../../routes/routePaths'
import { ADMIN_ROLES, ALL_ROLES, STAFF_ROLES } from '../../utils/roles'

export const SIDEBAR_ITEMS = [
  { key: 'dashboard', labelKey: 'nav.dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, roles: STAFF_ROLES },
  { key: 'members', labelKey: 'nav.members', path: ROUTES.MEMBERS, icon: UsersRound, roles: STAFF_ROLES },
  { key: 'jumuia', labelKey: 'nav.jumuia', path: ROUTES.JUMUIA, icon: UsersRound, roles: STAFF_ROLES },
  { key: 'announcements', labelKey: 'nav.announcements', path: ROUTES.ANNOUNCEMENTS, icon: Megaphone, roles: ALL_ROLES },
  { key: 'weeklyLessons', labelKey: 'nav.weeklyLessons', path: ROUTES.WEEKLY_LESSONS, icon: BookOpen, roles: ALL_ROLES },
  { key: 'songs', labelKey: 'nav.songs', path: ROUTES.SONGS, icon: Music, roles: ALL_ROLES },
  { key: 'gallery', labelKey: 'nav.gallery', path: ROUTES.GALLERY, icon: Image, roles: ALL_ROLES },
  { key: 'events', labelKey: 'nav.events', path: ROUTES.EVENTS, icon: Calendar, roles: ALL_ROLES },
  { key: 'servantsHistory', labelKey: 'nav.servantsHistory', path: ROUTES.SERVANT_HISTORY, icon: History, roles: ALL_ROLES },
  { key: 'notifications', labelKey: 'nav.notifications', path: ROUTES.NOTIFICATIONS, icon: Bell, roles: ALL_ROLES },
  { key: 'prayerRequests', labelKey: 'nav.prayerRequests', path: ROUTES.PRAYER_REQUESTS, icon: HandHeart, roles: ADMIN_ROLES },
  { key: 'users', labelKey: 'nav.usersRoles', path: ROUTES.USERS, icon: Shield, roles: ADMIN_ROLES },
  { key: 'auditLogs', labelKey: 'nav.auditLogs', path: ROUTES.AUDIT_LOGS, icon: ScrollText, roles: ADMIN_ROLES },
  { key: 'settings', labelKey: 'nav.settings', path: ROUTES.SETTINGS, icon: Settings, roles: ADMIN_ROLES },
]
