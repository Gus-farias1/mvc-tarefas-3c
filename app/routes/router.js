var express = require("express");
var router = express.Router();
const { body, query, validationResult } = require("express-validator");
const { tarefasModel } = require("../models/tarefasModel");
const moment = require("moment");

moment.locale("pt-br");

const tarefaVazia = {
    id_tarefa: 0,
    nome_tarefa: "",
    prazo_tarefa: "",
    situacao_tarefa: 1
};

const validarDataHojeOuFuturo = (value) => {
    const dataInformada = new Date(`${value}T00:00:00`);

    if (Number.isNaN(dataInformada.getTime())) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return dataInformada >= hoje;
};

const montarTarefaFormulario = (bodyData = {}) => {
    const id = Number.parseInt(bodyData.id, 10);
    const situacao = Number.parseInt(bodyData.situacao, 10);

    return {
        id_tarefa: Number.isNaN(id) ? 0 : id,
        nome_tarefa: bodyData.tarefa || "",
        prazo_tarefa: bodyData.prazo || "",
        situacao_tarefa: Number.isNaN(situacao) ? 1 : situacao
    };
};

const renderFormulario = (res, tarefa, erros = {}, tituloPagina = "Nova Tarefa") => {
    res.render("pages/cadastro", {
        tituloAba: tituloPagina === "Nova Tarefa" ? "Cadastro de tarefa" : "Edição de tarefa",
        tituloPagina,
        tarefa,
        erros
    });
};

const validacaoCadastro = [
    body("id")
        .optional({ checkFalsy: true })
        .isInt({ min: 0 })
        .withMessage("O identificador da tarefa é inválido."),
    body("tarefa")
        .trim()
        .isLength({ min: 5, max: 45 })
        .withMessage("O nome da tarefa deve ter entre 5 e 45 caracteres."),
    body("prazo")
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("Informe uma data válida.")
        .bail()
        .custom(validarDataHojeOuFuturo)
        .withMessage("O prazo deve ser hoje ou uma data futura."),
    body("situacao")
        .isInt({ min: 0, max: 5 })
        .withMessage("A situação deve ser um número inteiro entre 0 e 5.")
];

const validacaoId = [
    query("id")
        .isInt({ min: 1 })
        .withMessage("O identificador da tarefa é inválido.")
];

router.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});

router.get("/", async function (req, res) {
    try {
        const linhas = await tarefasModel.findAll();
        res.render("pages/index", {
            linhasTabela: linhas,
            tituloLista: "Lista de tarefas a fazer - 3C",
            exibindoEscondidas: false
        });
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.get("/escondidas", async function (req, res) {
    try {
        const linhas = await tarefasModel.findHidden();
        res.render("pages/index", {
            linhasTabela: linhas,
            tituloLista: "Tarefas escondidas - 3C",
            exibindoEscondidas: true
        });
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.get("/cadastro", (req, res) => {
    renderFormulario(res, tarefaVazia);
});

router.get("/alterar", validacaoId, async (req, res) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.redirect("/");
    }

    const id = req.query.id;

    try {
        const tarefa = await tarefasModel.findById(id);

        if (Array.isArray(tarefa) && tarefa.length > 0) {
            return renderFormulario(res, tarefa[0], {}, "Alterar Tarefa");
        }

        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.post("/cadastro", validacaoCadastro, async (req, res) => {
    const erros = validationResult(req);
    const tarefaFormulario = montarTarefaFormulario(req.body);
    const tituloPagina = tarefaFormulario.id_tarefa > 0 ? "Alterar Tarefa" : "Nova Tarefa";

    if (!erros.isEmpty()) {
        return renderFormulario(res, tarefaFormulario, erros.mapped(), tituloPagina);
    }

    const objJson = {
        id: tarefaFormulario.id_tarefa,
        nome: tarefaFormulario.nome_tarefa,
        prazo: tarefaFormulario.prazo_tarefa,
        situacao: tarefaFormulario.situacao_tarefa
    };

    try {
        if (objJson.id === 0) {
            await tarefasModel.create(objJson);
        } else {
            await tarefasModel.update(objJson);
        }

        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        renderFormulario(
            res,
            tarefaFormulario,
            { geral: { msg: "Não foi possível salvar a tarefa." } },
            tituloPagina
        );
    }
});

router.get("/delete", validacaoId, async (req, res) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.redirect("/");
    }

    try {
        await tarefasModel.deleteFisico(req.query.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.get("/delete-soft", validacaoId, async (req, res) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.redirect("/");
    }

    try {
        await tarefasModel.deleteLogico(req.query.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.get("/restaurar", validacaoId, async (req, res) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.redirect("/");
    }

    try {
        await tarefasModel.restaurarLogico(req.query.id);
        res.redirect("/escondidas");
    } catch (erro) {
        console.log(erro);
        res.redirect("/escondidas");
    }
});

module.exports = router;
