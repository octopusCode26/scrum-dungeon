const artefatosService = require("./artefatos.service");

async function listarArtefatosController(req, res) {
  const idUsuario = req.usuario?.id_usuario;

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  try {
    const artefatos = await artefatosService.listarArtefatosDoUsuario(idUsuario);
    return res.status(200).json({ success: true, data: artefatos });
  } catch (error) {
    console.error("Erro em listarArtefatosController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

async function detalheArtefatoController(req, res) {
  const idUsuario = req.usuario?.id_usuario;
  const idArtefato = Number(req.params.id);

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!Number.isInteger(idArtefato) || idArtefato <= 0) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const artefato = await artefatosService.obterArtefato(
      idUsuario,
      idArtefato,
    );

    if (!artefato) {
      return res.status(404).json({ message: "Artefato não encontrado" });
    }

    return res.status(200).json({ success: true, data: artefato });
  } catch (error) {
    console.error("Erro em detalheArtefatoController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

async function detalheArtefatoPorModuloController(req, res) {
  const idUsuario = req.usuario?.id_usuario;
  const idModulo = Number(req.params.idModulo);

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!Number.isInteger(idModulo) || idModulo <= 0) {
    return res.status(400).json({ message: "ID do módulo inválido" });
  }

  try {
    const artefato = await artefatosService.obterArtefatoPorModulo(
      idUsuario,
      idModulo,
    );

    if (!artefato) {
      return res.status(404).json({ message: "Artefato não encontrado" });
    }

    return res.status(200).json({ success: true, data: artefato });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Erro em detalheArtefatoPorModuloController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

async function coletarArtefatoController(req, res) {
  const idUsuario = req.usuario?.id_usuario;
  const idArtefato = Number(req.params.id);

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!Number.isInteger(idArtefato) || idArtefato <= 0) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const artefato = await artefatosService.coletarArtefatoDoUsuario(
      idUsuario,
      idArtefato,
    );

    return res.status(200).json({
      success: true,
      message: "Artefato coletado com sucesso",
      data: artefato,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Erro em coletarArtefatoController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

module.exports = {
  listarArtefatosController,
  detalheArtefatoController,
  detalheArtefatoPorModuloController,
  coletarArtefatoController,
};
