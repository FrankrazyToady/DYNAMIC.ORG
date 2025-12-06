# Dynamic.org Company Website

A modern, responsive company website built with HTML, CSS, and JavaScript.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Smooth animations and transitions
- 🎯 SEO-friendly structure
- 🚀 Fast loading and optimized
- 📧 Contact form with validation
- 🎭 Interactive elements and hover effects
- 🔐 User authentication (Login & Signup)
- 🌐 Social login (Google, GitHub, Facebook)
- 💾 Real-time database with Firebase Firestore
- 🔄 Real-time data synchronization

## Sections

1. **Hero Section** - Eye-catching introduction with call-to-action buttons
2. **About Section** - Company information and statistics
3. **Services Section** - Showcase of company services
4. **Contact Section** - Contact form and company information
5. **Footer** - Additional links and company information

## Getting Started

### Prerequisites

- A modern web browser
- A Firebase account (free tier available)
- Basic knowledge of Firebase setup

### Installation

1. Clone or download this repository
2. **Set up Firebase** (Required for authentication and database):
   - Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to `firebase-config.js`
3. Open `index.html` in your web browser
4. That's it! The website is ready to use.

> **Note**: Without Firebase configuration, the authentication features will not work. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup instructions.

### Customization

#### Update Company Information

1. **Company Name**: Search for "DYNAMIC.ORG" in `index.html` and replace with your company name
2. **Contact Information**: Update the contact details in the contact section (address, email, phone)
3. **Services**: Modify the services section to reflect your actual services
4. **About Section**: Update the about text and statistics to match your company

#### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #8b5cf6;  /* Secondary color */
    --text-dark: #1f2937;        /* Dark text */
    --text-light: #6b7280;       /* Light text */
}
```

#### Add Your Logo

Replace the text logo in the navigation with an image:

```html
<div class="logo">
    <img src="your-logo.png" alt="Company Logo" style="height: 40px;">
</div>
```

#### Add Company Image

Replace the placeholder in the about section with your actual image:

```html
<div class="about-image">
    <img src="your-image.jpg" alt="Company" style="width: 100%; border-radius: 16px;">
</div>
```

## File Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── firebase-config.js  # Firebase configuration (needs your API keys)
├── README.md           # This file
└── FIREBASE_SETUP.md   # Firebase setup guide
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile devices
- Flexible grid layouts
- Optimized for all screen sizes

### Animations
- Smooth scroll navigation
- Fade-in animations on scroll
- Floating card animations
- Counter animations for statistics

### Form Handling
- Client-side validation
- Email format validation
- User-friendly error messages
- Form reset after submission

### Authentication & Database
- Firebase Authentication for secure user login/signup
- Social login support (Google, GitHub, Facebook)
- Firebase Firestore for real-time data storage
- Real-time user data synchronization
- Secure password handling (Firebase handles encryption)
- Contact form submissions stored in Firestore
- Automatic user profile creation for social logins

## Firebase Integration

This website uses Firebase for:
- **Authentication**: Secure user login and signup
- **Firestore Database**: Real-time data storage for user profiles and contact submissions
- **Real-time Sync**: Automatic data synchronization across devices

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete setup instructions.

## Next Steps

1. **Set Up Firebase**: Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md) to enable authentication and database features
2. **Email Notifications**: Set up Cloud Functions to send email notifications for contact form submissions
3. **Content Management**: Consider adding a CMS for easier content updates
4. **Analytics**: Add Google Analytics or Firebase Analytics for tracking
5. **SEO**: Add meta tags, Open Graph tags, and structured data
6. **Performance**: Optimize images and consider lazy loading
7. **Security Rules**: Review and update Firestore security rules for production

## License

This project is open source and available for use.

## Support

For questions or support, please contact your development team.

