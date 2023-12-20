const counterButton = document.getElementById('counter-button')

counterButton.addEventListener('click', function () {
  const counter = document.getElementById('counter').innerText
  const counterNumber = parseInt(counter)
  const newCounter = counterNumber + 1
  document.getElementById('counter').innerText =
    newCounter > 9 ? newCounter : '0' + newCounter
})
