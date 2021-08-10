import { resource, RESOURCE_TYPE } from '@eva/eva.js';
import { Game, GameObject } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event';
import { ImgSystem } from '@eva/plugin-renderer-img';
import { Joystick, JOYSTICK_EVENT } from '../src'

resource.addResource([
  {
    name: "box",
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: "png",
        url: "./box.png"
      }
    },
  }, {
    name: "btn",
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: "png",
        url: "./btn.png"
      }
    }
  }
])

const game = new Game({
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: 800,
      height: 600,
    }),
    new ImgSystem(),
    new EventSystem()
  ],
});

window.game = game


game.scene.transform.size = {
  width: 800,
  height: 600
}

const go = new GameObject('joystick', {
  position: { x: 200, y: 400 },
})

const joystick = go.addComponent(new Joystick({
  boxImageResource: 'box',
  btnImageResource: 'btn',
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
