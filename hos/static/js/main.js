// Scroll Navbar Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuIcon = document.querySelector('.menu-icon');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuIcon.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.querySelector('i').classList.remove('fa-xmark');
        menuIcon.querySelector('i').classList.add('fa-bars');
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-scroll').forEach((el) => {
    observer.observe(el);
});

// Form Submission Handling
const registrationForm = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const formMessage = document.getElementById('formMessage');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // UI Loading state
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    formMessage.textContent = '';
    
    // Gather FormData
    const formData = new FormData(registrationForm);
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            formMessage.textContent = result.message || 'تم التسجيل بنجاح! سنتواصل معك قريباً.';
            formMessage.className = 'form-message success-text';
            registrationForm.reset();
        } else {
            formMessage.textContent = 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
            formMessage.className = 'form-message error-text';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        formMessage.textContent = 'تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';
        formMessage.className = 'form-message error-text';
    } finally {
        // Restore UI
        setTimeout(() => {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }, 500);
    }
});
