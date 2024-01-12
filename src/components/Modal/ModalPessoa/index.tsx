import { Modal, Form, Input, Col, message, Row, Select, Button } from 'antd';
import { useEffect, useState } from 'react';
import {
  getPessoa,
  postPessoa,
  updatePessoa,
} from '../../../hooks/services/axios/pessoaService';
import FormItem from 'antd/es/form/FormItem';
import { useAxiosSICAD } from '../../../hooks/useAxiosSICAD';

import InputMask from 'react-input-mask';
import { SendOutlined } from '@ant-design/icons';

require('../index.css');

type Props = {
  updatePessoaList: any;
  id: string;
  frequenciaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalPessoa = ({
  updatePessoaList,
  id,
  frequenciaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();
  const apiAxiosSicad = useAxiosSICAD();

  const [pessoas, setPessoas] = useState<any[]>([]);
  const [itsOk, setItsOk] = useState<boolean>(false);

  const [cpf, setCpf] = useState(''); // Estado para armazenar o CPF digitado pelo usuário

  useEffect(() => {
    loadingPessoa();
    loadingAllPessoa();
  }, [id]);

  useEffect(() => {
    if (openModal) {
      loadingAllPessoa();
      loadingPessoa();
    }
  }, [openModal]);

  async function loadingAllPessoa() {
    const response = await getPessoa(`pessoa`);
    if (response !== false) {
      const filteredPessoa = response.data.filter((pessoa: any) => {
        return pessoa.frequencia && pessoa.frequencia.id === frequenciaId;
      });
      setPessoas(filteredPessoa);
    } else {
      message.error('Ocorreu um erro inesperado ao obter os dados.');
    }
  }

  async function loadingPessoa() {
    if (id) {
      await getPessoa(`pessoa/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            name: response.data.name,
            cpf: response.data.cpf,
            situacao: response.data.situacao,
            faltas: response.data.faltas,
            regional: response.data.regional,
            observacao: response.data.observacao,
            unidade_policial: response.data.unidade_policial,
            cargo: response.data.cargo,
            frequencia: response.data.frequencia,
            position: response.data.position,
          });
          setCpf(response.data.cpf);
        } else {
          message.error('Ocorreu um erro inesperado ao obter os dados.');
        }
      });
    }
  }
  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue(true);
        if (itsOk) {
          if (id) {
            submitUpdate();
            //setCpf('');
          } else {
            loadingAllPessoa();

            //gera a pposição da proxima pessoa
            const lastPosition = pessoas.reduce((maxPosition, pessoa) => {
              return pessoa.position > maxPosition
                ? pessoa.position
                : maxPosition;
            }, 0);

            formData.position = lastPosition + 1;
            submitCreate();
            setCpf('');
          }
          form.resetFields();
          closeModal(true);
        } else {
          message.error('Erro ao preencher dados');
        }
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos.'));
  };

  //verifica se o cpf cadastrado ja fi cadastrado
  const handleHasServer = async (cpf: any) => {
    const res = await getPessoa('/pessoa');
    if (res !== false) {
      const filterServers = res.data.filter(
        (pessoa: any) =>
          pessoa.frequencia && pessoa.frequencia.id === frequenciaId,
      );

      const existingPerson = filterServers.find(
        (pessoa: any) => pessoa.cpf === cpf,
      );

      if (existingPerson && existingPerson.cpf === cpf) {
        return false;
      } else {
        return true;
      }
    }
  };

  const submitUpdate = async () => {
    const editingPessoa = form.getFieldsValue(true);

    await updatePessoa(editingPessoa, id);
    message.success('Editado com sucesso');

    updatePessoaList(editingPessoa);
  };

  const submitCreate = async () => {
    const editingPessoa = form.getFieldsValue(true);
    await postPessoa(editingPessoa);

    updatePessoaList(editingPessoa);
    setPessoas(prePessoas => [...prePessoas, editingPessoa]);
  };

  //verifica cpf e busca no sicad
  const handleFindCPF = async (cpf: string) => {
    const res = isCPFValid(cpf); //verifica se cpf é valido

    if (res) {
      const cpfClean = cpf.replace(/\D/g, '');

      try {
        const res = await apiAxiosSicad.servidoresPCPorCPF(cpfClean); //busca cpf no sicad
        const servidores = res.data;

        const existServer = await handleHasServer(cpfClean); //verifica se ja existe um servidor cadastrado

        if (existServer) {
          if (servidores.length > 0) {
            const primeiroServidor = servidores[0]; // Acesse o primeiro servidor no array
            const dadosServidor = {
              name: primeiroServidor.nome,
              cpf: primeiroServidor.cpf,
              unidade_policial: primeiroServidor.lotacaoSigla,
              cargo: primeiroServidor.postoGrad,
              regional: primeiroServidor.regional,
              situacao: primeiroServidor.situacao,

              // Adicione outras propriedades aqui, se necessário
            };
            setItsOk(true);
            form.setFieldsValue(dadosServidor);
            message.success('Servidor encontrado com sucesso');
          } else {
            setItsOk(false);
            message.error('Nenhum servidor encontrado com o CPF informado.');
          }
        } else {
          setItsOk(false);
          message.error('Já existe um servidor cadastrado com esse CPF');
        }
      } catch {
        setItsOk(false);

        message.error('Erro ao buscar servidor');
      }
    } else {
      setItsOk(false);

      message.error('CPF inválido');
    }
  };
  //verificacao do cpf
  const handleCpfChange = (e: any) => {
    const newCpf = e.target.value;
    setCpf(newCpf);
  };

  const isCPFValid = (value: string) => {
    const cleanedCPF = value.replace(/\D/g, '');

    if (cleanedCPF.length !== 11) {
      return false;
    }

    // Verifique se todos os dígitos são iguais (CPF inválido se todos os dígitos forem iguais)
    if (/^(\d)\1{10}$/.test(cleanedCPF)) {
      return false;
    }

    // Cálculo dos dígitos verificadores
    let sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanedCPF[i - 1]) * (11 - i);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cleanedCPF[9])) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanedCPF[i - 1]) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cleanedCPF[10])) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Modal
        visible={openModal}
        title="Pessoa"
        okText="Salvar"
        width={800}
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={5}>
            <Col offset={2} span={4}>
              <Form.Item
                name="cpf"
                label="CPF"
                rules={[
                  { required: true, message: 'Insira um CPF válido' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || isCPFValid(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Insira um CPF válido');
                    },
                  }),
                ]}
              >
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  onChange={handleCpfChange}
                  style={{
                    height: '25px',
                    width: '100%',
                    fontSize: '15px', // Aumente o tamanho da fonte para preencher o espaço
                    textAlign: 'center', // Centralize o texto horizontalmente
                  }}
                />
              </Form.Item>
            </Col>
            <Col offset={0} span={1}>
              <Button
                style={{
                  marginTop: '31px',
                  marginLeft: '0px',
                  marginRight: '10px',
                  width: '4%',
                  height: '33%',
                }}
                className="button-modal"
                onClick={() => {
                  handleFindCPF(cpf);
                }}
              >
                <div className="icone">
                  <SendOutlined style={{ marginBottom: '5px' }} />
                </div>
              </Button>
            </Col>
            <Col offset={1} span={13}>
              <Form.Item name="name" label="Nome">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col offset={2} span={12}>
              <Form.Item name="unidade_policial" label="Unidade policial">
                <Input />
              </Form.Item>
            </Col>
            <Col offset={1} span={6}>
              <Form.Item name="situacao" label="Situação">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={2} span={12}>
              <Form.Item name="cargo" label="Cargo">
                <Input />
              </Form.Item>
            </Col>
            <Col offset={1} span={6}>
              <Form.Item name="regional" label="Regional">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={2} span={12}>
              <Form.Item name="observacao" label="Observação">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col offset={1} span={6}>
              <Form.Item name="faltas" label="Faltas">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <FormItem
            name="frequencia"
            style={{ display: 'none' }}
            initialValue={frequenciaId}
          ></FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default ModalPessoa;
