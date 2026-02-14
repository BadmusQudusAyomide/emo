import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'emo_pages')
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to upload image')
  }
  
  const data = await response.json()
  return data.secure_url
}

export const optimizeImageUrl = (url: string, options: {
  width?: number
  height?: number
  quality?: number
  crop?: string
} = {}) => {
  const params = new URLSearchParams()
  
  if (options.width) params.append('w', options.width.toString())
  if (options.height) params.append('h', options.height.toString())
  if (options.quality) params.append('q', options.quality.toString())
  if (options.crop) params.append('c', options.crop)
  
  const baseUrl = url.split('/upload/')[0] + '/upload/'
  const publicId = url.split('/upload/')[1]
  
  return baseUrl + params.toString() + '/' + publicId
}
