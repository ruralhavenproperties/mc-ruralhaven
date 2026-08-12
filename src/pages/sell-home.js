export function renderSellHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sell Your House Fast | Rural Haven</title>
<meta name="description" content="Get a fair, no-obligation cash offer on your house. Tell us a little about your property and Rural Haven will reach out shortly.">
<style>
  :root {
    /* Logo-matched brand palette (see /assets/brand.css) */
    --navy: #0A2463;
    --navy-dark: #071A4A;
    --red: #D2232A;
    --olive: #6B7D3A;
    --olive-dark: #57682F;
    --cream: #F5F5F5;
    --cream-line: #E4E2D8;
    --ink: #3A3A3A;
    --muted: #5C6259;
    --tan: #B8865D;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--cream);
    color: var(--ink);
    line-height: 1.5;
  }
  header {
    background: var(--navy);
    color: #fff;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  header .brand {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  header .brand img {
    height: 44px;
    width: 44px;
    border-radius: 6px;
  }
  header .brand span { color: #dfd8c4; }
  header .sell-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  header .sell-nav a {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 7px 13px;
    border-radius: 8px;
    transition: background .15s;
  }
  header .sell-nav a:hover { background: var(--navy-dark); }
  header .sell-nav a.active { background: var(--red); }
  .hero {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 20px 24px;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--navy);
    margin: 0 0 14px;
  }
  .hero p.lede {
    font-size: 1.1rem;
    color: var(--muted);
    max-width: 560px;
    margin: 0 auto 22px;
  }
  .trust-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 22px;
    margin: 0 auto 8px;
    font-size: 0.92rem;
    color: var(--olive);
    font-weight: 600;
  }
  .trust-row span::before { content: "✓ "; }
  main {
    max-width: 560px;
    margin: 0 auto;
    padding: 12px 20px 60px;
  }
  form {
    background: #fff;
    border: 1px solid var(--tan);
    border-radius: 14px;
    padding: 28px 24px;
    box-shadow: 0 8px 24px rgba(22, 50, 31, 0.06);
  }
  label {
    display: block;
    font-weight: 600;
    font-size: 0.92rem;
    margin: 18px 0 6px;
    color: var(--navy);
  }
  label.required::after {
    content: " *";
    color: var(--red);
  }
  input[type="text"],
  input[type="tel"],
  input[type="email"],
  textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid var(--cream-line);
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    background: #fff;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: var(--olive);
    box-shadow: 0 0 0 3px rgba(107, 125, 58, 0.18);
  }
  textarea { min-height: 110px; resize: vertical; }
  .hp-field { position: absolute; left: -9999px; top: -9999px; }
  button[type="submit"] {
    width: 100%;
    margin-top: 24px;
    padding: 15px 18px;
    background: var(--navy);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  button[type="submit"]:hover { background: var(--navy-dark); }
  button[type="submit"]:disabled { opacity: 0.6; cursor: default; }
  .fine-print {
    font-size: 0.8rem;
    color: var(--muted);
    text-align: center;
    margin-top: 14px;
  }
  #form-status {
    margin-top: 16px;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 0.95rem;
    display: none;
  }
  #form-status.success {
    display: block;
    background: #eef4e2;
    color: var(--olive-dark);
    border: 1px solid #cdd8a8;
  }
  #form-status.error {
    display: block;
    background: #fbeae5;
    color: var(--red);
    border: 1px solid #f0c4b6;
  }
  footer {
    text-align: center;
    padding: 24px 20px 40px;
    color: var(--muted);
    font-size: 0.85rem;
  }
  footer a {
    color: var(--navy);
    text-decoration: none;
  }
  footer a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <header>
    <div class="brand">
      <img src="https://ruralhaven.co/assets/logo-240.png" alt="Rural Haven Properties logo">
      Rural Haven<span> Properties</span>
    </div>
    <nav class="sell-nav">
      <a href="/" class="active">Sell</a>
      <a href="https://back40.ruralhaven.co" target="_blank" rel="noopener">Back40</a>
      <a href="https://mc.ruralhaven.co" target="_blank" rel="noopener">Mission Control</a>
    </nav>
  </header>

  <div class="hero">
    <h1>Sell your house without the hassle.</h1>
    <p class="lede">Tell us a bit about your property and we'll get back to you with a fair, no-obligation offer &mdash; no repairs, no showings, no realtor fees.</p>
    <div class="trust-row">
      <span>No obligation</span>
      <span>No repairs needed</span>
      <span>We cover closing costs</span>
      <span>Any condition</span>
    </div>
  </div>

  <main>
    <form id="sell-form" novalidate>
      <label class="required" for="name">Full name</label>
      <input type="text" id="name" name="name" autocomplete="name" required>

      <label class="required" for="contact">Phone or email</label>
      <input type="text" id="contact" name="contact" autocomplete="tel" required placeholder="(555) 555-5555 or you@email.com">

      <label class="required" for="address">Property address</label>
      <input type="text" id="address" name="address" autocomplete="street-address" required placeholder="123 Main St, City, State">

      <label for="details">Tell us about your property</label>
      <textarea id="details" name="details" placeholder="Condition, why you're selling, timeline &mdash; anything that helps us make a fair offer."></textarea>

      <!-- Honeypot field, hidden from real users -->
      <div class="hp-field" aria-hidden="true">
        <label for="company">Company</label>
        <input type="text" id="company" name="company" tabindex="-1" autocomplete="off">
      </div>

      <button type="submit" id="submit-btn">Get My Cash Offer</button>
      <p class="fine-print">By submitting, you agree to be contacted about your property. We never sell your information.</p>

      <div id="form-status" role="status"></div>
    </form>
  </main>

  <footer>
    &copy; ${new Date().getFullYear()} Rural Haven Properties &middot; <a href="https://back40.ruralhaven.co/privacy.html" target="_blank" rel="noopener">Privacy</a> &middot; <a href="https://back40.ruralhaven.co/terms.html" target="_blank" rel="noopener">Terms</a>
  </footer>

  <script>
    const form = document.getElementById('sell-form');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.className = '';
      statusEl.textContent = '';

      const payload = {
        name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        address: document.getElementById('address').value.trim(),
        details: document.getElementById('details').value.trim(),
        company: document.getElementById('company').value.trim(),
      };

      if (!payload.name || !payload.contact || !payload.address) {
        statusEl.className = 'error';
        statusEl.textContent = 'Please fill in your name, contact info, and property address.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch('/api/sell-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          statusEl.className = 'success';
          statusEl.textContent = data.message || "Thanks! We'll be in touch shortly.";
          form.reset();
        } else {
          statusEl.className = 'error';
          statusEl.textContent = data.error || 'Something went wrong. Please try again.';
        }
      } catch (err) {
        statusEl.className = 'error';
        statusEl.textContent = 'Network error. Please try again or call/text us directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get My Cash Offer';
      }
    });
  </script>
</body>
</html>`;
}
