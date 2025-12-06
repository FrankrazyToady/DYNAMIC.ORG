// Firebase Auth State Listener - Real-time authentication
let userDataListener = null;

// Check if user is logged in using Firebase Auth
function checkAuthStatus() {
    auth.onAuthStateChanged((user) => {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        
        if (user) {
            // User is signed in - get user data from Firestore
            getUserData(user.uid);
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
        } else {
            // User is signed out
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            // Unsubscribe from real-time listener
            if (userDataListener) {
                userDataListener();
                userDataListener = null;
            }
        }
    });
}

// Get user data from Firestore with real-time listener
function getUserData(uid) {
    // Set up real-time listener for user data
    if (userDataListener) {
        userDataListener(); // Unsubscribe previous listener
    }
    
    userDataListener = db.collection('users').doc(uid).onSnapshot((doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = userData.name || userData.email;
            }
        } else {
            // User document doesn't exist yet
            const user = auth.currentUser;
            if (user) {
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = user.email;
                }
            }
        }
    }, (error) => {
        console.error('Error getting user data:', error);
    });
}

// Initialize auth status on page load
checkAuthStatus();

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link or auth button
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close mobile menu when clicking auth buttons
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
}

// Smooth scroll for navigation links (only for anchor links on same page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default if it's an anchor link on the same page
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Contact Form Handling - Store in Firestore
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Store contact form submission in Firestore
            await db.collection('contactSubmissions').add({
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                read: false
            });
            
            alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon at ${email}.`);
            contactForm.reset();
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const statItems = document.querySelectorAll('.stat-item');
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Modal Management
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Open Login Modal
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Open Signup Modal
if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close Modals
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (closeLoginModal) {
    closeLoginModal.addEventListener('click', () => {
        closeModal(loginModal);
    });
}

if (closeSignupModal) {
    closeSignupModal.addEventListener('click', () => {
        closeModal(signupModal);
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeModal(loginModal);
    }
    if (e.target === signupModal) {
        closeModal(signupModal);
    }
});

// Switch between Login and Signup
if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        setTimeout(() => {
            signupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 300);
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        setTimeout(() => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 300);
    });
}

// Auth Tab Switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        const tabContainer = tab.closest('.modal-content');
        
        // Remove active class from all tabs in this container
        tabContainer.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show/hide forms based on tab
        if (tabName === 'email-login') {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('phoneLoginForm').style.display = 'none';
        } else if (tabName === 'phone-login') {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('phoneLoginForm').style.display = 'block';
        } else if (tabName === 'email-signup') {
            document.getElementById('signupForm').style.display = 'block';
            document.getElementById('phoneSignupForm').style.display = 'none';
        } else if (tabName === 'phone-signup') {
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('phoneSignupForm').style.display = 'block';
        }
    });
});

// Login Form Handling with Firebase Auth
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        try {
            // Sign in with Firebase Auth
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                showSuccess(`Welcome back, ${userData.name || user.email}!`);
            } else {
                showSuccess(`Welcome back, ${user.email}!`);
            }
            
            closeModal(loginModal);
            loginForm.reset();
            // Auth state listener will automatically update UI
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Failed to log in. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please sign up.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            showError(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Signup Form Handling with Firebase Auth
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        if (!agreeTerms) {
            showError('Please agree to the Terms & Conditions');
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        
        try {
            // Create user with Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Store user data in Firestore
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            showSuccess(`Welcome, ${name}! Your account has been created successfully.`);
            closeModal(signupModal);
            signupForm.reset();
            // Auth state listener will automatically update UI
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Failed to create account. Please try again.';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists. Please log in instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            }
            
            showError(errorMessage);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Logout Functionality with Firebase Auth
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            showSuccess('You have been logged out successfully.');
            // Auth state listener will automatically update UI
        } catch (error) {
            console.error('Logout error:', error);
            showError('Failed to log out. Please try again.');
        }
    });
}

// Helper functions for user feedback
function showError(message) {
    // You can replace this with a better notification system
    alert(message);
}

function showSuccess(message) {
    // You can replace this with a better notification system
    alert(message);
}

// Social Login Functions
async function handleSocialLogin(provider, providerName) {
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user document exists, if not create it
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // Create user document for new social login users
            const userData = {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                provider: providerName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('users').doc(user.uid).set(userData);
            showSuccess(`Welcome, ${userData.name}! Your account has been created.`);
        } else {
            // Update last login time
            await db.collection('users').doc(user.uid).update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const userData = userDoc.data();
            showSuccess(`Welcome back, ${userData.name || user.email}!`);
        }
        
        // Close modals
        closeModal(loginModal);
        closeModal(signupModal);
        // Auth state listener will automatically update UI
    } catch (error) {
        console.error(`${providerName} login error:`, error);
        let errorMessage = `Failed to sign in with ${providerName}. Please try again.`;
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in popup was closed. Please try again.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with a different sign-in method.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
        }
        
        showError(errorMessage);
    }
}

// Google Sign-In
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Apple Sign-In (no additional setup needed for basic auth)

// Login with Google
const loginWithGoogle = document.getElementById('loginWithGoogle');
if (loginWithGoogle) {
    loginWithGoogle.addEventListener('click', async () => {
        await handleSocialLogin(googleProvider, 'Google');
    });
}

// Login with Apple
const loginWithApple = document.getElementById('loginWithApple');
if (loginWithApple) {
    loginWithApple.addEventListener('click', async () => {
        const appleProvider = new firebase.auth.OAuthProvider('apple.com');
        await handleSocialLogin(appleProvider, 'Apple');
    });
}

// Signup with Google
const signupWithGoogle = document.getElementById('signupWithGoogle');
if (signupWithGoogle) {
    signupWithGoogle.addEventListener('click', async () => {
        await handleSocialLogin(googleProvider, 'Google');
    });
}

// Signup with Apple
const signupWithApple = document.getElementById('signupWithApple');
if (signupWithApple) {
    signupWithApple.addEventListener('click', async () => {
        const appleProvider = new firebase.auth.OAuthProvider('apple.com');
        await handleSocialLogin(appleProvider, 'Apple');
    });
}

// Phone Authentication
let phoneVerificationId = null;
let phoneSignupVerificationId = null;

// Phone Login
const loginWithPhoneBtn = document.getElementById('loginWithPhone');
if (loginWithPhoneBtn) {
    loginWithPhoneBtn.addEventListener('click', async () => {
        const phoneNumber = document.getElementById('loginPhone').value;
        
        if (!phoneNumber) {
            showError('Please enter a phone number');
            return;
        }
        
        // Format phone number (ensure it starts with +)
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;
        
        try {
            const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('loginWithPhone', {
                'size': 'invisible',
                'callback': () => {}
            });
            
            const confirmationResult = await auth.signInWithPhoneNumber(formattedPhone, recaptchaVerifier);
            phoneVerificationId = confirmationResult.verificationId;
            
            // Show verification code input
            document.getElementById('phoneVerificationCode').style.display = 'block';
            showSuccess('Verification code sent to your phone');
        } catch (error) {
            console.error('Phone login error:', error);
            let errorMessage = 'Failed to send verification code. Please try again.';
            
            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format. Please include country code.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            }
            
            showError(errorMessage);
        }
    });
}

// Verify Phone Code for Login
const verifyPhoneCodeBtn = document.getElementById('verifyPhoneCode');
if (verifyPhoneCodeBtn) {
    verifyPhoneCodeBtn.addEventListener('click', async () => {
        const code = document.getElementById('phoneCode').value;
        
        if (!code || code.length !== 6) {
            showError('Please enter a valid 6-digit code');
            return;
        }
        
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(phoneVerificationId, code);
            const result = await auth.signInWithCredential(credential);
            const user = result.user;
            
            // Check if user document exists
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                // Create user document
                await db.collection('users').doc(user.uid).set({
                    name: user.displayName || 'User',
                    email: user.email || '',
                    phone: user.phoneNumber,
                    provider: 'phone',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            showSuccess('Phone verified successfully!');
            closeModal(loginModal);
            document.getElementById('loginForm').reset();
            document.getElementById('phoneVerificationCode').style.display = 'none';
        } catch (error) {
            console.error('Phone verification error:', error);
            showError('Invalid verification code. Please try again.');
        }
    });
}

// Phone Signup
const signupWithPhoneBtn = document.getElementById('signupWithPhone');
if (signupWithPhoneBtn) {
    signupWithPhoneBtn.addEventListener('click', async () => {
        const phoneNumber = document.getElementById('signupPhone').value;
        
        if (!phoneNumber) {
            showError('Please enter a phone number');
            return;
        }
        
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;
        
        try {
            const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('signupWithPhone', {
                'size': 'invisible',
                'callback': () => {}
            });
            
            const confirmationResult = await auth.signInWithPhoneNumber(formattedPhone, recaptchaVerifier);
            phoneSignupVerificationId = confirmationResult.verificationId;
            
            document.getElementById('phoneSignupVerificationCode').style.display = 'block';
            showSuccess('Verification code sent to your phone');
        } catch (error) {
            console.error('Phone signup error:', error);
            let errorMessage = 'Failed to send verification code. Please try again.';
            
            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format. Please include country code.';
            }
            
            showError(errorMessage);
        }
    });
}

// Verify Phone Code for Signup
const verifyPhoneSignupCodeBtn = document.getElementById('verifyPhoneSignupCode');
if (verifyPhoneSignupCodeBtn) {
    verifyPhoneSignupCodeBtn.addEventListener('click', async () => {
        const code = document.getElementById('phoneSignupCode').value;
        const name = document.getElementById('signupPhoneName').value;
        
        if (!code || code.length !== 6) {
            showError('Please enter a valid 6-digit code');
            return;
        }
        
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(phoneSignupVerificationId, code);
            const result = await auth.signInWithCredential(credential);
            const user = result.user;
            
            // Create user document
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: user.email || '',
                phone: user.phoneNumber,
                provider: 'phone',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showSuccess(`Welcome, ${name}! Your account has been created successfully.`);
            closeModal(signupModal);
            document.getElementById('signupForm').reset();
            document.getElementById('phoneSignupForm').reset();
            document.getElementById('phoneSignupVerificationCode').style.display = 'none';
        } catch (error) {
            console.error('Phone signup verification error:', error);
            showError('Invalid verification code. Please try again.');
        }
    });
}

// Auth Tab Switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        const modal = tab.closest('.modal-content');
        
        // Remove active class from all tabs in this container
        modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show/hide forms based on tab
        if (tabName === 'email-login') {
            const loginForm = document.getElementById('loginForm');
            const phoneLoginForm = document.getElementById('phoneLoginForm');
            if (loginForm) loginForm.style.display = 'block';
            if (phoneLoginForm) phoneLoginForm.style.display = 'none';
        } else if (tabName === 'phone-login') {
            const loginForm = document.getElementById('loginForm');
            const phoneLoginForm = document.getElementById('phoneLoginForm');
            if (loginForm) loginForm.style.display = 'none';
            if (phoneLoginForm) phoneLoginForm.style.display = 'block';
        } else if (tabName === 'email-signup') {
            const signupForm = document.getElementById('signupForm');
            const phoneSignupForm = document.getElementById('phoneSignupForm');
            if (signupForm) signupForm.style.display = 'block';
            if (phoneSignupForm) phoneSignupForm.style.display = 'none';
        } else if (tabName === 'phone-signup') {
            const signupForm = document.getElementById('signupForm');
            const phoneSignupForm = document.getElementById('phoneSignupForm');
            if (signupForm) signupForm.style.display = 'none';
            if (phoneSignupForm) phoneSignupForm.style.display = 'block';
        }
    });
});

