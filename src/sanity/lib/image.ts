import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './client'

const imageBuilder = createImageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => imageBuilder.image(source)
