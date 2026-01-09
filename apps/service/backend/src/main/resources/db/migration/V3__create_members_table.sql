-- V3: Create members table
CREATE TABLE members (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ledger_id VARCHAR(36) NOT NULL,
    role VARCHAR(20) NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invited_by VARCHAR(36),
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_members_ledger FOREIGN KEY (ledger_id) REFERENCES ledgers(id),
    CONSTRAINT fk_members_invited_by FOREIGN KEY (invited_by) REFERENCES users(id),
    CONSTRAINT uk_members_user_ledger UNIQUE (user_id, ledger_id)
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_ledger_id ON members(ledger_id);
