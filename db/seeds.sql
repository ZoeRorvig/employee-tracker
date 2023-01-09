USE employee_db;

INSERT INTO department (name)
    VALUES
    ('Engineering'), -- 1 --
    ('Finance'), -- 2 --
    ('Human Resources'), -- 3 --
    ('Quality'), -- 4 --
    ('Supply Chain Management'); -- 5 --

INSERT INTO role (title, salary, department_id)
    VALUES
    ('Manufacturing Engineer', 100000, 1),
    ('Industrial Engineer', 100000, 1),
    ('Controls Engineer', 100000, 1),
    ('Engineering Manager', 100000, 1),
    ('Chief Financial Officer', 100000, 2),
    ('Comptroller', 100000, 2),
    ('Accountant', 100000, 2),
    ('Director', 100000, 3),
    ('Specialist', 100000, 3),
    ('Quality Technician', 100000, 4),
    ('Quality System Engineer', 100000, 4),
    ('Quality Assurance Engineer', 100000, 4),
    ('Quality Manager', 100000, 4),
    ('Shipping Manager', 100000, 5),
    ('Receiving Manager', 100000, 5),
    ('Shipping Associate', 100000, 5),
    ('Receiving Associate', 100000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ('Juliet', 'Sparks', 1, 4),
    ('Hans-Augusto', 'Rey', 2, 4),
    ('Enzo', 'Blevins', 3, 4),
    ('Brandon', 'Sanderson', 4, null),
    ('Claire', 'Case', 5, null),
    ('Elsa', 'Knight', 6, 5),
    ('Amorina', 'Brucca', 7, 5),
    ('Margret', 'Ray', 8, null),
    ('Anita', 'Brewer', 9, 8),
    ('Tamsyn', 'Muir', 10, 13),
    ('Zoe', 'Rorvig', 11, 13),
    ('Scott', 'Westerfeld', 12, 13),
    ('Jim', 'Troeger', 13, null),
    ('Kimberly', 'Jones', 14, null),
    ('Kelvin', 'Slater', 15, null),
    ('Samantha', 'Shannon', 16, 14),
    ('Marco', 'Allison', 17, 15);
