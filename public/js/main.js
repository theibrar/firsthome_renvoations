// Configuration
const scriptURL = "https://script.google.com/macros/s/AKfycbyZJkW2vW0YiRJtOuWbXhtXmf217kqhJL_6eDjv5j9oWFYkjI6c1HaC27x04oe5Ze9E/exec";

// IP Fetching
const ipField = document.getElementById('ip_address');
fetch("https://ipinfo.io/json")
    .then(response => response.json())
    .then(data => { ipField.value = data.ip || ""; })
    .catch(() => {
        fetch("https://api.ipify.org?format=json")
            .then(res => res.json())
            .then(data => { ipField.value = data.ip || ""; });
    });

// LeadID Waiting Logic
const leadidField = document.getElementById('leadid_token');
function waitForLeadID(callback) {
    let attempts = 0;
    const maxAttempts = 50;
    function checkLeadID() {
        attempts++;
        if (leadidField.value && leadidField.value.trim() !== '') {
            callback(true);
            return;
        }
        if (window.LeadiD && window.LeadiD.getToken) {
            try {
                const token = window.LeadiD.getToken();
                if (token) {
                    leadidField.value = token;
                    callback(true);
                    return;
                }
            } catch (e) {}
        }
        if (attempts >= maxAttempts) {
            callback(false);
            return;
        }
        setTimeout(checkLeadID, 100);
    }
    setTimeout(checkLeadID, 100);
}

const leadForm = document.getElementById('leadForm');
const nextStepBtn = document.getElementById('nextStep');
const prevStepBtn = document.getElementById('prevStep');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const progressBar = document.getElementById('progressBar');
const stepIndicators = document.querySelectorAll('.step-indicator');

const updateProgress = (step) => {
    if (step === 1) {
        progressBar.style.width = '50%';
        stepIndicators[0].classList.add('active');
        stepIndicators[1].classList.remove('active');
    } else {
        progressBar.style.width = '100%';
        stepIndicators[0].classList.add('active');
        stepIndicators[1].classList.add('active');
    }
};

nextStepBtn?.addEventListener('click', () => {
    const inputs = step1.querySelectorAll('input[required], select[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = '#d63031';
            isValid = false;
        } else {
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    });

    if (isValid) {
        step1.classList.remove('active');
        step2.classList.add('active');
        updateProgress(2);
    }
});

prevStepBtn?.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
    updateProgress(1);
});

leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tcpaCheckbox = document.getElementById("leadid_tcpa_disclosure");
    if (!tcpaCheckbox.checked) {
        Swal.fire({
            icon: "warning",
            title: "Consent Required",
            text: "You must agree to the terms by checking the box before submitting."
        });
        return;
    }

    // Show loading state
    Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we secure your quote.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    waitForLeadID(async (success) => {
        const formData = new FormData(leadForm);

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            const resultText = await response.text();
            
            if (resultText.includes("Success")) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Your request has been received. We will contact you shortly.",
                    showConfirmButton: false,
                    timer: 2500
                });
                leadForm.reset();
                step2.classList.remove('active');
                step1.classList.add('active');
                updateProgress(1);
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Submission failed. Please try again." });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: 'Could not connect to server.' });
        }
    });
});




// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Portfolio Slider Logic
const portfolioSlider = document.getElementById('portfolioSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (portfolioSlider && prevBtn && nextBtn) {
    const scrollAmount = () => {
        const itemWidth = portfolioSlider.querySelector('.portfolio-item').offsetWidth;
        const gap = 32; // 2rem gap
        return itemWidth + gap;
    };

    nextBtn.addEventListener('click', () => {
        portfolioSlider.scrollBy({
            left: scrollAmount(),
            behavior: 'smooth'
        });
    });

    prevBtn.addEventListener('click', () => {
        portfolioSlider.scrollBy({
            left: -scrollAmount(),
            behavior: 'smooth'
        });
    });

    // Auto-hide/disable arrows based on scroll position (optional but premium)
    portfolioSlider.addEventListener('scroll', () => {
        const isAtStart = portfolioSlider.scrollLeft <= 10;
        const isAtEnd = portfolioSlider.scrollLeft + portfolioSlider.offsetWidth >= portfolioSlider.scrollWidth - 10;
        
        prevBtn.style.opacity = isAtStart ? '0.3' : '1';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    });

    // Initialize arrow state
    prevBtn.style.opacity = '0.3';
    prevBtn.style.pointerEvents = 'none';
}

