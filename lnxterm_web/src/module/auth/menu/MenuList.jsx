import {createContext} from 'react';
import {useContext} from 'react';
import {useEffect} from 'react';
import {useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tooltip} from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import {CloseOutlined} from '@ant-design/icons';
import {HolderOutlined} from '@ant-design/icons';
import {LineOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {CSS} from '@dnd-kit/utilities';
import {DndContext} from '@dnd-kit/core';
import {SortableContext} from '@dnd-kit/sortable';
import {arrayMove} from '@dnd-kit/sortable';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {useSortable} from '@dnd-kit/sortable';
import {verticalListSortingStrategy} from '@dnd-kit/sortable';
import api from './api.js';
import store from './store.js';

// https://docs.dndkit.com/presets/sortable
// https://ant.design/components/table#table-demo-drag-sorting-handler
const RowContext = createContext({});
const DragHandle = () => {
  const {setActivatorNodeRef, listeners} = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{cursor: 'move'}}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};
const Row = props => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: props['data-row-key']});
  const style = Object.assign(
    Object.assign(Object.assign({}, props.style), {
      transform: CSS.Translate.toString(transform),
      transition,
    }),
    isDragging ? {position: 'relative', zIndex: 9999} : {},
  );
  const contextValue = useMemo(
    () => ({setActivatorNodeRef, listeners}),
    [setActivatorNodeRef, listeners],
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

function MenuList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeMenus = useSelector(store.getMenus);
  const storeMenuTableLoading = useSelector(store.getMenuTableLoading);

  useEffect(() => {
    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addMenu() {
    dispatch(store.setMenuFormAddVisible(true));
  }

  function copyMenu(id) {
    dispatch(store.setMenu({id}));
    dispatch(store.setMenuFormCopyVisible(true));
  }

  async function deleteMenu(id) {
    try {
      await api.delete_menu(id);
      message.success('Request succeeded', 1);

      dispatch(store.setMenuTableLoading(true));
      const response = await api.get_menus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setMenuTableLoading(false));
    }
  }

  function getMenu(id) {
    dispatch(store.setMenu({id}));
    dispatch(store.setMenuDetailVisible(true));
  }

  async function getMenus() {
    try {
      dispatch(store.setMenuTableLoading(true));
      const response = await api.get_menus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setMenuTableLoading(false));
    }
  }

  function sortMenu(newMenus) {
      let id_sorts = [];
      newMenus.forEach((element, index) => {
        if (element.id !== storeMenus[index].id) {
          id_sorts.push(element.id + '_' + index);
        }
      });
      id_sorts = id_sorts.join(',');

      (async () => {
        try {
          dispatch(store.setMenuTableLoading(true));

          await api.sort_menu(id_sorts);
          message.success('Request succeeded', 1);

          const response = await api.get_menus();
          dispatch(store.setMenus(response.data.data));
        } catch (error) {
          console.error(error);
          message.error(error.message);
        } finally {
          dispatch(store.setMenuTableLoading(false));
        }
      })();
  }

  function updateMenu(id) {
    dispatch(store.setMenu({id}));
    dispatch(store.setMenuFormUpdateVisible(true));
  }

  const columns = [
    {
      key: 'code',
      title: 'Code',
      dataIndex: 'code',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getMenu(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        record.parent_menu_id === 0 ? text : (
          <span>
            &nbsp;&nbsp;
            <LineOutlined rotate={90} />
            <LineOutlined style={{marginLeft: '-8px'}} />
            &nbsp;&nbsp;
            {text}
          </span>
        )
      ),
    },
    {
      title: () => (
        <span>
          Is Visible
          &nbsp;
          <Tooltip title="Show on the Left Side or Not"><QuestionCircleOutlined /></Tooltip>
        </span>
      ),
      dataIndex: 'is_virtual',
      render: (text) => (text === 0) ? (<span><CheckOutlined /></span>) : (<span><CloseOutlined /></span>),
    },
    {
      key: 'sort',
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      render: () => <DragHandle />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateMenu(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteMenu(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => copyMenu(record.id)}>Copy</Button>
        </span>
      ),
    },
  ];

  const onDragEnd = ({active, over}) => {
    if (active.id !== (over === null || over === void 0 ? void 0 : over.id)) {
      const prevState = storeMenus;

      const activeIndex = prevState.findIndex(
        record => record.id === (active === null || active === void 0 ? void 0 : active.id),
      );
      const overIndex = prevState.findIndex(
        record => record.id === (over === null || over === void 0 ? void 0 : over.id),
      );

      const newMenus = arrayMove(prevState, activeIndex, overIndex);

      dispatch(store.setMenus(newMenus));

      sortMenu(newMenus);
    }
  };

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Menu List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addMenu()}>New Menu</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getMenus()}>Refresh</Button>
        </Space>
      </div>

      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={storeMenus.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={storeMenus}
            loading={storeMenuTableLoading}
            pagination={false}
            showSorterTooltip={false}
            size="small"
            scroll={{x: 'max-content'}}
            components={{body: {row: Row}}}
          />
        </SortableContext>
      </DndContext>
    </>
  );
}

export default MenuList;
