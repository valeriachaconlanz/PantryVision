// Photo helpers for the search page.

export const MAX_PHOTOS = 3
export const MAX_BYTES = 2 * 1024 * 1024 // NFR-9: about 2MB per photo
export const ACCEPTED = '.png,.jpg,.jpeg,.heic,.heif,image/png,image/jpeg,image/heic,image/heif'

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('cant-decode'))
    }
    img.src = url
  })
}

function toBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

// NFR-8: shrink the photo in the browser before it gets uploaded.
// Returns { blob, previewUrl, thumb } where thumb is a tiny data URL for photo history.
// HEIC only decodes in Safari, so other browsers keep the original if it's small enough.
export async function compressPhoto(file) {
  let loaded
  try {
    loaded = await loadImage(file)
  } catch {
    if (file.size <= MAX_BYTES) {
      return { blob: file, previewUrl: null, thumb: null }
    }
    throw new Error(`${file.name} is too big and your browser can't shrink it. Try a JPEG or PNG.`)
  }

  const { img, url } = loaded
  const longest = Math.max(img.width, img.height)
  let scale = Math.min(1, 1600 / longest)
  let blob = null

  for (let attempt = 0; attempt < 4; attempt++) {
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    blob = await toBlob(canvas, 0.82)
    if (blob && blob.size <= MAX_BYTES) break
    scale *= 0.75
  }

  const thumbCanvas = document.createElement('canvas')
  const thumbScale = 160 / longest
  thumbCanvas.width = Math.round(img.width * thumbScale)
  thumbCanvas.height = Math.round(img.height * thumbScale)
  thumbCanvas.getContext('2d').drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height)
  const thumb = thumbCanvas.toDataURL('image/jpeg', 0.6)

  return { blob, previewUrl: url, thumb }
}

// FR-22: photo history only lives in this browser.
const HISTORY_KEY = 'pv.photoHistory'
const HISTORY_LIMIT = 12

export function readPhotoHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []
  } catch {
    return []
  }
}

export function addToPhotoHistory(thumbs) {
  try {
    const next = [...thumbs.filter(Boolean).map((src) => ({ src, at: Date.now() })), ...readPhotoHistory()]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, HISTORY_LIMIT)))
  } catch {
    // storage full or blocked, history is just a nice to have
  }
}

export function clearPhotoHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    // ignore
  }
}
