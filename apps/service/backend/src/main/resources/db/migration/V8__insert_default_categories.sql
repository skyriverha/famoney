-- V8: Insert default categories
INSERT INTO categories (id, ledger_id, name, color, icon, is_default) VALUES
    ('cat-default-001', NULL, '식비', '#FF6B6B', 'restaurant', TRUE),
    ('cat-default-002', NULL, '교통비', '#4ECDC4', 'directions_car', TRUE),
    ('cat-default-003', NULL, '생활용품', '#45B7D1', 'shopping_cart', TRUE),
    ('cat-default-004', NULL, '공과금', '#96CEB4', 'receipt', TRUE),
    ('cat-default-005', NULL, '의료비', '#FFEAA7', 'local_hospital', TRUE),
    ('cat-default-006', NULL, '문화/여가', '#DDA0DD', 'movie', TRUE),
    ('cat-default-007', NULL, '교육', '#87CEEB', 'school', TRUE),
    ('cat-default-008', NULL, '의류/미용', '#FFB6C1', 'checkroom', TRUE),
    ('cat-default-009', NULL, '기타', '#808080', 'more_horiz', TRUE);
