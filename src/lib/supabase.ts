// Mock Supabase client for development without database
export const supabase = {
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-user-1', email: 'user@example.com' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-user-1', email: 'user@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock auth state change - start with no user
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        then: async (callback: any) => callback({ data: [], error: null })
      }),
      then: async (callback: any) => callback({ data: [], error: null })
    }),
    insert: () => ({
      select: async () => ({ data: null, error: null })
    }),
    update: () => ({
      eq: () => ({
        then: async (callback: any) => callback({ data: null, error: null })
      })
    })
  })
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          custom_domain: string | null
          stripe_account_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          custom_domain?: string | null
          stripe_account_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          custom_domain?: string | null
          stripe_account_id?: string | null
          created_at?: string | null
        }
      }
      stores: {
        Row: {
          id: string
          user_id: string
          name: string | null
          description: string | null
          theme: any | null
          settings: any | null
          is_published: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          description?: string | null
          theme?: any | null
          settings?: any | null
          is_published?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          description?: string | null
          theme?: any | null
          settings?: any | null
          is_published?: boolean | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          store_id: string
          name: string | null
          description: string | null
          price: number | null
          type: string | null
          settings: any | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          store_id: string
          name?: string | null
          description?: string | null
          price?: number | null
          type?: string | null
          settings?: any | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          store_id?: string
          name?: string | null
          description?: string | null
          price?: number | null
          type?: string | null
          settings?: any | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
    }
  }
} 