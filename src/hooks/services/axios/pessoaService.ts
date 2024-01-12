import { getConfig } from '../../../configs/sistemaConfig';
import { message } from 'antd';
import { APIFrequencia } from './baseService/baseService';

export async function getPessoa(url: any) {
  try {
    const response = await APIFrequencia.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar pessoa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the person list.${error}`,
    );
  }
  return false;
}

export async function postPessoa(pessoa: any) {
  try {
    await APIFrequencia.post('/pessoa', pessoa, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updatePessoa = async (pessoa: any, id: any) => {
  try {
    await APIFrequencia.put(`pessoa/${id}`, pessoa, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar pessoa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the person list.${error}`,
    );
  }
};

export async function deletePessoa(id: any) {
  try {
    await APIFrequencia.delete(`pessoa/${id}`, getConfig('priv'));
    message.warning('pessoa excluido');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar pessoa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the person list .${error}`,
    );
  }
}
