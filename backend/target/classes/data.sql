INSERT INTO users (
    first_name,
    last_name,
    email,
    identity_number,
    role,
    enabled,
    date_created
) VALUES (
             'Jan',
             'Kowalski',
             'testowy@test.pl',
             'INIT12345678',
             'ADMIN',
             TRUE,
             CURRENT_TIMESTAMP
         );

INSERT INTO preconsultations (id, subject, description, active, date_created, author_id) VALUES
                                                                                             (101, 'Regulacje E-sportu', 'Ministerstwo Sportu zaprasza do udziału w pre-konsultacjach dotyczących prawnego uregulowania branży e-sportowej w Polsce..', TRUE, '2025-11-20 10:00:00', 1),
                                                                                             (102, 'Praca zdalna w administracji', 'Konsultacje dotyczące rozszerzenia możliwości pracy zdalnej w urzędach administracji publicznej.', TRUE, '2025-11-25 14:30:00', 1),
                                                                                             (103, 'Zielone miasta przyszłości', 'Dyskusja nad nowymi standardami zieleni miejskiej i infrastruktury ekologicznej', TRUE, '2025-11-28 09:15:00', 1);