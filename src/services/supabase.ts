import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project-id.supabase.co') {
  console.warn('Supabase credentials not properly configured. Please update your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export interface Page {
  id: string
  slug: string
  type: 'message' | 'memory' | 'qa' | 'valentine' | 'valentine_wish' | 'anonymous'
  tone: 'romantic' | 'playful' | 'mixed'
  occasion: 'valentine' | 'birthday' | 'other'
  content: Record<string, any>
  is_anonymous: boolean
  created_at: string
  expires_at?: string
}

export interface View {
  id: string
  page_id: string
  created_at: string
}

export interface Response {
  id: string
  page_id: string
  response: string
  created_at: string
}

export const createPage = async (pageData: Omit<Page, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating page:', error)
    throw new Error('Failed to create page. Please check your Supabase configuration.')
  }
}

export const fetchPageBySlug = async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching page:', error)
    throw new Error('Page not found or failed to load.')
  }
}

export const logView = async (pageId: string) => {
  try {
    const { error } = await supabase
      .from('views')
      .insert([{ page_id: pageId }])

    if (error) throw error
  } catch (error) {
    console.error('Error logging view:', error)
    // Don't throw error for logging - it's not critical
  }
}

export const saveResponse = async (pageId: string, response: string) => {
  try {
    const { data, error } = await supabase
      .from('responses')
      .insert([{ page_id: pageId, response }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving response:', error)
    throw new Error('Failed to save response.')
  }
}

export const fetchResponsesByPageId = async (pageId: string) => {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching responses:', error)
    throw new Error('Failed to fetch responses.')
  }
}
