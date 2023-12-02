var express = require("express");
var router = express.Router();

var dadosController = require("../controllers/dadosController");

router.get("/puxarStatusTotens/:idEmpresa", function(req, res){
    dadosController.puxarStatusTotens(req, res);
})
//
router.get("/puxarTotensForaServico/:idEmpresa", function(req, res){
    dadosController.puxarTotensForaServico(req, res);
})
router.get("/puxarTotemComMaisAlertas/:idEmpresa",function(req, res){
    dadosController.puxarTotemComMaisAlertas(req, res)
})

router.get("/puxarHorariosComQuantidadeAlertas/:idEmpresa", async function(req, res) {
    await dadosController.puxarHorariosComQuantidadeAlertas(req, res);
});

router.get("/puxarMaquinas/:idEmpresa", function(req, res){
    dadosController.puxarMaquinas(req, res);
})

router.get("/puxarDadosMaquina/:idMaquina", function(req, res){
    dadosController.puxarDadosMaquina(req, res);
})

router.get("/puxarIndicadores/:idMaquina", function(req, res){
    dadosController.puxarIndicadores(req, res);
})
router.get("/puxarDadoMaisRecente/:idMaquina", function(req, res){
    dadosController.puxarDadoMaisRecente(req, res);
})
router.get("/puxarDiasMesComQuantidadeAlertas/:idEmpresa", function(req, res){
    dadosController.puxarDiasMesComQuantidadeAlertas(req, res);
})

router.get("/puxarDiaSemanaComMaisAlertas/:idEmpresa", function(req, res){
    dadosController.puxarDiaSemanaComMaisAlertas(req, res);
})

router.get("/puxarDadoMaisRecenteTodasMaquinas/:idEmpresa", function(req, res){
    dadosController.puxarDadoMaisRecenteTodasMaquinas(req, res)
})


module.exports = router;