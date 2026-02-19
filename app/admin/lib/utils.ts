export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} years ago`

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} months ago`

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} days ago`
  if (interval === 1) return `1 day ago`

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} hours ago`
  if (interval === 1) return `1 hour ago`

  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} minutes ago`
  if (interval === 1) return `1 minute ago`

  return `Just now`
}

export function extractYoutubeId(url: string): string {
  let videoId = url.trim()

  // Handle youtube.com/watch?v= format
  if (videoId.includes("youtube.com/watch?v=")) {
    videoId = videoId.split("v=")[1]?.split("&")[0] || videoId
  }

  // Handle youtu.be/ format
  if (videoId.includes("youtu.be/")) {
    videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || videoId
  }

  return videoId
}
