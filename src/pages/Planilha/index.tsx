import {
  Button,
  Table,
  message,
  Spin,
  InputRef,
  Input,
  Space,
  Dropdown,
  Popconfirm,
} from 'antd';
import { useState, useEffect, useRef } from 'react';
import {
  deletePessoa,
  getPessoa,
  updatePessoa,
} from '../../hooks/services/axios/pessoaService';
import ModalPessoa from '../../components/Modal/ModalPessoa';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

require('../index.css');

type Props = {
  setChave: (id: string) => void;
  frequenciaId: string;
};

interface DataType {
  key: string;
  id: string;
  name: string;
  cpf: string;
  situacao: string;
  faltas: string;
  observacao: string;
  regional: string;
  unidade_policial: string;
  cargo: string;
  position: number;
}

type DataIndex = keyof DataType;

export default function Planinha({ frequenciaId, setChave }: Props) {
  const [loading, setLoading] = useState(false);
  const [pessoa, setPessoa] = useState<any[]>([]);

  const [showPessoaModal, setShowPessoaModal] = useState(false);
  const [recordIdPessoa, setRecordIdPessoa] = useState<any>('');

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  useEffect(() => {
    setShowPessoaModal(false);
    loadingPessoa();
  }, []);

  const hideModal = (refresh: boolean) => {
    setShowPessoaModal(false);
    setRecordIdPessoa(null);
    if (refresh) setPessoa([]);
  };

  const loadingPessoa = async () => {
    setLoading(true);
    try {
      const response = await getPessoa(`pessoa/`);
      if (response !== false) {
        //filtra as pessoas da frequencia recbida
        const filteredPessoa = response.data.filter(
          (pessoa: any) =>
            pessoa.frequencia && pessoa.frequencia.id === frequenciaId,
        );
        //ordena por posistion
        const sortedPessoa = filteredPessoa.sort((a: any, b: any) =>
          a.position > b.position ? 1 : -1,
        );

        setPessoa(sortedPessoa);
      } else {
        message.error('Erro ao obter dados das pessoas.');
      }
    } catch (error) {
      message.error('Ocorreu um erro ao carregar os dados das pessoas.');
    } finally {
      setLoading(false);
    }
  };

  const handleBoletimClick = () => {
    setChave('2');
  };

  const updatePessoaList = (pessoa: any) => {
    setPessoa(prevPessoa => [...prevPessoa, pessoa]);
    loadingPessoa();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: any): React.ReactNode =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const clickDeletePessoa = async (id: any) => {
    try {
      const response = await getPessoa(`pessoa/${id}`);
      if (response !== false) {
        const position = response.data.position;

        await deletePessoa(id);
        const newPessoas = pessoa.filter(p => p.id !== id);

        const updatedPessoas = await reorderPositions(newPessoas, position);

        setPessoa(updatedPessoas);
        loadingPessoa();
      } else {
        throw new Error('Erro ao deletar pessoa.');
      }
    } catch (error) {
      message.error('Ocorreu um erro ao deletar a pessoa.');
    }
  };

  const handleMenuClick = (e: any) => {
    if (e.key === '1') {
      setShowPessoaModal(true);
    }
  };

  // Atualiza o estado das pessoas com as posições reordenadas
  const reorderPositions = async (pessoas: any[], deletedPosition: any) => {
    const updatedPessoas = pessoas.map(async pessoa => {
      if (pessoa.position > deletedPosition) {
        const res = await getPessoa(`pessoa/${pessoa.id}`);
        if (res !== false) {
          res.data.position -= 1;
          await updatePessoa(res.data, pessoa.id);
        }
        loadingPessoa();
      }
      return pessoa;
    });
    return updatedPessoas;
  };
  const formatCPF = (cpf: any) => {
    if (!cpf) return '';
    const cleanedCPF = cpf.replace(/[^0-9]/g, ''); // Remove todos os caracteres não numéricos
    return cleanedCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4'); // Formata o CPF com pontos e traços
  };

  const renderMenu = (id: any) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordIdPessoa(id);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro da frequencia?"
                    onConfirm={() => clickDeletePessoa(id)}
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
              <EditOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };
  const columns = [
    {
      title: 'N°',
      dataIndex: 'position',
      key: 'position',
      width: '1%',
      ...getColumnSearchProps('position'),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      width: '10%',
      ...getColumnSearchProps('cpf'),
      render: (text: any) => formatCPF(text), // Formata o CPF antes de exibi-lo
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
      width: '10%',
      ...getColumnSearchProps('cargo'),
    },
    {
      title: 'Unidade policial',
      dataIndex: 'unidade_policial',
      key: 'unidade_policial',
      width: '15%',
      ...getColumnSearchProps('unidade_policial'),
    },
    {
      title: 'Regional',
      dataIndex: 'regional',
      key: 'regional',
      width: '10%',
      ...getColumnSearchProps('regional'),
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      key: 'situacao',
      width: '5%',
      ...getColumnSearchProps('situacao'),
    },
    {
      title: 'Faltas',
      dataIndex: 'faltas',
      key: 'faltas',
      width: '5%',
      ...getColumnSearchProps('faltas'),
    },
    {
      title: 'Observação',
      dataIndex: 'observacao',
      key: 'observacao',
      width: '20%',
      ...getColumnSearchProps('observacao'),
    },

    {
      title: 'Ação',
      dataIndex: 'id',
      key: 'action',
      width: '5%',
      render: (id: string) => (
        <>
          <span>{renderMenu(id)}</span>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        className="button-criar"
        type="primary"
        onClick={() => {
          setChave('2');
          handleBoletimClick();
        }}
      >
        Voltar
      </Button>

      <Button
        className="button-criar"
        type="primary"
        onClick={() => {
          setShowPessoaModal(true);
        }}
      >
        Cadastrar servidor
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={pessoa}
          pagination={false}
          className="tabela"
        />
      )}
      <ModalPessoa
        updatePessoaList={updatePessoaList}
        id={recordIdPessoa}
        frequenciaId={frequenciaId}
        closeModal={hideModal}
        openModal={showPessoaModal}
      />
    </>
  );
}
