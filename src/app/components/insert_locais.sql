-- Apaga todos os dados existentes na tabela
DELETE FROM LOCAIS_VOTACAO;
COMMIT;

-- Insere os novos registros

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (1, 'Colegio Omega', 'Rua Gilberto Freyre, 47 - Stella Maris, Salvador - BA', 58, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (2, 'Escola Genesis Stella Maris', 'Rua Capitao Melo, 185 - Stella Maris, Salvador - BA', 21, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (3, 'Colegio Marizia Maior', 'Alameda Praia de Guarapari, 455, Stella Maris, Salvador - BA, 41600-090', 29, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (4, 'Colegio Estadual Marechal Mascarenhas De Morais', 'Avenida Dorival Caymmi, s/n - Itapua, Salvador - BA', 89, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (5, 'Escola Municipal Dorival Caymmi', 'Rua Reinaldo Calixto, 25 - Nova Brasilia de Itapua, Salvador - BA', 165, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (6, 'Escola Municipal De Sao Cristovao', 'Rua Poco Verde, S/N - Sao Cristovao, Salvador - BA', 465, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (7, 'Escola Sulamericana', 'Rua Thales de Azevedo, 26 - Praia do Flamengo, Salvador - BA', 104, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (8, 'Escola Municipal Manuel Lisboa', 'Rua Antonino Casaes, 199 - Itapua, Salvador - BA', 32, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (9, 'Escola Municipal Lagoa Do Abaete', 'Rua Paulo Afonso Baqueiro, 558 - Nova Brasilia de Itapua, Salvador - BA, 41611-205', 148, NULL, NULL);

-- Atenção: para o registro abaixo, o endereço contém CEP; se não for desejado, verifique se a informação está correta.
INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (10, 'Escola Municipal Senhora Valentina Silvina Santos', 'Rua Sao Cristovao, 48 - Sao Cristovao, Salvador - BA, 42700-000', 120, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (11, 'Colegio Estadual Pinto de Aguiar', 'Rua Dr. Arthur Couto - Mussurunga I, Salvador - BA, 41490-350', 7, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (12, 'Colegio Estadual Azevedo Fernandes', 'Largo do Pelourinho, 11 - Pelourinho, Salvador - BA', 29, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (13, 'Escola Parque Salvador', 'Rua Saldanha Marinho, 138 - Liberdade, Salvador - BA, 40323-010', 11, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (14, 'Colegio Estadual Goes Calmon', 'Avenida Dom Joao VI, 131 - Brotas, Salvador - BA', 74, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (15, 'Colegio Salesiano do Salvador', 'Praca Conselheiro Almeida Couto, 400 - Saude, Salvador - BA, 40301-110', 45, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (16, 'IFBA', 'Rua Emidio dos Santos, 285 - Barbalho, Salvador - BA, 40301-285', 189, NULL, NULL);

INSERT INTO LOCAIS_VOTACAO (ID_LOCAL, NOME, ENDERECO, VAGAS, LATITUDE, LONGITUDE)
VALUES (17, 'Escola Getulio Vargas', 'Praca do Barbalho, 70 - Barbalho, Salvador - BA, 40301-000', 41, NULL, NULL);

COMMIT;
