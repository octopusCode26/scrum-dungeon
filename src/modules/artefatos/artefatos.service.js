const artefatosRepository = require("./artefatos.repository");

async function listarArtefatosDoUsuario(idUsuario) {
  return await artefatosRepository.buscarArtefatosPorUsuario(idUsuario);
}

async function obterArtefato(idUsuario, idArtefato) {
  return await artefatosRepository.buscarArtefatoPorId(idUsuario, idArtefato);
}

async function obterArtefatoPorModulo(idUsuario, idModulo) {
  const artefato = await artefatosRepository.buscarArtefatoPorModulo(
    idUsuario,
    idModulo,
  );

  if (!artefato) return null;

  const podeColetar = await artefatosRepository.usuarioPodeColetarArtefato(
    idUsuario,
    artefato.id,
  );

  if (!artefato.desbloqueado && !podeColetar) {
    const error = new Error("Artefato ainda não pode ser acessado");
    error.statusCode = 403;
    throw error;
  }

  return artefato;
}

async function coletarArtefatoDoUsuario(idUsuario, idArtefato) {
  const artefato = await artefatosRepository.buscarArtefatoPorId(
    idUsuario,
    idArtefato,
  );

  if (!artefato) {
    const error = new Error("Artefato não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const podeColetar = await artefatosRepository.usuarioPodeColetarArtefato(
    idUsuario,
    idArtefato,
  );

  if (!podeColetar) {
    const error = new Error("Artefato ainda não pode ser coletado");
    error.statusCode = 403;
    throw error;
  }

  await artefatosRepository.coletarArtefato(idUsuario, idArtefato);

  return await artefatosRepository.buscarArtefatoPorId(idUsuario, idArtefato);
}

module.exports = {
  listarArtefatosDoUsuario,
  obterArtefato,
  obterArtefatoPorModulo,
  coletarArtefatoDoUsuario,
};
