-- V6: Create invitations table
CREATE TABLE invitations (
    id VARCHAR(36) PRIMARY KEY,
    ledger_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    invite_code VARCHAR(64) NOT NULL UNIQUE,
    invited_by VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invitations_ledger FOREIGN KEY (ledger_id) REFERENCES ledgers(id),
    CONSTRAINT fk_invitations_invited_by FOREIGN KEY (invited_by) REFERENCES users(id)
);

CREATE INDEX idx_invitations_invite_code ON invitations(invite_code);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_ledger_id ON invitations(ledger_id);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);
