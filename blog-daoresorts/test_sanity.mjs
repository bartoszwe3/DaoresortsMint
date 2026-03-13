import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Bypass CDN to check latest
});

async function run() {
    try {
        const posts = await sanityClient.fetch(`*[_type == "post"] { 
            _id, 
            title, 
            slug, 
            coverImage, 
            kategoria, 
            publishedAt, 
            "isDraft": _id match "drafts.*" 
        }`);
        console.log("Published docs returned by query:", JSON.stringify(posts, null, 2));

        const allDocs = await sanityClient.fetch(`*[] { _id, _type, title }`);
        const allPosts = allDocs.filter(d => d._type === 'post' || d._type.includes('post'));
        console.log("All docs of type post:", allPosts);

    } catch (err) {
        console.error("Sanity fetch error:", err);
    }
}

run();
