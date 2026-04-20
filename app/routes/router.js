var express = require("express");
var router = express.Router();
//requisição do Model uso obrigatório de chaves e nome definido no objeto
const {tarefasModel} = require("../models/tarefasModel");
const moment = require("moment");
moment.locale('pt-br');



router.get("/", async function (req, res) {
    res.locals.moment = moment;
    try{
        const linhas = await tarefasModel.findAll();
        res.render("pages/index", {linhasTabela:linhas});
    }catch(erro){
        console.log(erro);
    }
});


router.get("/cadastro", (req, res)=>{
    res.locals.moment = moment;
    res.render("pages/cadastro",{tituloAba:"Cadastro de tarefa",tituloPagina:"Nova Tarefa",
        tarefa:{id_tarefa:0,nome_tarefa:"",prazo_tarefa:"",situacao_tarefa:1}
    });
});

router.get("/alterar", async (req, res)=>{
    res.locals.moment = moment;
    //recuperar o id da queryString
    const id = req.query.id;
    try{
        const tarefa = await tarefasModel.findById(id);

        if (Array.isArray(tarefa) && tarefa.length > 0) {
            res.render("pages/cadastro",{tituloAba:"Edição de tarefa",tituloPagina:"Alterar Tarefa",
                tarefa:tarefa[0]
            });
        } else {
            res.redirect("/");
        }
    }catch(erro){
        console.log(erro);
        res.redirect("/");
    }
});

router.post("/cadastro", async (req, res)=>{
    // adicionar validação de dados com o express-validator
    // nome - 5 a 45 caracteres
    // prazo data válida e hoje ou no futuro
    // situação - inteiro de 0 a 4 
    const objJson = {
        id: req.body.id,
        nome:req.body.tarefa,
        prazo:req.body.prazo,
        situacao:req.body.situacao
    }
    try{
        if(objJson.id == 0){
            var result = await tarefasModel.create(objJson);
        }else{
            var result = await tarefasModel.update(objJson);
        }
        console.log(result);
        res.redirect("/");
    }catch(erro){
        console.log(erro)
    }    
});


router.get("/teste-insert", async (req, res)=>{
    const dadosInsert =  {
            nome: "instalar o fortnite no Lab 1 Terreo",
            prazo:"2026-03-19"
            }
    try{
        const resultInsert = await tarefasModel.create(dadosInsert);
        res.send(resultInsert)    
    }catch(erro){
        console.log(erro);
    }

});


//delete físico - hard delete
router.get("/teste-delete", async (req, res)=>{
    let idTarefa = 17;
    try{
        res.send(resultDelete)    
    }catch(erro){
        console.log(erro);
    }
});

//exercicio - teste de update -> delete lógico ou soft delete
//delete lógico - soft delete
router.get("/teste-soft-delete", async (req, res)=>{
    let idTarefa = 15;
    try{
        res.send(resultUpdate);    
    }catch(erro){
        console.log(erro);
    }
});






module.exports = router;