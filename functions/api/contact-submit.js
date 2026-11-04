export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const data = await request.json();
        const { name, email, phone, subject, message } = data;
        
        // اعتبارسنجی: نام، شماره تماس و پیام اجباری هستند
        if (!name || !phone || !message) {
            return new Response(JSON.stringify({ error: 'اطلاعات ناقص است' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // ذخیره در دیتابیس (ایمیل اختیاری است)
        await env.DB.prepare(
            'INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)'
        ).bind(name, email || '', phone, subject || '', message).run();
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
