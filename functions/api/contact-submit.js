export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;
        
        // اعتبارسنجی ساده
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: 'اطلاعات ناقص است' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // ذخیره در دیتابیس
        await env.DB.prepare(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
        ).bind(name, email, subject || '', message).run();
        
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