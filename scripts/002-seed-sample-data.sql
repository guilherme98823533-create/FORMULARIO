-- Seed sample data for development and testing
-- This script creates sample users, subscriptions, and budget requests

-- Insert sample users
INSERT INTO users (store_name, owner_name, email, password_hash, slug, whatsapp, email_verified) VALUES
('Andaimes São Paulo', 'João Silva', 'joao@andaimessp.com', '$2b$12$LQv3c1yqBwEHxv68JaMCuOHrXwgjn.cy/Y3TkAiB/gTrcUpVOmc1C', 'andaimes-sao-paulo', '(11) 99999-9999', true),
('Andaimes Rio', 'Maria Santos', 'maria@andaimesrio.com', '$2b$12$LQv3c1yqBwEHxv68JaMCuOHrXwgjn.cy/Y3TkAiB/gTrcUpVOmc1C', 'andaimes-rio', '(21) 88888-8888', true),
('Construção & Andaimes', 'Pedro Costa', 'pedro@construcao.com', '$2b$12$LQv3c1yqBwEHxv68JaMCuOHrXwgjn.cy/Y3TkAiB/gTrcUpVOmc1C', 'construcao-andaimes', '(11) 77777-7777', false)
ON CONFLICT (email) DO NOTHING;

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, status, current_period_start, current_period_end, stripe_customer_id) VALUES
(1, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 'cus_sample_1'),
(2, 'active', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP + INTERVAL '15 days', 'cus_sample_2'),
(3, 'inactive', NULL, NULL, NULL);

-- Insert sample budget requests
INSERT INTO budget_requests (user_id, client_name, client_email, client_phone, scaffold_type, scaffold_height, tower_quantity, status, items_data) VALUES
(1, 'Carlos Oliveira', 'carlos@empresa.com', '(11) 91234-5678', '1x1.50', '4M', 2, 'pending', 
 '{"painel-1x150": 8, "piso-1x150": 8, "diagonal-1x150": 4, "roda-1x150": 8, "sapata-1x150": 8, "guarda-corpo-sem-porta-1x150": 6, "guarda-corpo-porta-1x150": 2, "escada-2m-1x150": 4}'),

(1, 'Ana Rodrigues', 'ana@construtora.com', '(11) 98765-4321', '1x2.00', '3M', 1, 'responded', 
 '{"painel-1x200": 6, "piso-1x200": 5, "diagonal-1x200": 2, "roda-1x200": 4, "sapata-1x200": 4, "guarda-corpo-sem-porta-1x200": 3, "guarda-corpo-porta-1x200": 1, "escada-1m-1x200": 1, "escada-2m-1x200": 1}'),

(1, 'Roberto Lima', 'roberto@obras.com', '(11) 95555-5555', '1x1', '5M', 3, 'pending', 
 '{"painel-1x1": 30, "piso-1x1": 9, "diagonal-1x1": 6, "roda-1x1": 12, "sapata-1x1": 12, "guarda-corpo-sem-porta-1x1": 9, "guarda-corpo-porta-1x1": 3, "escada-1m-1x1": 3, "escada-2m-1x1": 6}'),

(2, 'Fernanda Alves', 'fernanda@predial.com', '(21) 91111-1111', '1x1.50', '6M', 1, 'pending', 
 '{"painel-1x150": 12, "piso-1x150": 4, "diagonal-1x150": 3, "roda-1x150": 4, "sapata-1x150": 4, "guarda-corpo-sem-porta-1x150": 3, "guarda-corpo-porta-1x150": 1, "escada-2m-1x150": 3}');

-- Insert sample payments
INSERT INTO payments (user_id, subscription_id, amount, status, payment_method, stripe_payment_intent_id) VALUES
(1, 1, 99.90, 'succeeded', 'card', 'pi_sample_1'),
(2, 2, 99.90, 'succeeded', 'card', 'pi_sample_2'),
(1, 1, 99.90, 'succeeded', 'card', 'pi_sample_3');

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, ip_address) VALUES
(1, 'user_login', 'user', 1, '{"login_time": "2024-10-25T10:00:00Z"}', '192.168.1.1'),
(1, 'budget_request_created', 'budget_request', 1, '{"client_name": "Carlos Oliveira", "scaffold_type": "1x1.50"}', '192.168.1.1'),
(2, 'user_login', 'user', 2, '{"login_time": "2024-10-25T11:00:00Z"}', '192.168.1.2'),
(1, 'budget_request_updated', 'budget_request', 2, '{"status": "responded"}', '192.168.1.1');
