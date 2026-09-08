const YOUTUBE_HOST_PATTERN = /(?:youtube\.com|youtu\.be)/i

export function getYoutubeVideoId(url) {
  if (!url || !YOUTUBE_HOST_PATTERN.test(url)) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1)
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.replace('/embed/', '')
    }
    if (parsed.pathname.startsWith('/live/')) {
      return parsed.pathname.replace('/live/', '')
    }
    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}

export function getYoutubeEmbedUrl(url) {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function getYoutubeThumbnailUrl(url) {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}
