function setActive(element) {
    document.querySelectorAll('.nav-btn').forEach(function (btn) {
        btn.classList.remove('active');
    });
    element.classList.add('active');
}

function handleSubmit(event) {
    event.preventDefault();
    alert('Service is currently unavailable, please contact me through discord');
    event.target.reset();
}

var count = parseInt(localStorage.getItem('visitorCount')) || 7;
count++;
localStorage.setItem('visitorCount', count);
document.getElementById('visitor-count').textContent = count.toLocaleString();

document.querySelector('.nav-btn').classList.add('active');