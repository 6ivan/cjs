import defaultSettings from '@/settings'

const title = defaultSettings.title || '云网优化调度支撑平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
