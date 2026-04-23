// requisitar o pool de conexoes
const pool = require("../../config/pool_conexoes");

// criar um objeto com funcoes de acesso ao SGBD
const tarefasModel = {
    // select itens ativos
    findAll: async () => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and situacao_tarefa <> 5"
            );
            return linhas;
        } catch (erro) {
            console.error("Erro ao buscar tarefas:", erro);
            return [];
        }
    },

    // select itens escondidos
    findHidden: async () => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and situacao_tarefa = 5"
            );
            return linhas;
        } catch (erro) {
            console.error("Erro ao buscar tarefas escondidas:", erro);
            return [];
        }
    },

    // select por id especifico
    findById: async (id) => {
        try {
            const [linhas] = await pool.query(
                "select * from tarefas where status_tarefa = 1 and id_tarefa = ?",
                [id]
            );
            return linhas;
        } catch (erro) {
            console.error("Erro ao buscar tarefa por ID:", erro);
            return [];
        }
    },

    // insert
    create: async (dados) => {
        try {
            const [resultInsert] = await pool.query(
                "insert into tarefas(`nome_tarefa`,`prazo_tarefa`,`situacao_tarefa`) values(?,?,?)",
                [dados.nome, dados.prazo, dados.situacao]
            );
            return resultInsert;
        } catch (erro) {
            return erro;
        }
    },

    // update
    update: async (dados) => {
        try {
            const [resulUpdate] = await pool.query(
                "update tarefas set `nome_tarefa`= ?,`prazo_tarefa`= ?, `situacao_tarefa`= ? where id_tarefa = ?",
                [dados.nome, dados.prazo, dados.situacao, dados.id]
            );
            return resulUpdate;
        } catch (erro) {
            return erro;
        }
    },

    // deleteLogico
    deleteLogico: async (id) => {
        try {
            const [resultUpdate] = await pool.query(
                "update tarefas set `situacao_tarefa` = 5 where id_tarefa = ?",
                [id]
            );
            return resultUpdate;
        } catch (erro) {
            return erro;
        }
    },

    // restaurar tarefa escondida
    restaurarLogico: async (id) => {
        try {
            const [resultUpdate] = await pool.query(
                "update tarefas set `situacao_tarefa` = 1 where id_tarefa = ?",
                [id]
            );
            return resultUpdate;
        } catch (erro) {
            return erro;
        }
    },

    // deleteFisico
    deleteFisico: async (id) => {
        try {
            const [resultDelete] = await pool.query(
                "delete from tarefas where id_tarefa = ?",
                [id]
            );
            return resultDelete;
        } catch (error) {
            return error;
        }
    }
};

module.exports = { tarefasModel };
