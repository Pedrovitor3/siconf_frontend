import {
  Avatar,
  Button,
  Dropdown,
  List,
  Popconfirm,
  Space,
  message,
} from 'antd';
import { useState, useEffect } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import {
  deleteFrequencia,
  getFrequencia,
} from '../../hooks/services/axios/frequenciaService';
import ModalFrequencia from '../../components/Modal/ModalFrequencia';

require('../index.css');

type Props = {
  setChave: (id: string) => void;
  onFrequenciaIdChange: (id: string) => void;
};

export default function Board({ setChave, onFrequenciaIdChange }: Props) {
  const [frequencia, setFrequencia] = useState<any[]>([]);
  const [showFrequenciaModal, setShowFrequenciaModal] = useState(false);
  const [recordFrequencia, setRecordFrequencia] = useState<any>({});

  useEffect(() => {
    setShowFrequenciaModal(false);
    loadingFrequencia();
  }, []);

  const updateFrequenciaList = (frequencia: any) => {
    setFrequencia(prevFrequencia => [...prevFrequencia, frequencia]);
    loadingFrequencia();
  };

  async function loadingFrequencia() {
    try {
      const response = await getFrequencia(`frequencia`);
      if (response !== false) {
        setFrequencia(response.data);
      } else {
        message.error('Ocorreu um erro inesperado ao obter as frequências.');
      }
    } catch (error) {
      message.error('Ocorreu um erro inesperado ao obter as frequências.');
    }
  }

  const handleFrequenciaClick = (FrequenciaId: string) => {
    setChave('3');
    onFrequenciaIdChange(FrequenciaId);
  };

  const handleMenuClick = (e: any) => {
    if (e.key === '1') {
      setShowFrequenciaModal(true);
    }
  };

  const clickDeleteFrequencia = async (record: any) => {
    await deleteFrequencia(record.id);
    const newFrequencia = frequencia.filter(
      frequencia => frequencia.id !== record.id,
    );
    setFrequencia(newFrequencia);
  };

  const hideModal = (refresh: boolean) => {
    setShowFrequenciaModal(false);
    setRecordFrequencia(null);
    if (refresh) setFrequencia([]);
  };

  const renderMenu = (record: any) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordFrequencia(record);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro de frequência?"
                    onConfirm={() => clickDeleteFrequencia(record)}
                  >
                    Excluir
                  </Popconfirm>
                ),
                key: '2',
                danger: true,
              },
            ],
            onClick: handleMenuClick,
          }}
        >
          <a onClick={e => e.preventDefault()} className="option">
            <Space>
              <MoreOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

  return (
    <div className="container">
      <Button
        className="button-criar"
        type="primary"
        onClick={() => {
          setShowFrequenciaModal(true);
        }}
      >
        Criar Frequência
      </Button>
      <List
        className="lista"
        itemLayout="horizontal"
        dataSource={frequencia}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              className="item-lista"
              avatar={<Avatar src={require('../../assets/ssp-icon.png')} />}
              title={
                <div>
                  <span className="icon-wrapper">{renderMenu(item)}</span>

                  <Button
                    type="primary"
                    className="button-list"
                    onClick={() => {
                      setChave('3');
                      handleFrequenciaClick(item.id);
                    }}
                  >
                    {item.name}
                  </Button>
                </div>
              }
              description={
                <div style={{ marginLeft: '30px' }}>{item.data}</div>
              }
            />
          </List.Item>
        )}
      />
      <ModalFrequencia
        updateFrequenciaList={updateFrequenciaList}
        id={recordFrequencia?.id}
        closeModal={hideModal}
        openModal={showFrequenciaModal}
      />
    </div>
  );
}
