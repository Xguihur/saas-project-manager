CREATE DATABASE IF NOT EXISTS saas_project_manager_shadow;
GRANT ALL PRIVILEGES ON saas_project_manager_shadow.* TO 'saas_app'@'%';
FLUSH PRIVILEGES;
