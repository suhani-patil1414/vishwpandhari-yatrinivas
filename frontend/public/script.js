// ==============================
// VISHWPANDHARI YATRINIVAS
// script.js
// ==============================

// ---- MOBILE NAV TOGGLE ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ---- ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ---- BACK TO TOP ----
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- GALLERY LIGHTBOX ----
function openLightbox(item) {
  const img = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ---- BOOKING FORM VALIDATION ----
const bookingForm = document.getElementById('bookingForm');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').min = today;
document.getElementById('checkout').min = today;

// Update checkout min when checkin changes
document.getElementById('checkin').addEventListener('change', function () {
  const checkinDate = this.value;
  const checkoutInput = document.getElementById('checkout');
  checkoutInput.min = checkinDate;
  if (checkoutInput.value && checkoutInput.value <= checkinDate) {
    checkoutInput.value = '';
    showError('checkoutError', 'Check-out must be after check-in date.');
  }
});

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function clearError(id) {
  document.getElementById(id).textContent = '';
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const roomType = document.getElementById('roomType').value;
  const guests = document.getElementById('guests').value;

  // Clear all errors
  ['nameError','phoneError','checkinError','checkoutError','roomError','guestsError'].forEach(clearError);

  if (!name || name.length < 2) {
    showError('nameError', 'Please enter your full name.');
    valid = false;
  }

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    showError('phoneError', 'Enter a valid 10-digit mobile number.');
    valid = false;
  }

  if (!checkin) {
    showError('checkinError', 'Please select a check-in date.');
    valid = false;
  }

  if (!checkout) {
    showError('checkoutError', 'Please select a check-out date.');
    valid = false;
  } else if (checkin && checkout <= checkin) {
    showError('checkoutError', 'Check-out must be after check-in.');
    valid = false;
  }

  if (!roomType) {
    showError('roomError', 'Please select a room type.');
    valid = false;
  }

  if (!guests || guests < 1 || guests > 10) {
    showError('guestsError', 'Enter number of guests (1–10).');
    valid = false;
  }

  return valid;
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
  }
});

function resetForm() {
  bookingForm.reset();
  bookingForm.style.display = 'block';
  document.getElementById('bookingSuccess').style.display = 'none';
  ['nameError','phoneError','checkinError','checkoutError','roomError','guestsError'].forEach(clearError);
}

// ---- WHATSAPP BOOKING ----
document.getElementById('whatsappBtn').addEventListener('click', () => {
  const name = document.getElementById('guestName').value.trim() || 'Guest';
  const phone = document.getElementById('guestPhone').value.trim() || 'Not provided';
  const checkin = document.getElementById('checkin').value || 'Not selected';
  const checkout = document.getElementById('checkout').value || 'Not selected';
  const roomType = document.getElementById('roomType').value || 'Not selected';
  const guests = document.getElementById('guests').value || 'Not mentioned';
  const message = document.getElementById('message').value.trim() || 'None';

  const text = `Hello Vishwpandhari Yatrinivas!%0A%0A` +
    `I would like to book a room.%0A%0A` +
    `*Name:* ${name}%0A` +
    `*Phone:* ${phone}%0A` +
    `*Check-In:* ${checkin}%0A` +
    `*Check-Out:* ${checkout}%0A` +
    `*Room Type:* ${roomType}%0A` +
    `*Guests:* ${guests}%0A` +
    `*Special Requests:* ${message}%0A%0A` +
    `Please confirm availability. Thank you!`;

  const waNumber = '919876543210'; // Replace with actual number
  window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
});
