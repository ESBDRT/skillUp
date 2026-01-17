-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-images', 'course-images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public read access for course images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-images');

-- Create policy for service role to upload images
CREATE POLICY "Service role can upload course images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'course-images');

-- Create policy for service role to update images
CREATE POLICY "Service role can update course images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'course-images');

-- Create policy for service role to delete images
CREATE POLICY "Service role can delete course images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'course-images');