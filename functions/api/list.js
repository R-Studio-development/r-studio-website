export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // خواندن سه نظر تأیید شده آخر
        const { results } = await env.DB.prepare(
            'SELECT name, review, created_at FROM reviews WHERE approved = 1 ORDER BY created_at DESC LIMIT 3'
        ).all();
        
        return new Response(JSON.stringify({ reviews: results }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // کش ۵ دقیقه‌ای
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message, reviews: [] }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}