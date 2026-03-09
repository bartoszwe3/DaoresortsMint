import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
    projectId: import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'd547hmfr',
    dataset: import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production',
    apiVersion: import.meta.env.SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2024-01-01',
    useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
