-- V4: Create categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    ledger_id VARCHAR(36),
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#808080',
    icon VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_ledger FOREIGN KEY (ledger_id) REFERENCES ledgers(id)
);

CREATE INDEX idx_categories_ledger_id ON categories(ledger_id);
CREATE INDEX idx_categories_is_default ON categories(is_default);
