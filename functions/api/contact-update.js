export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { password, id, action } = await request.json();
        
        if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'رمز عبور اشتباه است' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        if (action === 'read') {
            await env.DB.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').bind(id).run();
        } else if (action === 'delete') {
            await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
        } else {
            return new Response(JSON.stringify({ error: 'عملیات نامعتبر' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
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