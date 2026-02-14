-- Update the pages table to include the new valentine_wish type
ALTER TABLE pages 
DROP CONSTRAINT IF EXISTS pages_type_check;

ALTER TABLE pages 
ADD CONSTRAINT pages_type_check 
CHECK (type IN ('message', 'memory', 'qa', 'valentine', 'valentine_wish', 'anonymous'));
