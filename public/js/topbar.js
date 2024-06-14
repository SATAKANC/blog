document.getElementById('mobile-menu').addEventListener('click', function() {
    document.querySelector('.topbar .center').classList.toggle('active');
});

// Menu dışına tıklayınca menüyü kapatma
document.addEventListener('click', function(event) {
    const menu = document.querySelector('.topbar .center');
    const toggleButton = document.getElementById('mobile-menu');
    
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
        menu.classList.remove('active');
    }
});
