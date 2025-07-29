const fetch = require('node-fetch');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        if (!data.phone || !data.message) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Phone and message are required' }) };
        }

        const response = await fetch('https://rest.clicksend.com/v3/sms/send', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.CLICKSEND_USERNAME}:${process.env.CLICKSEND_API_KEY}`).toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        source: 'pos-system',
                        body: data.message,
                        to: data.phone,
                        custom_string: 'receipt'
                    }
                ]
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.response_msg || 'Failed to send SMS');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, result })
        };
    } catch (err) {
        console.error('❌ send-receipt error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
