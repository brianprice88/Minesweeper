function selectLevel(event) {
event.preventDefault();
let level;
if (event.target[0].checked) {level = 'Beginner'}
else if (event.target[1].checked) {level = 'Intermediate'}
else if (event.target[2].checked) {level = 'Expert'}
document.getElementById('newGame').style.display = 'none' // hide the signup form
}






const form = document.getElementById('newGame');
form.addEventListener('submit', selectLevel)
