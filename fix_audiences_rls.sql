-- Enable RLS on audiences table (if not already enabled)
ALTER TABLE audiences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON audiences;

-- Create policy to allow public read access to audiences table
CREATE POLICY "Enable read access for all users"
ON audiences FOR SELECT
USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'audiences';
