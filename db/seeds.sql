INSERT INTO department (id, name)
VALUES
  (1, 'HR'),
  (2, 'Marketing'),
  (3, 'Finance');

INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'HR Manager', 80000, 1),
  (2, 'Marketing Manager', 90000, 2),
  (3, 'Finance Manager', 100000, 3),
  (4, 'HR Assistant', 45000, 1),
  (5, 'Marketing Assistant', 50000, 2),
  (6, 'Finance Assistant', 55000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
  (1, 'John', 'Doe', 1, null),
  (2, 'Jane', 'Doe', 2, null),
  (3, 'Bob', 'Smith', 3, null),
  (4, 'Alice', 'Johnson', 4, 1),
  (5, 'Fred', 'Jones', 5, 2),
  (6, 'Samantha', 'Williams', 6, 3);
