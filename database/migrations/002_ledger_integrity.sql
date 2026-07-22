BEGIN;

CREATE OR REPLACE FUNCTION prevent_ledger_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Ledger records are immutable. Use reversal transactions instead.';
END;
$$;

DROP TRIGGER IF EXISTS ledger_transactions_no_update_delete ON ledger_transactions;
CREATE TRIGGER ledger_transactions_no_update_delete
BEFORE UPDATE OR DELETE ON ledger_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_mutation();

DROP TRIGGER IF EXISTS ledger_entries_no_update_delete ON ledger_entries;
CREATE TRIGGER ledger_entries_no_update_delete
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_mutation();

CREATE OR REPLACE FUNCTION assert_ledger_transaction_balanced()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_transaction_id uuid;
  debit_total bigint;
  credit_total bigint;
BEGIN
  target_transaction_id := COALESCE(NEW.ledger_transaction_id, OLD.ledger_transaction_id);

  SELECT
    COALESCE(SUM(CASE WHEN direction = 'DEBIT' THEN amount_minor ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount_minor ELSE 0 END), 0)
  INTO debit_total, credit_total
  FROM ledger_entries
  WHERE ledger_transaction_id = target_transaction_id;

  IF debit_total <> credit_total THEN
    RAISE EXCEPTION
      'Ledger transaction % is not balanced. Debits: %, credits: %',
      target_transaction_id,
      debit_total,
      credit_total;
  END IF;

  IF debit_total = 0 OR credit_total = 0 THEN
    RAISE EXCEPTION 'Ledger transaction % must contain debit and credit entries', target_transaction_id;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS ledger_entries_balance_check ON ledger_entries;
CREATE CONSTRAINT TRIGGER ledger_entries_balance_check
AFTER INSERT ON ledger_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION assert_ledger_transaction_balanced();

COMMIT;
