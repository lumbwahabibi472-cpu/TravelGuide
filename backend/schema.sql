CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT,
    best_time_to_visit TEXT,
    estimated_budget REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO destinations
(destination, country, description, best_time_to_visit, estimated_budget)
VALUES
('Victoria Falls', 'Zambia', 'Famous waterfall', 'June to October', 500),
('South Luangwa', 'Zambia', 'Wildlife safari destination', 'May to October', 800),
('Lake Kariba', 'Zambia', 'Lake for fishing and boating', 'May to August', 400),
('Cape Town', 'South Africa', 'Coastal city and Table Mountain', 'November to March', 900),
('Johannesburg', 'South Africa', 'Museums and historical attractions', 'March to May', 700),
('Nairobi', 'Kenya', 'City with a national park', 'July to October', 850),
('Serengeti', 'Tanzania', 'Wildlife and migration destination', 'June to October', 1200),
('Zanzibar', 'Tanzania', 'Island with beaches and history', 'June to October', 950),
('Maasai Mara', 'Kenya', 'Famous wildlife reserve', 'July to October', 1100),
('Chobe National Park', 'Botswana', 'National park known for elephants', 'May to October', 1000);