## Contact form setup (no public email address)

This project includes a contact form that submits to a server route (`POST /api/contact`) and sends you an email **without putting your email address in the client HTML**.

### 1) Configure email sending (Resend)

Set these environment variables on your host (ex: Vercel Project → Settings → Environment Variables):

- **`CONTACT_TO_EMAIL`**: where you want inquiries delivered (your private email)
- **`CONTACT_FROM_EMAIL`**: a verified sender identity in Resend (example: `PacNW Studio <hello@yourdomain.com>`)
- **`RESEND_API_KEY`**: your Resend API key

Notes:
- In **development**, if `RESEND_API_KEY` is missing, the API route will **log the email payload to the server console** (and the UI will show a dev note that delivery was skipped).
- In **production**, missing `RESEND_API_KEY` will cause the route to return an error (so you don’t silently lose leads).
- The server sends **two emails** on successful submit:
  - a notification to **`CONTACT_TO_EMAIL`**
  - a “thanks for reaching out” confirmation to the submitter’s email (skipped for suspicious spam submissions)

### Important note (autofill + “honeypot”)

The form uses a hidden “honeypot” field for lightweight spam protection. Some password managers / browser autofill can mistakenly fill hidden fields.

This repo is set up to **still send the email** even if the honeypot is filled (and it will flag the email as “Possible spam”), so you don’t lose real leads.

### Spam protection

The contact route includes lightweight anti-bot measures (honeypot + timing check + rate limiting). If you want stronger protection later, we can add CAPTCHA back, but it’s intentionally removed for now.


