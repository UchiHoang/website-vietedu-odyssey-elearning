-- Drop the overly permissive policy that exposes all user roles
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON user_roles;

-- Create restrictive policy - users can only see their own role
CREATE POLICY "Users can view their own role" 
ON user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all roles (needed for admin dashboard functionality)
CREATE POLICY "Admins can view all roles" 
ON user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));