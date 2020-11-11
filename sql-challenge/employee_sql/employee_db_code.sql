CREATE TABLE departments (

	department_no VARCHAR(30),
	department_name VARCHAR(30)

);

SELECT * FROM departments;

CREATE TABLE dept_emp (

	emp_no VARCHAR(50),
	dept_no VARCHAR(50)

);

SELECT * FROM dept_emp;

CREATE TABLE dept_manager (

	dept_no VARCHAR(30),
	emp_no VARCHAR(50)

);

SELECT * FROM dept_manager;

CREATE TABLE employees (

	emp_no VARCHAR(50),
	emp_title VARCHAR(50),
	birth_date DATE,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	sex VARCHAR(50),
	hire_date DATE

);

SELECT * FROM employees;

--DROP TABLE employees;

CREATE TABLE salaries (

	emp_no VARCHAR(50),
	salary VARCHAR(50)
	
);

SELECT * FROM salaries;

CREATE TABLE titles (

	title_id VARCHAR(10),
	title VARCHAR(100)

);

SELECT * FROM titles;

--List the following details of each employee: 
--employee number, last name, first name, sex, and salary.

--select data from employees and salary tables

SELECT * FROM employees;

SELECT employees.emp_no, last_name, first_name, sex, salaries.salary
FROM employees
INNER JOIN salaries
ON employees.emp_no = salaries.emp_no;

--List first name, last name, and hire date for employees who were hired in 1986.

SELECT first_name, last_name, hire_date
FROM employees
WHERE hire_date >= '1986-01-01' AND hire_date <= '1986-12-31';

--List the manager of each department with the following information: department number, 
--department name, the manager's employee number, last name, first name.

SELECT 
	departments.department_no,
	departments.department_name, 
	dept_manager.emp_no,
	employees.last_name, 
	employees.first_name
	
FROM dept_manager
INNER JOIN departments
	ON dept_manager.dept_no = departments.department_no
INNER JOIN employees
	ON employees.emp_no = dept_manager.emp_no;

--List the department of each employee with the following information: employee number, 
--last name, first name, and department name.

SELECT
	employees.emp_no,
	employees.last_name,
	employees.first_name,
	departments.department_name
	
FROM employees
INNER JOIN dept_emp
	ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments
	ON departments.department_no = dept_emp.dept_no;
	
--List first name, last name, and sex for 
--employees whose first name is "Hercules" and last names begin with "B."

SELECT
	employees.first_name,
	employees.last_name,
	employees.sex
FROM employees
WHERE employees.last_name LIKE 'B%' 
	AND employees.first_name = 'Hercules';
	
--List all employees in the Sales department, 
--including their employee number, last name, first name, and department name.

SELECT
	employees.emp_no,
	employees.last_name,
	employees.first_name,
	departments.department_name
	
FROM employees
INNER JOIN dept_emp
	ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments
	ON departments.department_no = dept_emp.dept_no
WHERE departments.department_name = 'Sales';

--List all employees in the Sales and Development departments, 
--including their employee number, last name, first name, and department name.

SELECT
	employees.emp_no,
	employees.last_name,
	employees.first_name,
	departments.department_name
	
FROM employees
INNER JOIN dept_emp
	ON dept_emp.emp_no = employees.emp_no
INNER JOIN departments
	ON departments.department_no = dept_emp.dept_no
WHERE departments.department_name IN ('Sales', 'Development');

-- In descending order, list the frequency count of 
--employee last names, i.e., how many employees share each last name.

SELECT
	employees.last_name,
	COUNT(last_name) AS "Count of Last Names"
	
FROM employees
GROUP BY last_name;