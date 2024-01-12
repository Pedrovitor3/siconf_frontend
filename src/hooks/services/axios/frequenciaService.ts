import { getConfig } from '../../../configs/sistemaConfig';
import { message } from 'antd';
import { APIFrequencia } from './baseService/baseService';

export async function getFrequencia(url: any) {
  try {
    const response = await APIFrequencia.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os frequencia, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the frequencia list.${error}`,
    );
  }
  return false;
}

export async function postFrequencia(frequencia: any) {
  try {
    await APIFrequencia.post('/frequencia', frequencia, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateFrequencia = async (frequencia: any, id: any) => {
  try {
    await APIFrequencia.put(`frequencia/${id}`, frequencia, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os frequencia, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the frequencia list.${error}`,
    );
  }
};

export async function deleteFrequencia(id: any) {
  try {
    await APIFrequencia.delete(`frequencia/${id}`, getConfig('priv'));
    message.warning('frequencia excluido');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os frequencia, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the frequencia list .${error}`,
    );
  }
}
