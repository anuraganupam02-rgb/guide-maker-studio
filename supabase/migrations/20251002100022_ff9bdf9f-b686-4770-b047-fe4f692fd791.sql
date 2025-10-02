-- Fix search_path for generate_patient_id function
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
BEGIN
  new_id := 'PAT' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE patient_id = new_id) LOOP
    new_id := 'PAT' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  END LOOP;
  RETURN new_id;
END;
$$;