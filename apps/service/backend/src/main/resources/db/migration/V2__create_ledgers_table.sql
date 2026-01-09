-- V2: Create ledgers table
CREATE TABLE ledgers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    currency VARCHAR(10) NOT NULL DEFAULT 'KRW',
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_ledgers_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_ledgers_created_by ON ledgers(created_by);
CREATE INDEX idx_ledgers_deleted_at ON ledgers(deleted_at);
