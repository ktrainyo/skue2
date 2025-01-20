CREATE TRIGGER analyze_and_copy_tokens_trigger
AFTER
INSERT
    OR
UPDATE ON new_token_data FOR EACH ROW EXECUTE FUNCTION analyze_and_copy_tokens();
