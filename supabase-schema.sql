-- =============================================
-- KARACHI GREEN MAP - SUPABASE DATABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase SQL Editor to set up the database
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

-- =============================================
-- 1. PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    trees_planted INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- 2. TREES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.trees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tree_name TEXT NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    photo_url TEXT,
    qr_code_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    rejection_reason TEXT,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on trees
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;

-- Trees policies
CREATE POLICY "Users can view their own trees"
    ON public.trees FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trees"
    ON public.trees FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending trees"
    ON public.trees FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pending trees"
    ON public.trees FOR DELETE
    USING (auth.uid() = user_id AND status = 'pending');

-- Anyone can view verified trees (for public map)
CREATE POLICY "Anyone can view verified trees"
    ON public.trees FOR SELECT
    USING (status = 'verified');

-- Admins can view all trees
CREATE POLICY "Admins can view all trees"
    ON public.trees FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update all trees (for verification)
CREATE POLICY "Admins can update all trees"
    ON public.trees FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- 3. TRIGGERS FOR AUTO-UPDATING timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trees_updated_at
    BEFORE UPDATE ON public.trees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. TRIGGER FOR AUTO-CREATING PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 5. STORAGE BUCKETS
-- =============================================
-- Note: Run these in SQL Editor or create buckets manually in Storage section

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create tree-photos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tree-photos', 'tree-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create qr-codes bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 6. STORAGE POLICIES
-- =============================================

-- Avatars bucket policies
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- Tree photos bucket policies
CREATE POLICY "Authenticated users can upload tree photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'tree-photos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view tree photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'tree-photos');

-- QR codes bucket policies
CREATE POLICY "Authenticated users can upload QR codes"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'qr-codes' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view QR codes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'qr-codes');

-- =============================================
-- 7. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_trees_user_id ON public.trees(user_id);
CREATE INDEX IF NOT EXISTS idx_trees_status ON public.trees(status);
CREATE INDEX IF NOT EXISTS idx_trees_location ON public.trees(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =============================================
-- 8. OPTIONAL: CREATE ADMIN USER
-- =============================================
-- After creating an account through the app, run this to make it an admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';

-- =============================================
-- 9. SAMPLE DATA (OPTIONAL - for testing)
-- =============================================
-- Uncomment and modify if you want test data

/*
-- Insert sample trees (replace USER_ID with actual user id)
INSERT INTO public.trees (user_id, tree_name, description, latitude, longitude, address, status)
VALUES 
    ('USER_ID', 'Neem Tree', 'Beautiful neem tree planted in park', 24.8607, 67.0011, 'Clifton, Karachi', 'verified'),
    ('USER_ID', 'Mango Tree', 'Young mango sapling', 24.8700, 67.0300, 'DHA Phase 5, Karachi', 'pending'),
    ('USER_ID', 'Banyan Tree', 'Large banyan providing shade', 24.8500, 67.0200, 'Saddar, Karachi', 'verified');
*/

-- =============================================
-- SETUP COMPLETE!
-- =============================================
-- After running this SQL:
-- 1. Sign up a user through the app
-- 2. Make that user an admin by running:
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- 3. Test the app functionality
-- =============================================
