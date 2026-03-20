import { defineLive } from 'next-sanity/live'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uk2m3d91'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const liveClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-20',
  useCdn: false,
})

export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
