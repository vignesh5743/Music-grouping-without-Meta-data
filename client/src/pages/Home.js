import React, { useEffect } from 'react';
import './home.css'; // Import the CSS file

const Home = () => {
    useEffect(() => {
        // Get all slides
        const slides = document.querySelectorAll(".slide");

        // Set index for current slide
        let currentSlide = 0;

        // Show the first slide initially
        slides[currentSlide].style.display = "block";

        // Function to show next slide
        const nextSlide = () => {
            // Hide current slide
            slides[currentSlide].style.display = "none";
            // Increment current slide index
            currentSlide = (currentSlide + 1) % slides.length;
            // Show next slide
            slides[currentSlide].style.display = "block";
        }

        // Automatically move to next slide every 5 seconds
        const interval = setInterval(nextSlide, 5000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run only once after the component mounts

    return (
        <div style={{ backgroundColor: 'bisque' }}>
            <header>
                <nav>
                    <div className="logo">C&C</div>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>

                </nav>
            </header>

            <main>
                <section id="image-slider" className="image-slider">
                    <div className="slide">
                        <img src="images/ar_img1.jpg" alt="Music Genre 1" />
                    </div>
                    <div className="slide">
                        <img src="images/ani_img.jpg" alt="Music Genre 2" />
                    </div>
                    <div className="slide">
                        <img src="images/adhi_img.jpg" alt="Music Genre 3" />
                    </div>
                    <div className="slide">
                        <img src="images/u1_img.jpg" alt="Music Genre 4" />
                    </div>
                </section>

                <section id="features" className="features">
                    <div className="feature">
                        <a href="/upload">
                            <img src="images/classify.png" alt="Feature 1" />
                        </a>
                        <h3>Classification based on directors</h3>
                    </div>
                    <div className="feature">
                        <a href="/upload2">
                            <img src="images/cluster.png" alt="Feature 2" />
                        </a>
                        <h3>Clustering of similar Songs</h3>
                    </div>
                </section>

                <section id="contact" className="contact">
                    <h2>Contact Us</h2>
                    <p>If you have any questions or inquiries, feel free to contact us using the information below:</p>
                    <ul>
                        <li>Email: music@gmail.com</li>
                        <li>Phone: 123-456-7890</li>
                        <li>Address: 123 Music Street, Music City, Music Country</li>
                    </ul>
                </section>
            </main>

            {/* <footer>
                <div className="copyright">
                    <p>&copy; 2024 clustering application. All rights reserved.</p>
                    <a href="#">Privacy Policy</a>
                </div>
            </footer> */}
        </div>
    );
}

export default Home;
