var express = require("express");
var router = express.Router();

var dadosController = require("../controllers/dadosController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/puxarDadosCpu/:idTotem", function (req, res) {
    dadosController.puxarDadosCpu(req, res);
})

router.get("/puxarDadosRam/:idTotem", function(req, res){
    dadosController.puxarDadosRam(req, res);
})

router.get("/puxarDadosDisco/:idTotem", function(req, res){
    dadosController.puxarDadosDisco(req, res);
})

router.get("/puxarDadosUsb/:idTotem", function(req, res){
    dadosController.puxarDadosUsb(req, res);
})

router.get("/puxarStatusTotens", function(req, res){
    dadosController.puxarStatusTotens(req, res);
})
//
router.get("/puxarTotensForaServico", function(req, res){
    dadosController.puxarTotensForaServico(req, res);
})

module.exports = router;