document.addEventListener("DOMContentLoaded", function() {
    // Get all slides
    var slides = document.querySelectorAll(".slide");

    // Set index for current slide
    var currentSlide = 0;

    // Show the first slide initially
    slides[currentSlide].style.display = "block";

    // Function to show next slide
    function nextSlide() {
        // Hide current slide
        slides[currentSlide].style.display = "none";
        // Increment current slide index
        currentSlide = (currentSlide + 1) % slides.length;
        // Show next slide
        slides[currentSlide].style.display = "block";
    }

    // Automatically move to next slide every 5 seconds
    setInterval(nextSlide, 5000);
});
