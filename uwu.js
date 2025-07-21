document.addEventListener('DOMContentLoaded', function() {
 
    const visitorNumber = document.getElementById('visitor-number');
    const musicToggle = document.getElementById('toggle-music');
    const backgroundMusic = document.getElementById('background-music');
    const socialButtons = document.querySelectorAll('.glow-button');
    const terminalLines = document.querySelectorAll('.terminal-line');
    

    let count = localStorage.getItem('visitorCount');
    if (!count) {
        count = 0;
    }
    
    count = parseInt(count) + 1;
    
    
    let currentCount = 0;
    const targetCount = count;
    const duration = 1500;
    const interval = 50;
    const steps = duration / interval;
    const increment = targetCount / steps;

    const counter = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            visitorNumber.textContent = targetCount;
            clearInterval(counter);
        } else {
            visitorNumber.textContent = Math.floor(currentCount);
        }
    }, interval);
    
    localStorage.setItem('visitorCount', count);


    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicToggle.style.opacity = '1';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicToggle.style.opacity = '0.6';
        }
    });

   
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 20px var(--primary-color)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

   
    terminalLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, index * 1000);
    });
}); 
