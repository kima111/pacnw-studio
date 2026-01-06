## Contact form setup (no public email address)

This project includes a contact form that submits to a server route (`POST /api/contact`) and sends you an email **without putting your email address in the client HTML**.

### 1) Configure email sending (Resend)

Set these environment variables on your host (ex: Vercel Project → Settings → Environment Variables):

- **`CONTACT_TO_EMAIL`**: where you want inquiries delivered (your private email)
- **`CONTACT_FROM_EMAIL`**: a verified sender identity in Resend (example: `PacNW Studio <hello@yourdomain.com>`)
- **`RESEND_API_KEY`**: your Resend API key

Notes:
- In **development**, if `RESEND_API_KEY` is missing, the API route will **log the message to the server console** so you can test the form end-to-end.
- In **production**, missing `RESEND_API_KEY` will cause the route to return an error (so you don’t silently lose leads).

### Spam protection

The contact route includes lightweight anti-bot measures (honeypot + timing check + rate limiting). If you want stronger protection later, we can add CAPTCHA back, but it’s intentionally removed for now.


