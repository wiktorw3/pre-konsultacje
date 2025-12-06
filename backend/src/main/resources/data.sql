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