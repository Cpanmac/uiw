Checkbox 多选框
===

一组备选项中进行多选

```jsx
import { Checkbox } from '@uiw/core';
```

### 基础用法

单独使用可以表示两种状态之间的切换，半选中只是样式上的表现。

<!--DemoStart--> 
```js
const Demo = () => (
  <div style={{ backgroundColor: '#fff', margin: -15, padding: 15, borderRadius: '5px 5px 0 0' }}>
    <Checkbox onChange={(e) =>{
      console.log(e.target.checked)
      console.log(e.target)
    }}>未选中</Checkbox>
    <Checkbox checked >选中</Checkbox>
    <Checkbox indeterminate >半选中</Checkbox>
  </div>
);
```
<!--End-->

### 禁用样式

通过设置 `disabled` 属性来禁用多选框。

<!--DemoStart--> 
```js
const Demo = () => (
  <div style={{ backgroundColor: '#fff', margin: -15, padding: 15, borderRadius: '5px 5px 0 0' }}>
    <Checkbox disabled checked>未选中禁用</Checkbox>
    <Checkbox disabled checked>选中禁用</Checkbox>
    <Checkbox disabled indeterminate>半选中禁用</Checkbox>
  </div>
);
```
<!--End-->

### 多选组

方便的从数组生成 `Checkbox` 组。

<!--DemoStart--> 
```js
class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ['四川菜', '新疆菜'],
    };
  }
  onChange(e, list) {
    console.log('Value:-->', e.target.value, list);
    this.setState({ value: list });
  }
  render() {
    return (
      <div style={{ backgroundColor: '#fff', margin: -15, padding: 15, borderRadius: '5px 5px 0 0' }}>
        <Checkbox.Group name="cuisine" value={this.state.value} onChange={this.onChange.bind(this)}>
          <div>川菜</div>
          <Checkbox value="四川菜">四川菜</Checkbox>
          <Checkbox value="湖北菜">湖北菜</Checkbox>
          <div>本帮江浙菜</div>
          <Checkbox value="西北菜">西北菜</Checkbox>
          <Checkbox value="新疆菜">新疆菜</Checkbox>
          <div>家常菜</div>
          <Checkbox value="东北菜">东北菜</Checkbox>
          <Checkbox value="北京烤鸭">北京烤鸭</Checkbox>
        </Checkbox.Group>
        <Divider />
        <Button
          type="primary"
          onClick={() => {
            // console.log('set::', ['东北菜', '北京烤鸭']);
            this.setState({ value: ['东北菜', '北京烤鸭'] });
          }}
        >
          选中两个
        </Button>
      </div>
    )
  }
}
```
<!--End-->

## Checkbox

| 参数      | 说明    | 类型      |  默认值   |
|--------- |-------- |---------- |-------- |
| options | 指定当前是否选中 | Boolean | false |
| disabled | 禁用 | Boolean | false |
| onChange | 变化时回调函数 | Function(e:Event, checked:Boolean) | - |
| checked | 指定当前是否选中 | Boolean | false |
| indeterminate | 半选中，只负责样式控制 | Boollean | false |

## Checkbox.Group

| 参数      | 说明    | 类型      |  默认值   |
|--------- |-------- |---------- |-------- |
| name | 隐藏输入的名称，在表单中使用时很有用 | string | - |
| value | 控制时 `select` 的值必须与 `onChange` 函数一起使用才能更新 `select` 的值 | Array | `[]` |
| onChange | 变化时回调函数 | Function(e:Event, checkedValues: Array) | - |
