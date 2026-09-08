import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button, Card, CardBody } from '../../../components/ui'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { getErrorDetail, getFieldErrors } from '../../../services/api/apiError'
import { listJumuia } from '../../../services/api/jumuiaService'
import { createMember, uploadMemberPhoto } from '../../../services/api/memberService'
import { ROUTES } from '../../../routes/routePaths'
import { JUMUIA_SCOPED_ROLES } from '../../../utils/roles'
import { cn } from '../../../utils/cn'
import ChurchInfoStep from './steps/ChurchInfoStep'
import ContactStep from './steps/ContactStep'
import PersonalInfoStep from './steps/PersonalInfoStep'
import PhotoUploadStep from './steps/PhotoUploadStep'
import ReviewStep from './steps/ReviewStep'

const INITIAL_VALUES = {
  full_name: '',
  gender: '',
  date_of_birth: '',
  phone: '',
  email: '',
  residential_address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  jumuia: '',
  date_joined_church: '',
  photoFile: null,
}

export default function MemberFormWizard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const isJumuiaLocked = JUMUIA_SCOPED_ROLES.includes(user?.role)
  const [values, setValues] = useState(() => ({ ...INITIAL_VALUES, jumuia: isJumuiaLocked ? user.jumuia : '' }))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [jumuiaOptions, setJumuiaOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listJumuia().then((res) => setJumuiaOptions(res.results))
  }, [])

  const steps = useMemo(
    () => [
      { titleKey: 'members.wizard.step1Title', component: PersonalInfoStep, isValid: () => values.full_name && values.gender },
      { titleKey: 'members.wizard.step2Title', component: ContactStep, isValid: () => true },
      { titleKey: 'members.wizard.step3Title', component: ChurchInfoStep, isValid: () => isJumuiaLocked || !!values.jumuia },
      { titleKey: 'members.wizard.step4Title', component: PhotoUploadStep, isValid: () => true },
      { titleKey: 'members.wizard.step5Title', component: ReviewStep, isValid: () => true },
    ],
    [values.full_name, values.gender, values.jumuia, isJumuiaLocked]
  )

  const handleChange = (field, value) => setValues((current) => ({ ...current, [field]: value }))

  const goNext = () => setStep((current) => Math.min(current + 1, steps.length - 1))
  const goBack = () => setStep((current) => Math.max(current - 1, 0))

  const handleSubmit = async () => {
    setErrors({})
    setIsSubmitting(true)
    try {
      const payload = {
        full_name: values.full_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth || null,
        phone: values.phone,
        email: values.email,
        residential_address: values.residential_address,
        emergency_contact_name: values.emergency_contact_name,
        emergency_contact_phone: values.emergency_contact_phone,
        jumuia: values.jumuia || undefined,
        date_joined_church: values.date_joined_church || null,
      }
      const member = await createMember(payload)
      if (values.photoFile) {
        await uploadMemberPhoto(member.id, values.photoFile)
      }
      showToast({ type: 'success', message: t('common.success') })
      navigate(ROUTES.memberDetail(member.id))
    } catch (error) {
      setErrors(getFieldErrors(error))
      showToast({ type: 'error', message: getErrorDetail(error, t('common.error')) })
      setStep(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepComponent = steps[step].component
  const jumuiaName = isJumuiaLocked
    ? user?.jumuia_name
    : jumuiaOptions.find((j) => j.id === values.jumuia)?.name

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{t('members.addMember')}</h1>

      <div className="flex items-center gap-2">
        {steps.map((s, index) => (
          <div key={s.titleKey} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                index < step
                  ? 'bg-primary-600 text-white'
                  : index === step
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
              )}
            >
              {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </div>
            {index < steps.length - 1 && <div className={cn('h-0.5 flex-1', index < step ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-800')} />}
          </div>
        ))}
      </div>

      <Card>
        <CardBody>
          <h2 className="mb-4 font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {t(steps[step].titleKey)}
          </h2>
          <StepComponent values={values} errors={errors} onChange={handleChange} jumuiaName={jumuiaName} />

          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
              {t('common.back')}
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={goNext} disabled={!steps[step].isValid()}>
                {t('common.next')}
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('common.save')}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
