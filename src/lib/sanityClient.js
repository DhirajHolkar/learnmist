import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '7wv11tih',  // Replace with your actual Sanity Project ID
  dataset: 'production',  // Replace with your actual Sanity Dataset
  useCdn: false,
  apiVersion: '2023-12-01',
});
