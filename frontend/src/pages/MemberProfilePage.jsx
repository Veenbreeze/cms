import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Avatar, Badge, Button, Modal, Spinner, Tabs } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import MemberEditForm from '../features/members/MemberEditForm'
import DocumentsTab from '../features/members/MemberProfile/DocumentsTab'
import HistoryTab from '../features/members/MemberProfile/HistoryTab'
import OverviewTab from '../features/members/MemberProfile/OverviewTab'
import ParticipationTab from '../features/members/MemberProfile/ParticipationTab'
import SpiritualJourneyTab from '../features/members/MemberProfile/SpiritualJourneyTab'
import { ROUTES } from '../routes/routePaths'
import { getErrorDetail } from '../services/api/apiError'
import { deactivateMember, getMember } from '../services/api/memberService'
import { listJumuia } from '../services/api/jumuiaService'
import { isAdminRole } from '../utils/roles'

export default function MemberProfilePage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [member, setMember] = useState(null)
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditOpen, setIsEditOpen] = useState(false)

  const loadMember = () => getMember(id).then(setMember)

  useEffect(() => {
    loadMember()
    listJumuia().then((res) => setJumuiaOptions(res.results))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!member) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={28} />
      </div>
    )
  }

  const tabs = [
    { value: 'overview', label: t('members.tabs.overview') },
    { value: 'spiritual', label: t('members.tabs.spiritualJourney') },
    { value: 'participation', label: t('members.tabs.participation') },
    { value: 'documents', label: t('members.tabs.documents') },
    { value: 'history', label: t('members.tabs.history') },
  ]

  const handleDeactivate = async () => {
    if (!window.confirm(t('members.deactivateConfirm'))) return
    try {
      await deactivateMember(member.id)
      showToast({ type: 'success', message: t('common.success') })
      navigate(ROUTES.MEMBERS)
    } catch (error) {
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
    }
  }

  return (
    <div className="space-y-6">
      <Link to={ROUTES.MEMBERS} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-700 dark:text-neutral-400">
        <ArrowLeft className="h-4 w-4" />
        {t('members.title')}
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={member.profile_photo} name={member.full_name} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{member.full_name}</h1>
              <Badge variant={member.is_active ? 'success' : 'neutral'}>{member.is_active ? t('common.active') : t('common.inactive')}</Badge>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {member.member_no} &middot; {member.jumuia_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            {t('common.edit')}
          </Button>
          {isAdminRole(user?.role) && (
            <Button variant="danger" onClick={handleDeactivate}>
              {t('common.delete')}
            </Button>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'overview' && <OverviewTab member={member} />}
        {activeTab === 'spiritual' && <SpiritualJourneyTab member={member} onRefresh={loadMember} />}
        {activeTab === 'participation' && <ParticipationTab />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('common.edit')} size="lg">
        <MemberEditForm
          member={member}
          jumuiaOptions={jumuiaOptions}
          onSaved={(updated) => {
            setMember((current) => ({ ...current, ...updated }))
            setIsEditOpen(false)
          }}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  )
}
