-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- 3. Function and trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  admin_status boolean;
BEGIN
  SELECT (role = 'admin') INTO admin_status FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(admin_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable RLS for menu tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;

-- 6. Setup Policies for Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories insertable by admins" ON public.categories;
CREATE POLICY "Categories insertable by admins" ON public.categories FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Categories updatable by admins" ON public.categories;
CREATE POLICY "Categories updatable by admins" ON public.categories FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Categories deletable by admins" ON public.categories;
CREATE POLICY "Categories deletable by admins" ON public.categories FOR DELETE USING (public.is_admin());

-- 7. Setup Policies for Products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Products insertable by admins" ON public.products;
CREATE POLICY "Products insertable by admins" ON public.products FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Products updatable by admins" ON public.products;
CREATE POLICY "Products updatable by admins" ON public.products FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Products deletable by admins" ON public.products;
CREATE POLICY "Products deletable by admins" ON public.products FOR DELETE USING (public.is_admin());

-- 8. Setup Policies for Product Sizes
DROP POLICY IF EXISTS "Product sizes are viewable by everyone" ON public.product_sizes;
CREATE POLICY "Product sizes are viewable by everyone" ON public.product_sizes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Product sizes insertable by admins" ON public.product_sizes;
CREATE POLICY "Product sizes insertable by admins" ON public.product_sizes FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Product sizes updatable by admins" ON public.product_sizes;
CREATE POLICY "Product sizes updatable by admins" ON public.product_sizes FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Product sizes deletable by admins" ON public.product_sizes;
CREATE POLICY "Product sizes deletable by admins" ON public.product_sizes FOR DELETE USING (public.is_admin());
