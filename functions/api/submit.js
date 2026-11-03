export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const data = await request.json();
        const { name, review, 'cf-turnstile-response': token } = data;
        
        // ۱. اعتبارسنجی ورودی
        if (!name || !review || !token) {
            return new Response(JSON.stringify({ error: 'اطلاعات ناقص است' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (review.length < 10) {
            return new Response(JSON.stringify({ error: 'متن نظر خیلی کوتاه است' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // ۲. تأیید توکن Turnstile
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: '0x4AAAAAAFxuS-rPiidFdg2npX-RVvL8SR8',
                response: token
            })
        });
        
        const verifyResult = await verifyResponse.json();
        
        if (!verifyResult.success) {
            return new Response(JSON.stringify({ error: 'تأیید ربات ناموفق بود' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // ۳. ذخیره در دیتابیس
        await env.DB.prepare(
            'INSERT INTO reviews (name, review, approved) VALUES (?, ?, 0)'
        ).bind(name, review).run();
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'خطای سرور: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}