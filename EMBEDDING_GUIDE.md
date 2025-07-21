# 🔗 Embedding GreyBrain AI Pulse in GreyBrain.ai

## 🎯 Integration Options

### **Option 1: Subdomain (Recommended)**
Set up `pulse.greybrain.ai` as a subdomain:

```dns
# DNS Configuration
CNAME pulse.greybrain.ai your-deployment.vercel.app
```

**Benefits:**
- ✅ Seamless branding
- ✅ Independent scaling
- ✅ Full feature access
- ✅ SEO benefits

### **Option 2: Full Page Integration**
Add a dedicated page to your main site:

```html
<!-- /pulse page on greybrain.ai -->
<!DOCTYPE html>
<html>
<head>
    <title>GreyBrain AI Pulse - Latest AI Healthcare News</title>
    <meta name="description" content="Stay updated with the latest AI developments in healthcare">
</head>
<body>
    <!-- Your main site header -->
    <header>
        <!-- GreyBrain.ai navigation -->
    </header>
    
    <!-- Embedded Pulse -->
    <iframe 
        src="https://your-pulse-deployment.vercel.app"
        width="100%" 
        height="100vh"
        frameborder="0"
        style="border: none;">
    </iframe>
    
    <!-- Your main site footer -->
    <footer>
        <!-- GreyBrain.ai footer -->
    </footer>
</body>
</html>
```

### **Option 3: Homepage Widget**
Add a newsletter preview to your homepage:

```html
<!-- Homepage widget -->
<section class="newsletter-preview">
    <div class="container">
        <h2>Latest AI Healthcare Insights</h2>
        <div id="pulse-widget"></div>
        <a href="https://pulse.greybrain.ai" class="btn-primary">
            View Full Newsletter →
        </a>
    </div>
</section>

<script>
async function loadPulseWidget() {
    try {
        // Fetch latest newsletter data
        const response = await fetch('https://your-pulse-deployment.vercel.app/api/latest');
        const data = await response.json();
        
        // Render preview (top 3 articles)
        const widget = document.getElementById('pulse-widget');
        const preview = data.newsletter.slice(0, 2).map(section => `
            <div class="pulse-section">
                <h3>${section.categoryTitle}</h3>
                <div class="pulse-articles">
                    ${section.items.slice(0, 2).map(item => `
                        <article class="pulse-article">
                            <h4>${item.title}</h4>
                            <p>${item.summary}</p>
                            <a href="${item.sourceUrl}" target="_blank">Read more →</a>
                        </article>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        widget.innerHTML = preview;
    } catch (error) {
        console.error('Failed to load pulse widget:', error);
    }
}

// Load widget on page load
document.addEventListener('DOMContentLoaded', loadPulseWidget);
</script>
```

### **Option 4: API Integration**
Create a custom integration using the newsletter data:

```javascript
// Custom integration for greybrain.ai
class GreyBrainPulseAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async getLatestNewsletter() {
        const response = await fetch(`${this.baseUrl}/api/newsletter`);
        return response.json();
    }
    
    async getNewsletterByDate(date) {
        const response = await fetch(`${this.baseUrl}/api/newsletter/${date}`);
        return response.json();
    }
    
    async subscribeEmail(email, firstName, lastName) {
        const response = await fetch(`${this.baseUrl}/api/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, firstName, lastName })
        });
        return response.json();
    }
}

// Usage
const pulse = new GreyBrainPulseAPI('https://pulse.greybrain.ai');
const newsletter = await pulse.getLatestNewsletter();
```

## 🎨 Styling Integration

### **Match GreyBrain.ai Design**
```css
/* Custom CSS for embedded pulse */
.pulse-embedded {
    --primary-color: #your-brand-color;
    --secondary-color: #your-secondary-color;
    --font-family: 'Your Brand Font', sans-serif;
}

/* Override pulse styles to match your site */
.pulse-embedded .newsletter-header {
    background: var(--primary-color);
    font-family: var(--font-family);
}

.pulse-embedded .article-card {
    border-color: var(--secondary-color);
}
```

### **Responsive Embedding**
```css
/* Responsive iframe */
.pulse-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100vh; /* Adjust as needed */
}

.pulse-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .pulse-container {
        padding-bottom: 120vh; /* More height on mobile */
    }
}
```

## 🔗 Navigation Integration

### **Add to Main Navigation**
```html
<!-- Add to greybrain.ai navigation -->
<nav class="main-nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/services">Services</a>
    <a href="/pulse">AI Pulse</a> <!-- New link -->
    <a href="/contact">Contact</a>
</nav>
```

### **Breadcrumb Integration**
```html
<!-- Breadcrumbs for pulse pages -->
<nav class="breadcrumb">
    <a href="https://greybrain.ai">GreyBrain.ai</a>
    <span>/</span>
    <a href="https://pulse.greybrain.ai">AI Pulse</a>
</nav>
```

## 📧 Email Newsletter Integration

### **Unified Subscription**
```html
<!-- Add to greybrain.ai footer -->
<section class="newsletter-signup">
    <h3>Stay Updated with AI Healthcare News</h3>
    <p>Get the latest insights delivered to your inbox weekly</p>
    <form id="pulse-subscribe">
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Subscribe to AI Pulse</button>
    </form>
</section>

<script>
document.getElementById('pulse-subscribe').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Subscribe via pulse API
    const response = await fetch('https://pulse.greybrain.ai/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    
    if (response.ok) {
        alert('Successfully subscribed to GreyBrain AI Pulse!');
    }
});
</script>
```

## 🔍 SEO Integration

### **Meta Tags**
```html
<!-- Add to greybrain.ai pages -->
<meta name="description" content="GreyBrain AI Pulse - Latest AI developments in healthcare, curated daily">
<meta property="og:title" content="GreyBrain AI Pulse">
<meta property="og:description" content="Stay updated with AI healthcare innovations">
<meta property="og:url" content="https://pulse.greybrain.ai">
<meta property="og:image" content="https://pulse.greybrain.ai/og-image.png">

<!-- Schema markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Newsletter",
  "name": "GreyBrain AI Pulse",
  "description": "AI healthcare news and insights",
  "publisher": {
    "@type": "Organization",
    "name": "GreyBrain AI",
    "url": "https://greybrain.ai"
  }
}
</script>
```

## 📱 Mobile Integration

### **App-like Experience**
```html
<!-- PWA manifest for pulse -->
<link rel="manifest" href="/pulse-manifest.json">
<meta name="theme-color" content="#your-brand-color">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="GreyBrain AI Pulse">
```

## 🚀 Deployment Steps

### **1. Deploy Pulse**
```bash
# Deploy to Vercel/Netlify
npm run build
vercel --prod
```

### **2. Configure DNS**
```dns
# Add CNAME record
pulse.greybrain.ai → your-deployment.vercel.app
```

### **3. Update Main Site**
- Add navigation link
- Add homepage widget
- Update footer with subscription
- Add meta tags for SEO

### **4. Test Integration**
- Verify subdomain works
- Test newsletter subscription
- Check mobile responsiveness
- Validate SEO tags

## 📊 Analytics Integration

### **Unified Tracking**
```javascript
// Track pulse engagement on main site
gtag('config', 'GA_MEASUREMENT_ID', {
    custom_map: {
        'custom_parameter_1': 'pulse_section'
    }
});

// Track pulse interactions
function trackPulseEvent(action, section) {
    gtag('event', action, {
        event_category: 'GreyBrain AI Pulse',
        event_label: section,
        pulse_section: section
    });
}
```

Ready to integrate! 🎯
