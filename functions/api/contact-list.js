export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { password } = await request.json();
        
        if (password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'رمز عبور اشتباه است' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const { results } = await env.DB.prepare(
            'SELECT * FROM messages ORDER BY created_at DESC'
        ).all();
        
        return new Response(JSON.stringify({ messages: results }), {
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