export const prerender = false;

const CONVERTKIT_API_SECRET = import.meta.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_FORM_ID = "9372684";

export async function POST({ request }) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe?api_secret=${CONVERTKIT_API_SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ConvertKit error:', errorData);
      throw new Error('ConvertKit API error: ' + errorData);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Subscribed successfully! Check your email to confirm.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
