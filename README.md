# LEAGUE-OF-LEGENDS-BACKEND-NODEJS

Back-end com Node.JS focado no uso da API externa da RIOT-GAMES em conjunto com o front-end [LEAGUE-OF-LEGENDS-APP-REACT-NATIVE](https://github.com/lucascicco/LEAGUE-OF-LEGENDS-APP-REACT-NATIVE), a aplicação front-end.

O banco de dados usado foi o PostgreSQL, ou seja, um banco de dados relacional, fez-se o uso da dependência **sequelize** para fazer a conexão com o banco de dados.

Lembrando que, as informações secretas estão dentro do arquivo ".env", porém não aparece pois está no .gitignore, as "variáveis de ambiente", administradas pelo pacote instalado "dotenv".

Basicamente, esse back-end é bem simples, pois possui apenas uma "table", dada pela migration "Users".
Atributos dessa tabela: 

- id
- nickname
- email
- password_hash
- created_at
- updated_at

Outro aspecto importante é o uso da API EXTERNA do league of legends disponibilizada pela RIOT GAMES, usando-se o pacote **riot-lol-api** para meio de requisões com essa API.

Desenvolvido por,

lucascicco.
