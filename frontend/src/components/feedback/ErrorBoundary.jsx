import { Component } from 'react'
import { withTranslation } from 'react-i18next'

import Button from '../ui/Button'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { t } = this.props
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center dark:bg-neutral-950">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('errors.genericTitle')}
        </h1>
        <p className="max-w-sm text-neutral-600 dark:text-neutral-400">{t('errors.genericBody')}</p>
        <Button onClick={() => window.location.reload()}>{t('errors.reload')}</Button>
      </div>
    )
  }
}

export default withTranslation()(ErrorBoundary)
