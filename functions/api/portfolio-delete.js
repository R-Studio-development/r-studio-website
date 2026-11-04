export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { password, id } = await request.json();
        
        if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'رمز عبور اشتباه است' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await env.DB.prepare('DELETE FROM portfolio WHERE id = ?').bind(id).run();
        
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