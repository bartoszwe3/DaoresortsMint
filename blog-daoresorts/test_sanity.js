import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: 'd547hmfr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Bypass CDN to check latest
});

async function run() {
    const posts = await sanityClient.fetch(`*[_type == "post"] { _id, title, _updatedAt, "isDraft": _id match "drafts.*" }`);
    console.log("All posts (including drafts if queried correctly, but without token we only see published unless auth):", posts);
    
    // Check if there are drafts by attempting to fetch everything
    const allDocs = await sanityClient.fetch(`*[] { _id, _type }`);
    console.log("All docs count:", allDocs.length);
    const draftPosts = allDocs.filter(d => d._id.startsWith('drafts.'));
    console.log("Draft docs:", draftPosts);
}

run().catch(console.error);
