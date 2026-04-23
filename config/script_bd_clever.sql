CREATE DATABASE bzh0f6e0licpifgzt0g7;
USE bzh0f6e0licpifgzt0g7;
CREATE TABLE tarefas (
 id_tarefa int NOT NULL AUTO_INCREMENT,
 nome_tarefa varchar(45) NOT NULL,
 prazo_tarefa date NOT NULL,
 situacao_tarefa int NOT NULL DEFAULT '1',
 status_tarefa int NOT NULL DEFAULT  '1',
 PRIMARY KEY (id_tarefa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO bzh0f6e0licpifgzt0g7.tarefas (nome_tarefa, prazo_tarefa, situacao_tarefa)
VALUES ('Formatar PC do Cliente 1', '2022-06-25', '1');
INSERT INTO bzh0f6e0licpifgzt0g7.tarefas (nome_tarefa, prazo_tarefa, situacao_tarefa) 
VALUES ('Instalar Antivirus no PC do Cliente 2', '2022-06-20', '1');
INSERT INTO bzh0f6e0licpifgzt0g7.tarefas (nome_tarefa, prazo_tarefa, situacao_tarefa) 
VALUES ('Formatar PC do Cliente 2', '2022-06-28', '1');
INSERT INTO bzh0f6e0licpifgzt0g7.tarefas (nome_tarefa, prazo_tarefa, situacao_tarefa)
VALUES ('Instalar Antivirus no PC do Cliente 2', '2022-06-22', '1');