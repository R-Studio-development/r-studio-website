export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        const { results } = await env.DB.prepare(
            'SELECT * FROM portfolio ORDER BY created_at DESC'
        ).all();
        
        return new Response(JSON.stringify({ portfolio: results }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message, portfolio: [] }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}