document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('testButton').addEventListener('click', function() {
        alert('Button works!');
    });

    // Infinite loop to keep GIF running
    const gif = document.querySelector('.shield-gif');
    if (gif) {
        // This runs forever every 2 seconds
        setInterval(function() {
            // Force GIF to restart by changing its source
            gif.src = gif.src.split('?')[0] + '?t=' + Date.now();
        }, 500); // Every 2000ms = 2 seconds
    }
});