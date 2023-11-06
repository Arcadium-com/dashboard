var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/dadosController");

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

router.get("/puxarStatusTotem", function(req, res){
    dadosController.puxarStatusTotem(req, res);
})
//
router.get("/puxarTotensForaServico", function(req, res){
    
})



module.exports = router;