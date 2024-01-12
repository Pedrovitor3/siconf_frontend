import { Modal, Form, Input, Col, message, Row } from 'antd';
import { useEffect } from 'react';
import ReactInputMask from 'react-input-mask';
import {
  getFrequencia,
  postFrequencia,
  updateFrequencia,
} from '../../../hooks/services/axios/frequenciaService';
import moment from 'moment';

require('../index.css');

type Props = {
  updateFrequenciaList: any;
  id: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalFrequencia = ({
  updateFrequenciaList,
  id,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        if (id) {
          submitUpdate();
        } else {
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos.'));
  };

  useEffect(() => {
    loadingFrequencia();
  }, [id]);

  useEffect(() => {
    loadingFrequencia();
  }, []);

  async function loadingFrequencia() {
    if (id) {
      await getFrequencia(`frequencia/${id}`).then(response => {
        if (response !== false) {
          form.setFieldsValue({
            id: response.data.id,
            name: response.data.name,
            data: response.data.data,
          });
        } else {
          message.error('Ocorreu um erro inesperado ao obter as frequencia.');
        }
      });
    }
  }

  const submitUpdate = async () => {
    const editingDemand = form.getFieldsValue(true);
    await updateFrequencia(editingDemand, id);
    updateFrequenciaList(editingDemand);
  };

  const submitCreate = async () => {
    const editingDemand = form.getFieldsValue(true);
    await postFrequencia(editingDemand);
    updateFrequenciaList(editingDemand); // Chama a função updateAxleList com o novo axle
  };

  const isDateValid = (value: any) => {
    return moment(value, 'DD/MM/YYYY', true).isValid();
  };

  return (
    <>
      <Modal
        visible={openModal}
        title="Frequência"
        okText="Salvar"
        onCancel={() => {
          form.resetFields();
          closeModal(false);
        }}
        onOk={handleOk}
      >
        <Form layout="vertical" form={form}>
          <Col offset={3} span={17}>
            <Form.Item
              style={{ marginTop: '20px' }}
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome do frequência',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>

          <Col offset={3} span={7}>
            <Form.Item
              name={['data']}
              label="Data"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira a data',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || isDateValid(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Por favor, insira uma data válida');
                  },
                }),
              ]}
              hasFeedback
            >
              <ReactInputMask
                className="input-mask-date"
                placeholder="00/00/0000"
                maskChar={null}
                mask="99/99/9999"
              />
            </Form.Item>
          </Col>
        </Form>
        <Form layout="vertical" form={form}></Form>
      </Modal>
    </>
  );
};

export default ModalFrequencia;
