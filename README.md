# Eva.js Joystick

基于 Eva.js 的虚拟摇杆

![](https://user-images.githubusercontent.com/4632277/128896471-de547d92-2c4f-4299-92b5-a7d3264ca6c0.png)

## Usage
```js
import { Joystick } from 'eva-plugin-joystick'

const go = new GameObject('joystick')

const joystick = go.addComponent(new Joystick({
  followPointer: {
    open: true,
    area: {
      x: 0, y: 0,
      width: 400,
      height: 600
    }
  }
}))

joystick.on(JOYSTICK_EVENT.Begin, (data) => {
  console.log('begin', data)
})
joystick.on(JOYSTICK_EVENT.Drag, (data) => {
  console.log('drag', data)
})
joystick.on(JOYSTICK_EVENT.End, (data) => {
  console.log('end', data)
})


game.scene.addChild(go)

```

## 参数
  
- limitRadius `number` `optional`

  摇杆的半径，限制操作杆的移动范围

- boxImageResource `string` `optional`

  背景图片

- boxRadius `number` `optional`

  背景图片的半径

- btnImageResource `string` `optional`

  操作杆的图片

- btnRadius `number` `optional`

  操作杆图片的半径

- followPointer `object` `optional`
  
  手指跟随
  - open `boolean`
    
    是否打开手指跟随
  - area `object` `request`
    
    手指跟随生效的范围 必填
    - x `number` 
    - y `number`
    - width `number`
    - height `nubmer`


## 事件
```js
joystick.on(JOYSTICK_EVENT.Begin, (data) => {
  console.log('begin', data)
  data.x 
  data.y
})
```
参数为摇杆移动的二维向量，-1,1之间

- JOYSTICK_EVENT.Begin

  摇杆开始事件

- JOYSTICK_EVENT.Drag

  摇杆拖拽事件

- JOYSTICK_EVENT.End

  摇杆结束事件