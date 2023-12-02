DROP DATABASE IF EXISTS Arcadium;
CREATE DATABASE Arcadium;
USE Arcadium;
CREATE TABLE Estado(
    id INT PRIMARY KEY AUTO_INCREMENT,
    sigla CHAR(2) NOT NULL
);

CREATE TABLE Empresa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomeResposavel VARCHAR (60) NOT NULL,
  nomeFantasia VARCHAR (60) NOT NULL,
  cnpj CHAR (14) NOT NULL,
  tel CHAR (14) NOT NULL,
  cep CHAR(10),
  tipoLogradouro VARCHAR(100),
  logradouro VARCHAR (200) NOT NULL,
  numero VARCHAR (5) NOT NULL,
  complemento VARCHAR (20),
  bairro VARCHAR (200),
  cidade VARCHAR (200) NOT NULL,
  fkEstado INT,
  CONSTRAINT fkEstadoConst FOREIGN KEY (fkEstado) REFERENCES Estado(id)
  );
  
  CREATE TABLE Permissao(
    id INT PRIMARY KEY AUTO_INCREMENT,
    autoridade VARCHAR(100)
);

CREATE TABLE Usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR (60) NOT NULL,
  senha VARCHAR (60) NOT NULL,
  fkPermissao INT,
  fkEmpresa INT,
  CONSTRAINT fkPermissaoConst FOREIGN KEY (fkPermissao) REFERENCES Permissao(id),
  CONSTRAINT fkEmpresaConst FOREIGN KEY (fkEmpresa) REFERENCES Empresa(id)
);

CREATE TABLE statusTotem (
id INT PRIMARY KEY AUTO_INCREMENT,
statusTotem VARCHAR(20), constraint chkStatus check(statusTotem in ('ativo' , 'inativo'))
);

CREATE TABLE Indicadores (
id INT PRIMARY KEY AUTO_INCREMENT,
LimiteCPU decimal(5,2),
LimiteRAM decimal(5,2),
LimiteDisco decimal(5,2),
IndicadorUSB int
);

CREATE TABLE sistemaOperacional (
id INT PRIMARY KEY AUTO_INCREMENT,
distribuicao VARCHAR(20) NOT NULL,
versionamento VARCHAR(20) NOT NULL
);

CREATE TABLE totem (
id INT PRIMARY KEY AUTO_INCREMENT,
fkempresa INT, CONSTRAINT fkemp FOREIGN KEY (fkempresa) REFERENCES Empresa(id),
fkindicadores INT, CONSTRAINT fkindic FOREIGN KEY (fkindicadores) REFERENCES Indicadores(id),
fkstatus INT, CONSTRAINT fkstat FOREIGN KEY (fkstatus) REFERENCES statusTotem(id),
fksistemaoperacional INT, CONSTRAINT fkso FOREIGN KEY (fksistemaoperacional) REFERENCES sistemaOperacional(id),
dtInstalacao DATE,
RAMtotal INT,
CPUtotal DECIMAL(5,2),
DISCOtotal INT,
enderecoMAC varchar(45)
);

CREATE TABLE logErro (
id INT PRIMARY KEY AUTO_INCREMENT,
logErro varchar(300)
);

CREATE TABLE dados (
dt_hora DATETIME ,
valorDisco DOUBLE,
valorMemoriaRAM DECIMAL (5,2),
valorCPU DECIMAL (5,2),
USB INT,
fktotem INT, CONSTRAINT fktot FOREIGN KEY (fktotem) REFERENCES totem(id),
fklog INT, CONSTRAINT fklog FOREIGN KEY (fklog) REFERENCES logErro(id),
PRIMARY KEY (dt_hora, fktotem)
);

INSERT INTO Estado (sigla) VALUES
('AC'),
('AL'),
('AP'),
('AM'),
('BA'),
('CE'),
('DF'),
('ES'),
('GO'),
('MA'),
('MT'),
('MS'),
('MG'),
('PA'),
('PB'),
('PR'),
('PE'),
('PI'),
('RJ'),
('RN'),
('RS'),
('RO'),
('RR'),
('SC'),
('SP'),
('SE'),
('TO');

INSERT INTO Permissao (autoridade) VALUES 
('Administrador Total'),
('Administrador Técnico'),
('FuncUser'),
('TecUser');

INSERT INTO empresa Values
(null, 'Ronaldo Mequirsh', 'Rei do Burguer', '01555028000161', '011999999999','04010010', 'Rua', 'Rua 10', '123', null, 'centro', 'São Paulo',25);

INSERT INTO usuario Values
(null, 'ronaldomeq@rdb.com','admin123',1,1);

INSERT INTO sistemaoperacional Values
(null, 'Windows', 'Windows 10');

INSERT INTO indicadores VALUES
(null, 30.00, 30.00, 30.00, 2);

INSERT INTO totem values
(null, 1, 1, 1, 1, current_date, 8.0, 6.0, 120.0, "teste");

INSERT INTO statusTotem Values
(null,'ativo'),
(null, 'inativo');

-- INSERÇÕES DE DADOS NO BANCO!!!!!
-- TODOS COMPONENTES EM ALERTA CRITICO (TOTEM É ID 1, INDICADOR É 30 PRA DISCO/RAM/CPU E 2 PRA USB)
insert into dados values
(current_timestamp(), 50.0, 50.0, 50.0, 1, 1, null);

-- APENAS CPU EM ALERTA CRITICO  (TOTEM É ID 1, INDICADOR É 30 PRA DISCO/RAM/CPU E 2 PRA USB)
insert into dados values
(current_timestamp(), 20.0, 20.0, 33.0, 2, 1, null);

-- APENAS DISCO EM ALERTA CRITICO  (TOTEM É ID 1, INDICADOR É 30 PRA DISCO/RAM/CPU E 2 PRA USB)
insert into dados values
(current_timestamp(), 75.0, 12.0, 15.0, 2, 1, null);

-- APENAS RAM EM ALERTA CRITICO  (TOTEM É ID 1, INDICADOR É 30 PRA DISCO/RAM/CPU E 2 PRA USB)
insert into dados values
(current_timestamp(), 20.0, 44.0, 12.0, 2, 1, null);

-- SEM ALERTAS CRITICOS (TOTEM É ID 1, INDICADOR É 30 PRA DISCO/RAM/CPU E 2 PRA USB)
insert into dados values
(current_timestamp(), 5.0, 12.0, 15.0, 2, 1, null);