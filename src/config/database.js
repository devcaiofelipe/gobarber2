module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    // configura o sequelize para criar o nome das tabelas e colunas no formato
    // caixa baixa separado por underline user_groups
    underscored: true,
    underscoredAll: true
  },
};