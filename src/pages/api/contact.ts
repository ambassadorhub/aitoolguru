export const prerender = false;

const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
const CONTACT_EMAIL = 'hello@aitoolguru.co.uk';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { name, email, subject, message, website } = data;

    // Honeypot: bots fill this, humans don't
    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Block known test patterns
    if (email === 'check@example.com' || message?.includes('Hourly status check')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email via SendGrid
    const emailData = {
      personalizations: [{ to: [{ email: CONTACT_EMAIL }] }],
      from: { email: 'hello@aitoolguru.co.uk', name: 'AI Tool Guru' },
      reply_to: { email: email, name: name },
      subject: `[Contact Form] ${subject}`,
      content: [{ type: 'text/plain', value: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}` }]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid error:', errorText);
      throw new Error('SendGrid API error');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
