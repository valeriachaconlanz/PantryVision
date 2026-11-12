// Spoonacular images come in a few sizes, like ...-312x231.jpg. Ask for the big one when we need it.
export function biggerImage(url) {
  return url.replace(/-\d+x\d+\.(jpe?g|png)$/i, '-636x393.$1')
}

export function likesText(likes) {
  return `${likes} ${likes === 1 ? 'like' : 'likes'}`
}
