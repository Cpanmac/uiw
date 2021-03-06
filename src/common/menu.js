const menuData = [
  {
    name: '指南',
    path: 'guide',
    icon: 'home',
    children: [
      { name: '快速开始', path: 'quick-start' },
      { name: '在 create-react-app 中使用', path: 'create-react-app' },
      { name: '在 kkt 中使用', path: 'kkt' },
      { name: '更新日志', path: 'changelog' },
      { name: '社区精选组件', path: 'recommendation' },
    ],
  },
  {
    name: '组件',
    path: 'components',
    icon: 'component',
    children: [
      { divider: true, name: '基本' },
      { name: 'Color 颜色', path: 'colors' },
      { name: 'Grid 删格', path: 'Grid' },
      { name: 'Icon 图标', path: 'icon' },
      { name: 'Button 按钮', path: 'button' },
      { divider: true, name: '表单' },
      { name: 'Form 表单', path: 'form' },
      { name: 'Radio 单选框', path: 'radio' },
      { name: 'Checkbox 多选框', path: 'checkbox' },
      { name: 'Switch 开关', path: 'switch' },
      { name: 'Select 选择器', path: 'select' },
      { name: 'Input 输入框', path: 'input' },
      { divider: true, name: '数据显示' },
      { name: 'Avatar 头像', path: 'avatar' },
      { name: 'Badge 标记', path: 'badge' },
      { name: 'Card 卡片', path: 'card' },
      { name: 'Tag 标签', path: 'tag' },
      { name: 'Progress 进度条', path: 'progress' },
      { name: 'Rate 评分', path: 'rate' },
      { name: 'List 列表', path: 'list' },
      { divider: true, name: '导航' },
      { name: 'Breadcrumb 面包屑', path: 'breadcrumb' },
      { divider: true, name: '反馈' },
      { name: 'Overlay 基础弹出层', path: 'overlay' },
      { divider: true, name: '其它' },
      { name: 'Divider 分割线', path: 'divider' },
      { name: 'CopyToClipboard 复制', path: 'copy-to-clipboard' },
    ],
  },
  {
    name: '提交问题',
    icon: 'issue',
    path: 'https://github.com/uiw-react/uiw/issues/new',
  },
  {
    name: 'Github',
    icon: 'github',
    path: 'https://github.com/uiw-react/uiw',
  },
];

function formatter(data, parentPath = '/', pathname) {
  return Object.keys(data).map((item) => {
    let { path } = data[item];
    if (/^https?:(?:\/\/)?/.test(path)) {
      path = data[item].path;
    } else {
      path = parentPath + data[item].path;
    }
    const result = { ...data[item], path };
    if (data[item].children) {
      result.children = formatter(data[item].children, `${parentPath}${data[item].path}/`, data[item].authority);
    }
    return result;
  });
}


function formatterCurrent(data, pathname, parentPath = '/', result) {
  for (let i = 0; i < data.length; i += 1) {
    let path = data[i].path;
    if (/^https?:(?:\/\/)?/.test(path)) {
      path = data[i].path;
    } else {
      path = parentPath + data[i].path;
    }
    if (path === pathname) {
      result = data[i];
      break;
    }
    if (data[i].children && data[i].children.length > 0 && !result) {
      result = formatterCurrent(data[i].children, pathname, `${path}/`);
    }
  }
  return result;
}


const getMenuData = () => formatter(menuData);
const getMenuCurrentData = path => formatterCurrent(menuData, path);

export {
  getMenuData,
  getMenuCurrentData,
};
