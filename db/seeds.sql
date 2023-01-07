-- Engineering --
    -- Manufacturing Engineer --
        -- Juliet Sparks --
    -- Industrial Engineer --
        -- 	Hans-Augusto Rey --
    -- Controls Engineer --
        -- Enzo Blevins --
    -- Engineering Manager --
        -- Brandon Sanderson --
-- Finance --
    -- Chief Financial Officer --
        -- Claire Case --
    -- Comptroller -- 
        -- Elsa Knight --
    -- Accountant --
        -- Amorina Brucca --
-- Human Resources --
    -- Director --
        -- Margret Rey --
    -- Specialist --
        -- Anita Brewer --
-- Quality -- 
    -- Quality Technician --
        -- Tamsyn Muir --
    -- Quality System Engineer --
        -- Zoe Rorvig --
    -- Quality Assurance Engineer --
        -- Scott Westerfeld --
-- Supply Chain Management --
    -- Shipping Manager --
        -- Kimberly Jones --
    -- Receiving Manager --
        -- Kelvin Slater --
    -- Shipping Associate --
        -- Samantha Shannon --
    -- Receiving Associate --
        -- Marco Allison --

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
    ('Shipping Manager', 100000, 5),
    ('SReceiving Manager', 100000, 5),
    ('Shipping Associate', 100000, 5),
    ('Receiving Associate', 100000, 5);


