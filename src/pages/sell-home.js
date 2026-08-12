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
    --green-900: #16321f;
    --green-700: #2c5233;
    --green-600: #3a6b45;
    --cream: #faf6ee;
    --tan: #e9dfc9;
    --ink: #1f241f;
    --muted: #5a6357;
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
    background: var(--green-900);
    color: #fff;
    padding: 18px 20px;
    text-align: center;
  }
  header .brand {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  header .brand span { color: #c9e4b8; }
  .hero {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 20px 24px;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    color: var(--green-900);
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
    color: var(--green-700);
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
    color: var(--green-900);
  }
  label.required::after {
    content: " *";
    color: #b5502c;
  }
  input[type="text"],
  input[type="tel"],
  input[type="email"],
  textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #cfd8cd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    background: #fdfdfb;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: var(--green-600);
    box-shadow: 0 0 0 3px rgba(58, 107, 69, 0.15);
  }
  textarea { min-height: 110px; resize: vertical; }
  .hp-field { position: absolute; left: -9999px; top: -9999px; }
  button[type="submit"] {
    width: 100%;
    margin-top: 24px;
    padding: 15px 18px;
    background: var(--green-700);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  button[type="submit"]:hover { background: var(--green-600); }
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
    background: #e8f3e5;
    color: var(--green-900);
    border: 1px solid #bcdcb2;
  }
  #form-status.error {
    display: block;
    background: #fbeae5;
    color: #8a3218;
    border: 1px solid #f0c4b6;
  }
  footer {
    text-align: center;
    padding: 24px 20px 40px;
    color: var(--muted);
    font-size: 0.85rem;
  }
</style>
</head>
<body>
  <header>
    <div class="brand">Rural Haven<span> Properties</span></div>
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
    &copy; ${new Date().getFullYear()} Rural Haven Properties
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
