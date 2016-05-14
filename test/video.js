window.onload = function () {
  var player = new window.Audio('youtube.com/watch?v=YQHsXMglC9A')
  player.preload = 'metadata'
  player.play()
  player.controls = true
  document.body.appendChild(player)
}
