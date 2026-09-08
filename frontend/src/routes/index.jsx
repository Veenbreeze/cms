import { Route, Routes } from 'react-router-dom'

import AppShell from '../components/layout/AppShell'
import PublicLayout from '../components/layout/PublicLayout'
import AboutPage from '../pages/AboutPage'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import AuditLogsPage from '../pages/AuditLogsPage'
import ContactPage from '../pages/ContactPage'
import DashboardPage from '../pages/DashboardPage'
import EventsPage from '../pages/EventsPage'
import FaqPage from '../pages/FaqPage'
import ForbiddenPage from '../pages/ForbiddenPage'
import GalleryPage from '../pages/GalleryPage'
import JumuiaDetailPage from '../pages/JumuiaDetailPage'
import JumuiaListPage from '../pages/JumuiaListPage'
import LandingPage from '../pages/LandingPage'
import LeadershipPage from '../pages/LeadershipPage'
import LoginPage from '../pages/LoginPage'
import MediaTeachingPage from '../pages/MediaTeachingPage'
import MemberCreatePage from '../pages/MemberCreatePage'
import MemberProfilePage from '../pages/MemberProfilePage'
import MembersPage from '../pages/MembersPage'
import MinistriesPage from '../pages/MinistriesPage'
import NotFoundPage from '../pages/NotFoundPage'
import NotificationsPage from '../pages/NotificationsPage'
import PrayerRequestPage from '../pages/PrayerRequestPage'
import ServantHistoryPage from '../pages/ServantHistoryPage'
import ServicesPage from '../pages/ServicesPage'
import SettingsPage from '../pages/SettingsPage'
import SongSheetPage from '../pages/SongSheetPage'
import SongsPage from '../pages/SongsPage'
import UsersPage from '../pages/UsersPage'
import WeeklyLessonsPage from '../pages/WeeklyLessonsPage'
import { ADMIN_ROLES, STAFF_ROLES } from '../utils/roles'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import { ROUTES } from './routePaths'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.MINISTRIES} element={<MinistriesPage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={ROUTES.MEDIA} element={<MediaTeachingPage />} />
        <Route path={ROUTES.LEADERSHIP} element={<LeadershipPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.PRAYER_REQUEST} element={<PrayerRequestPage />} />
        <Route path={ROUTES.FAQ} element={<FaqPage />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
      <Route path={ROUTES.songSheet()} element={<SongSheetPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
          <Route path={ROUTES.WEEKLY_LESSONS} element={<WeeklyLessonsPage />} />
          <Route path={ROUTES.SONGS} element={<SongsPage />} />
          <Route path={ROUTES.GALLERY} element={<GalleryPage />} />
          <Route path={ROUTES.EVENTS} element={<EventsPage />} />
          <Route path={ROUTES.SERVANT_HISTORY} element={<ServantHistoryPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

          <Route element={<RoleRoute allowedRoles={STAFF_ROLES} />}>
            <Route path={ROUTES.MEMBERS} element={<MembersPage />} />
            <Route path={ROUTES.MEMBER_NEW} element={<MemberCreatePage />} />
            <Route path={ROUTES.memberDetail()} element={<MemberProfilePage />} />
            <Route path={ROUTES.JUMUIA} element={<JumuiaListPage />} />
            <Route path={ROUTES.jumuiaDetail()} element={<JumuiaDetailPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={ADMIN_ROLES} />}>
            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path={ROUTES.AUDIT_LOGS} element={<AuditLogsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
