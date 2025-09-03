// Main JavaScript for ICISE Conference Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeWebsite();
    loadDynamicContent();
    setupEventListeners();
    setupScrollAnimations();
});

// Initialize website functionality
function initializeWebsite() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(30, 58, 138, 0.95)';
        } else {
            navbar.style.backgroundColor = 'transparent';
        }
    });

    // Abstract submission toggle
    const abstractCheckbox = document.getElementById('abstractSubmission');
    const abstractFields = document.getElementById('abstractFields');
    
    if (abstractCheckbox && abstractFields) {
        abstractCheckbox.addEventListener('change', function() {
            abstractFields.style.display = this.checked ? 'block' : 'none';
        });
    }
}

// Load dynamic content from API
async function loadDynamicContent() {
    try {
        // Load speakers
        await loadSpeakers();
        
        // Load committee members
        await loadCommittee();
        
        // Load additional content
        await loadContent();
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

// Load speakers from API
async function loadSpeakers() {
    try {
        const response = await fetch('/api/speakers');
        const speakers = await response.json();
        
        const speakersContainer = document.getElementById('speakers-content');
        
        if (speakers.length === 0) {
            speakersContainer.innerHTML = `
                <div class="text-center">
                    <p class="lead">Speaker announcements coming soon!</p>
                    <p>We are currently finalizing our lineup of distinguished speakers.</p>
                </div>
            `;
            return;
        }

        let speakersHTML = '<div class="row g-4">';
        
        speakers.forEach(speaker => {
            speakersHTML += `
                <div class="col-lg-4 col-md-6">
                    <div class="speaker-card">
                        <div class="speaker-image">
                            <img src="${speaker.image || '/images/default-speaker.jpg'}" 
                                 alt="${speaker.name}" 
                                 onerror="this.src='/images/default-speaker.jpg'">
                        </div>
                        <div class="speaker-content">
                            <h3 class="speaker-name">${speaker.name}</h3>
                            ${speaker.title ? `<p class="speaker-title">${speaker.title}</p>` : ''}
                            ${speaker.affiliation ? `<p class="speaker-affiliation">${speaker.affiliation}</p>` : ''}
                            ${speaker.bio ? `<p class="speaker-bio">${truncateText(speaker.bio, 150)}</p>` : ''}
                            ${speaker.talkTitle ? `<p class="speaker-talk"><strong>Talk:</strong> ${speaker.talkTitle}</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        speakersHTML += '</div>';
        speakersContainer.innerHTML = speakersHTML;
        
    } catch (error) {
        console.error('Error loading speakers:', error);
        document.getElementById('speakers-content').innerHTML = `
            <div class="text-center">
                <p class="lead">Speaker information will be available soon.</p>
            </div>
        `;
    }
}

// Load committee members from API
async function loadCommittee() {
    try {
        const response = await fetch('/api/content?category=committee');
        const committee = await response.json();
        
        const committeeContainer = document.getElementById('committee-content');
        
        if (committee.length === 0) {
            committeeContainer.innerHTML = `
                <div class="text-center">
                    <p class="lead">Committee information coming soon!</p>
                </div>
            `;
            return;
        }

        let committeeHTML = '<div class="row justify-content-center">';
        
        committee.forEach(member => {
            const memberData = typeof member.content === 'string' ? 
                JSON.parse(member.content) : member.content;
                
            committeeHTML += `
                <div class="col-lg-6 col-md-8 mb-4">
                    <div class="committee-member">
                        <h4>${memberData.name || member.title}</h4>
                        ${memberData.title ? `<p class="text-muted">${memberData.title}</p>` : ''}
                        ${memberData.affiliation ? `<p><strong>${memberData.affiliation}</strong></p>` : ''}
                        ${memberData.email ? `<p><a href="mailto:${memberData.email}">${memberData.email}</a></p>` : ''}
                    </div>
                </div>
            `;
        });
        
        committeeHTML += '</div>';
        committeeContainer.innerHTML = committeeHTML;
        
    } catch (error) {
        console.error('Error loading committee:', error);
        document.getElementById('committee-content').innerHTML = `
            <div class="text-center">
                <p class="lead">Committee information will be available soon.</p>
            </div>
        `;
    }
}

// Load additional content
async function loadContent() {
    try {
        const response = await fetch('/api/content?category=program');
        const programContent = await response.json();
        
        if (programContent.length > 0) {
            const programContainer = document.getElementById('program-content');
            let programHTML = '';
            
            programContent.forEach(item => {
                programHTML += `
                    <div class="content-item mb-4">
                        ${item.title ? `<h3>${item.title}</h3>` : ''}
                        <div>${item.content}</div>
                    </div>
                `;
            });
            
            programContainer.innerHTML = programHTML;
        }
    } catch (error) {
        console.error('Error loading program content:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Registration form validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.topic-card, .speaker-card, .date-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Open registration modal
function openRegistrationModal() {
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    modal.show();
}

// Open abstract submission modal (same as registration with abstract fields)
function openAbstractModal() {
    document.getElementById('abstractSubmission').checked = true;
    document.getElementById('abstractFields').style.display = 'block';
    openRegistrationModal();
}

// Submit registration form
async function submitRegistration() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'affiliation', 'country', 'registrationType'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields.', 'danger');
        return;
    }
    
    // Prepare data object
    const registrationData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        affiliation: document.getElementById('affiliation').value,
        position: document.getElementById('position').value,
        country: document.getElementById('country').value,
        registrationType: document.getElementById('registrationType').value,
        dietary: document.getElementById('dietary').value,
        dietaryOther: document.getElementById('dietaryOther').value,
        accommodation: document.getElementById('accommodation').checked,
        abstractSubmission: document.getElementById('abstractSubmission').checked,
        abstractTitle: document.getElementById('abstractTitle').value,
        abstractContent: document.getElementById('abstractContent').value
    };
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('#registrationModal .btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Close registration modal
            bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Reset form
            form.reset();
            document.getElementById('abstractFields').style.display = 'none';
            
        } else {
            showAlert(result.message || 'Registration failed. Please try again.', 'danger');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Network error. Please check your connection and try again.', 'danger');
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('#registrationModal .btn-primary');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const modalBody = document.querySelector('#registrationModal .modal-body');
    modalBody.insertAdjacentHTML('afterbegin', alertHTML);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = modalBody.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Utility function to truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Check registration status
async function checkRegistrationStatus(email) {
    try {
        const response = await fetch(`/api/registration-status/${encodeURIComponent(email)}`);
        const result = await response.json();
        
        if (response.ok) {
            return result;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error checking registration status:', error);
        return null;
    }
}

// Load conference information
async function loadConferenceInfo() {
    try {
        const response = await fetch('/api/info');
        const info = await response.json();
        
        // Update page meta information if needed
        document.title = `${info.title} - ${info.date}`;
        
        return info;
    } catch (error) {
        console.error('Error loading conference info:', error);
    }
}

// Export functions for global access
window.openRegistrationModal = openRegistrationModal;
window.openAbstractModal = openAbstractModal;
window.submitRegistration = submitRegistration;
window.checkRegistrationStatus = checkRegistrationStatus;


