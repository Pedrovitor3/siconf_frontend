import { getConfig } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: urlsServices.LEGADOWS,
  //withCredentials: true,
});

export const useAxiosSICAD = () => ({
  unidadesPC: async () => {
    const response = await api.get(
      `/unidadesPC?token=${localStorage.getItem('token_sso')}`,
      getConfig('pub'),
    );
    return response;
  },
  unidadePorId: async (unidade: number) => {
    const response = await api.get(
      `/unidadePorId/${unidade}?token=${localStorage.getItem('token_sso')}`,
      getConfig('pub'),
    );
    return response;
  },
  servidoresPorUnidade: async (unidade: number) => {
    const response = await api.get(
      `/servidoresPorUnidadeId/${unidade}?token=${localStorage.getItem(
        'token_sso',
      )}`,
      getConfig('pub'),
    );
    return response;
  },
  servidoresPCPorFiltrosDiversos: async (
    municipioLotacao?: string | undefined,
    nome?: string | undefined,
    cpf?: string | undefined,
    funcao?: string | undefined,
    postGrad?: string | undefined,
    lotacao?: string | undefined,
    dtFiltroInicioLotacao?: string | undefined,
    dtFiltroFimLotacao?: string | undefined,
    dtFiltroInicioPosse?: string | undefined,
    dtFiltroFimPosse?: string | undefined,
  ) => {
    /*const raw = JSON.stringify({
      municipioLotacao: municipioLotacao,
      nome: nome,
      cpf: cpf,
      funcao: funcao,
      postGrad: postGrad,
      lotacao: lotacao,
      dtFiltroInicioLotacao: dtFiltroInicioLotacao,
      dtFiltroFimLotacao: dtFiltroFimLotacao,
      dtFiltroInicioPosse: dtFiltroInicioPosse,
      dtFiltroFimPosse: dtFiltroFimPosse,
    });*/
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      {
        municipioLotacao,
        nome,
        cpf,
        funcao,
        postGrad,
        lotacao,
        dtFiltroInicioLotacao,
        dtFiltroFimLotacao,
        dtFiltroInicioPosse,
        dtFiltroFimPosse,
      },
      getConfig('priv'),
    );
    return response;
  },

  /**
   * Busca de servidores por filtros Diversos
   *
   */
  //Por CPF
  servidoresPCPorCPF: async (cpf: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { cpf },
      getConfig('priv'),
    );
    return response;
  },
  //Por Nome
  servidoresPCPorNome: async (nome: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { nome },
      getConfig('priv'),
    );
    return response;
  },
  //Por Nome
  servidoresPCPorMunicipioLotacao: async (municipioLotacao: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { municipioLotacao },
      getConfig('priv'),
    );
    return response;
  },
  //Por Função
  servidoresPCPorFuncao: async (funcao: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { funcao },
      getConfig('priv'),
    );
    return response;
  },
  //Por Posto Graduacao
  servidoresPCPorPostoGraduacao: async (postGrad: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { postGrad },
      getConfig('priv'),
    );
    return response;
  },
  //Por Lotação
  servidoresPCPorLotacao: async (lotacao: string) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { lotacao },
      getConfig('priv'),
    );
    return response;
  },
  //Por Lotação
  servidoresPCPorDtInicioFimLotacao: async (
    dtFiltroInicioLotacao: string,
    dtFiltroFimLotacao: string | null,
  ) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { dtFiltroInicioLotacao, dtFiltroFimLotacao },
      getConfig('priv'),
    );
    return response;
  },
  //Por Lotação
  servidoresPCPorDtInicioFimPosse: async (
    dtFiltroInicioPosse: string,
    dtFiltroFimPosse: string | null,
  ) => {
    const response = await api.post(
      '/servidoresPCPorFiltrosDiversos',
      { dtFiltroInicioPosse, dtFiltroFimPosse },
      getConfig('priv'),
    );
    return response;
  },
});
